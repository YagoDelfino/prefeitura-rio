
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

type ChildDataRaw = {
  id?: string;
  nome?: string;
  data_nascimento?: string;
  bairro?: string;
  responsavel?: string;
  saude?: {
    ultima_consulta?: string;
    vacinas_em_dia?: boolean;
    alertas?: string[];
  };
  educacao?: {
    escola?: string | null;
    frequencia_percent?: number | null;
    alertas?: string[];
  };
  assistencia_social?: {
    cad_unico?: boolean;
    beneficio_ativo?: boolean;
    alertas?: string[];
  };
  revisado?: boolean;
  revisado_por?: string;
  revisado_em?: string;
}

export type { SummaryData, ChildDataRaw };
