const ALERT_LABELS: Record<string, string> = {
  frequencia_baixa: "Frequência escolar baixa",
  vacinas_atrasadas: "Vacinas atrasadas",
  consulta_atrasada: "Consulta atrasada",
  beneficio_suspenso: "Benefício suspenso",
  cadastro_ausente: "Cadastro ausente",
  cadastro_desatualizado: "Cadastro desatualizado",
  matricula_pendente: "Matrícula pendente",
};

function translateAlert(alert: string): string {
  return ALERT_LABELS[alert] ?? alert;
}

export { ALERT_LABELS, translateAlert };
