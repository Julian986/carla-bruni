/** Variables para la plantilla Twilio de recordatorio ({{1}} nombre, {{2}} servicio, {{3}} fecha/hora). */
export function buildReminderContentVariables(input: {
  nombre: string;
  servicio: string;
  fecha: string;
  hora: string;
}): { contentVariablesJson: string; templateVariables: Record<string, string> } {
  const fechaConHora = `${input.fecha} a las ${input.hora}`;
  return {
    contentVariablesJson: JSON.stringify({
      "1": input.nombre,
      "2": input.servicio,
      "3": fechaConHora,
      "4": input.hora,
    }),
    templateVariables: {
      nombre: input.nombre,
      servicio: input.servicio,
      fecha: input.fecha,
      hora: input.hora,
      fechaConHora,
    },
  };
}
