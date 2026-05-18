import { getDb } from "@/lib/mongodb";

export const SALON_SETTINGS_COLLECTION = "salon_settings";
export const PUBLIC_BOOKING_SETTINGS_ID = "public_booking";

export type PublicBookingSettingsSnapshot = {
  publicOnlineBookingEnabled: boolean;
  updatedAt: string | null;
  updatedBy: string | null;
  /** Si un env de emergencia está pisando la DB. */
  envForced: boolean;
};

type PublicBookingSettingsDoc = {
  _id: typeof PUBLIC_BOOKING_SETTINGS_ID;
  publicOnlineBookingEnabled: boolean;
  updatedAt: Date;
  updatedBy: string;
};

const CACHE_TTL_MS = 45_000;

let cache: { snapshot: PublicBookingSettingsSnapshot; expiresAt: number } | null = null;

function parseEnvFlag(value: string | undefined, defaultWhenUnset: boolean): boolean {
  if (value === undefined || value.trim() === "") return defaultWhenUnset;
  const v = value.trim().toLowerCase();
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  if (v === "1" || v === "true" || v === "yes" || v === "on") return true;
  return defaultWhenUnset;
}

/** Valor inicial al crear el documento (migración desde env). */
function seedEnabledFromEnv(): boolean {
  return parseEnvFlag(process.env.PUBLIC_BOOKING_ENABLED, true);
}

/**
 * Kill switch: si está definido, pisa Mongo (emergencias sin entrar al panel).
 * `PUBLIC_BOOKING_FORCE_ENABLED=false` corta reserva online aunque el panel diga lo contrario.
 */
function envForceOverride(): boolean | null {
  const raw = process.env.PUBLIC_BOOKING_FORCE_ENABLED?.trim();
  if (!raw) return null;
  return parseEnvFlag(raw, true);
}

function snapshotFromDoc(doc: PublicBookingSettingsDoc): PublicBookingSettingsSnapshot {
  return {
    publicOnlineBookingEnabled: doc.publicOnlineBookingEnabled,
    updatedAt: doc.updatedAt.toISOString(),
    updatedBy: doc.updatedBy,
    envForced: false,
  };
}

function snapshotFromEnvForced(enabled: boolean): PublicBookingSettingsSnapshot {
  return {
    publicOnlineBookingEnabled: enabled,
    updatedAt: null,
    updatedBy: null,
    envForced: true,
  };
}

export function invalidatePublicBookingSettingsCache(): void {
  cache = null;
}

async function readDocFromDb(): Promise<PublicBookingSettingsDoc | null> {
  const db = await getDb();
  const doc = await db
    .collection<PublicBookingSettingsDoc>(SALON_SETTINGS_COLLECTION)
    .findOne({ _id: PUBLIC_BOOKING_SETTINGS_ID });
  return doc;
}

async function ensureSettingsDoc(): Promise<PublicBookingSettingsDoc> {
  const existing = await readDocFromDb();
  if (existing) return existing;

  const now = new Date();
  const doc: PublicBookingSettingsDoc = {
    _id: PUBLIC_BOOKING_SETTINGS_ID,
    publicOnlineBookingEnabled: seedEnabledFromEnv(),
    updatedAt: now,
    updatedBy: "seed",
  };

  const db = await getDb();
  try {
    await db.collection<PublicBookingSettingsDoc>(SALON_SETTINGS_COLLECTION).insertOne(doc);
    return doc;
  } catch (e) {
    const again = await readDocFromDb();
    if (again) return again;
    throw e;
  }
}

export async function getPublicBookingSettings(): Promise<PublicBookingSettingsSnapshot> {
  const forced = envForceOverride();
  if (forced !== null) {
    return snapshotFromEnvForced(forced);
  }

  const now = Date.now();
  if (cache && cache.expiresAt > now) {
    return cache.snapshot;
  }

  const doc = await ensureSettingsDoc();
  const snapshot = snapshotFromDoc(doc);
  cache = { snapshot, expiresAt: now + CACHE_TTL_MS };
  return snapshot;
}

export async function isPublicOnlineBookingEnabled(): Promise<boolean> {
  const s = await getPublicBookingSettings();
  return s.publicOnlineBookingEnabled;
}

export async function setPublicOnlineBookingEnabled(
  enabled: boolean,
  updatedBy = "panel",
): Promise<PublicBookingSettingsSnapshot> {
  const forced = envForceOverride();
  if (forced !== null) {
    throw new PublicBookingSettingsEnvForcedError();
  }

  const now = new Date();
  const db = await getDb();
  await db.collection<PublicBookingSettingsDoc>(SALON_SETTINGS_COLLECTION).updateOne(
    { _id: PUBLIC_BOOKING_SETTINGS_ID },
    {
      $set: {
        publicOnlineBookingEnabled: enabled,
        updatedAt: now,
        updatedBy,
      },
      $setOnInsert: {
        _id: PUBLIC_BOOKING_SETTINGS_ID,
      },
    },
    { upsert: true },
  );

  invalidatePublicBookingSettingsCache();
  const snapshot: PublicBookingSettingsSnapshot = {
    publicOnlineBookingEnabled: enabled,
    updatedAt: now.toISOString(),
    updatedBy,
    envForced: false,
  };
  cache = { snapshot, expiresAt: Date.now() + CACHE_TTL_MS };
  return snapshot;
}

export class PublicBookingSettingsEnvForcedError extends Error {
  constructor() {
    super(
      "El modo de reserva está fijado por configuración del servidor (PUBLIC_BOOKING_FORCE_ENABLED). Quitá esa variable para controlarlo desde el panel.",
    );
    this.name = "PublicBookingSettingsEnvForcedError";
  }
}
