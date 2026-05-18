import TurnosClient from "./turnos-client";
import { isPublicOnlineBookingEnabled } from "@/lib/booking/public-booking-config";

type TurnosPageProps = {
  searchParams?: Promise<{
    treatment?: string;
  }>;
};

export default async function TurnosPage({ searchParams }: TurnosPageProps) {
  const params = (await searchParams) ?? {};
  const publicOnlineBookingEnabled = await isPublicOnlineBookingEnabled();

  return (
    <TurnosClient
      initialTreatment={params.treatment}
      publicOnlineBookingEnabled={publicOnlineBookingEnabled}
    />
  );
}
