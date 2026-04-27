
type SummaryData = {
  total?: number;
  revisado?: number;
  alertas?: {
    saude?: number;
    educacao?: number;
    assistencia_social?: number;
  };
  criancasComAlertas?: number;
};

export type { SummaryData };
