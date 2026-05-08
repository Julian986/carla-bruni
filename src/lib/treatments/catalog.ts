/** Categorías para filtrar en la app de turnos y en la lista de servicios. */
export const TREATMENT_CATEGORIES = [
  "Freyja · Low Cost",
  "Freyja · Premium",
  "Alta energía",
  "Corporal",
  "Láser",
] as const;

export type TreatmentCategory = (typeof TREATMENT_CATEGORIES)[number];

const IMG = {
  facial: "https://images.unsplash.com/photo-1570172619643-d5b24d6b0945?auto=format&fit=crop&w=900&q=80",
  tech: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80",
  corporal: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
  laser: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80",
} as const;

export type SalonTreatment = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: TreatmentCategory;
  durationLabel: string;
  durationMinutes: number;
  imageUrl: string;
};

/** Servicios Carla Bruni · Espacio Freyja (duraciones según carta; láser 15′ y 30′). */
export const SALON_TREATMENTS: SalonTreatment[] = [
  {
    id: "freyja-esencial",
    name: "Freyja · Esencial",
    subtitle: "60′ · $42.000",
    description:
      "Sesiones pensadas como primer acercamiento al cuidado consciente de la piel. Tratamientos simples, equilibrados y respetuosos, ideales para mantener la piel sana y acompañar sus necesidades básicas.",
    category: "Freyja · Low Cost",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-regulador",
    name: "Freyja · Regulador",
    subtitle: "60′ · $45.000",
    description:
      "Sesión de higiene profunda que renueva, equilibra y prepara la piel. Incluye punta de diamante, ácido de temporada y restauración del pH. Apta para todo tipo de piel. No incluye extracción.",
    category: "Freyja · Low Cost",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-aqua",
    name: "Freyja · Aqua",
    subtitle: "40′ · $42.000",
    description:
      "Sesión ultra hidratante para confort, suavidad y luminosidad. Indicada para pieles deshidratadas, con poros dilatados y textura áspera.",
    category: "Freyja · Low Cost",
    durationLabel: "40′",
    durationMinutes: 40,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-balance-free",
    name: "Freyja · Balance free",
    subtitle: "60′ · $42.000",
    description:
      "Sesión calmante para pieles sensibles y reactivas. Alta frecuencia y máscara LED verde para restablecer el manto cutáneo, desinflamar y revitalizar.",
    category: "Freyja · Low Cost",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-bioestimulacion-hifu-12d",
    name: "Freyja · Bioestimulación Hifu 12Dmax",
    subtitle: "45′ · $60.000",
    description:
      "Estimula la formación de colágeno con ultrasonido focalizado. A diferencia del HIFU 25D, no aplica otras tecnologías en la misma sesión.",
    category: "Freyja · Low Cost",
    durationLabel: "45′",
    durationMinutes: 45,
    imageUrl: IMG.tech,
  },
  {
    id: "freyja-consulta-analisis-primera-piel",
    name: "FREYJA · Consulta, análisis y primera piel",
    subtitle: "90′ · $65.000",
    description:
      "Todo lo que vos y tu piel necesitan: estado de la piel, coach estético profesional y Primera Piel — renovación, equilibrio y restauración. Paso fundamental antes de tratamientos posteriores.",
    category: "Freyja · Premium",
    durationLabel: "90′",
    durationMinutes: 90,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-induccion-colageno",
    name: "FREYJA · Inducción de colágeno",
    subtitle: "Dermapen + colágeno + LED · 60′ · $60.000",
    description:
      "Regeneración cutánea que estimula colágeno natural. Dermapen mejora textura, luminosidad y firmeza; la máscara LED optimiza la recuperación. Ideal para pieles apagadas, líneas finas o poros visibles.",
    category: "Freyja · Premium",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-dermoactivos",
    name: "FREYJA · Dermoactivos",
    subtitle: "60′ · $60.000",
    description:
      "Inducción de activos específicos según diagnóstico, con Dermapen. Cada sesión es personalizada para mejorar la calidad global de la piel de forma consciente y respetuosa.",
    category: "Freyja · Premium",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-pdrn",
    name: "FREYJA · PDRN",
    subtitle: "60′ · $65.000",
    description:
      "Tratamiento regenerador para reparación tisular y calidad en profundidad. Indicado para pieles desvitalizadas o con signos de envejecimiento. Firmeza y luminosidad sin agredir.",
    category: "Freyja · Premium",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-exosomas",
    name: "FREYJA · Exosomas",
    subtitle: "60′ · $65.000",
    description:
      "Bioestimulación avanzada a nivel celular. Indicada para daño acumulado, envejecimiento visible o necesidad de regeneración profunda. Mejora textura y acompaña la reparación natural.",
    category: "Freyja · Premium",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-hifu-25d-facial",
    name: "FREYJA · HIFU 25D",
    subtitle: "Estimulación profunda · 60′ · $89.000",
    description:
      "Tecnología en planos profundos del tejido, siempre indicada por diagnóstico. Estimula, reafirma y mejora la calidad del tejido de forma consciente.",
    category: "Alta energía",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.tech,
  },
  {
    id: "freyja-exilis",
    name: "FREYJA · Exilis",
    subtitle: "Reafirmación · 60′ · $50.000",
    description:
      "Radiofrecuencia avanzada para firmeza, textura y calidad global de la piel. Indicada como sostén, mantenimiento o complemento de otros estímulos profundos.",
    category: "Alta energía",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.tech,
  },
  {
    id: "freyja-peeling-acidos",
    name: "FREYJA · Peeling ácidos",
    subtitle: "60′ · $55.000",
    description:
      "Renovación celular profunda con ácidos de tendencia según mapeo y necesidad de la piel. Recomendación: 1 a 2 sesiones al mes (4 a 6 en total).",
    category: "Alta energía",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.facial,
  },
  {
    id: "freyja-liposonix",
    name: "FREYJA · Liposonix",
    subtitle: "Por zona · 40′ · $39.000",
    description:
      "Ultrasonido focalizado para adiposidad localizada y mejor definición corporal.",
    category: "Corporal",
    durationLabel: "40′",
    durationMinutes: 40,
    imageUrl: IMG.corporal,
  },
  {
    id: "freyja-hifu-25d-corporal",
    name: "FREYJA · HIFU 25D (corporal)",
    subtitle: "Por zona · 40′ · $50.000",
    description:
      "Ultrasonido focalizado más radiofrecuencia fraccionada para tensado inmediato y EMS para estimular músculos. Reducción localizada y definición.",
    category: "Corporal",
    durationLabel: "40′",
    durationMinutes: 40,
    imageUrl: IMG.corporal,
  },
  {
    id: "freyja-vacuum-rf",
    name: "FREYJA · Vacum y radiofrecuencia",
    subtitle: "Por zona · 60′ · $35.000",
    description:
      "Planes mensuales pensados para celulitis y drenaje profundo.",
    category: "Corporal",
    durationLabel: "60′",
    durationMinutes: 60,
    imageUrl: IMG.corporal,
  },
  {
    id: "depilacion-laser-15",
    name: "Depilación láser · sesión 15′",
    subtitle: "15′ · consultar valor por zona",
    description:
      "Depilación láser definitiva. Sesiones de 15 minutos según zona a tratar; indicación y valor según evaluación.",
    category: "Láser",
    durationLabel: "15′",
    durationMinutes: 15,
    imageUrl: IMG.laser,
  },
  {
    id: "depilacion-laser-30",
    name: "Depilación láser · sesión 30′",
    subtitle: "30′ · consultar valor por zona",
    description:
      "Depilación láser definitiva. Sesiones de 30 minutos según zona a tratar; indicación y valor según evaluación.",
    category: "Láser",
    durationLabel: "30′",
    durationMinutes: 30,
    imageUrl: IMG.laser,
  },
];

export function findSalonTreatmentByName(name: string): SalonTreatment | undefined {
  const t = name.trim();
  return SALON_TREATMENTS.find((x) => x.name === t);
}

export function findSalonTreatmentById(id: string): SalonTreatment | undefined {
  return SALON_TREATMENTS.find((x) => x.id === id);
}

/** Duración mostrada en el panel; si es reserva antigua, devuelve un texto genérico. */
export function panelDurationLabel(treatmentName: string, category: string): string {
  const byName = findSalonTreatmentByName(treatmentName);
  if (byName) return byName.durationLabel;
  if (category === "Láser") return "15′–30′";
  if (category === "Freyja · Premium") return "60′–90′";
  if (category === "Corporal") return "40′–60′";
  return "Consultar";
}
