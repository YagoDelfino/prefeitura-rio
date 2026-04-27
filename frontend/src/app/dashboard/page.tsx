'use client';

import { useEffect, useState } from "react";
import Summary from "./components/summary";
import type { SummaryData } from "../types";

const EMPTY_SUMMARY: SummaryData = {
  total: 0,
  revisado: 0,
  alertas: {
    saude: 0,
    educacao: 0,
    assistencia_social: 0,
  },
  criancasComAlertas: 0,
};

async function fetchSummary(): Promise<SummaryData> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/api/children/summary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Erro ao buscar resumo:", response.statusText);
      return EMPTY_SUMMARY;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro na requisição do resumo:", error);
    return EMPTY_SUMMARY;
  }
}

export default function PageDashboard() {
  const [summary, setSummary] = useState<SummaryData>(EMPTY_SUMMARY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      setLoading(true);
      const data = await fetchSummary();
      setSummary(data);
      setLoading(false);
    }

    loadSummary();
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl typo-subtitle text-var(--color-text-primary) mb-1">Visão Geral</h2>
        <p className="text-sm">
          Acompanhamento de crianças em situação de vulnerabilidade social
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-[#5a6b82]">Carregando resumo...</div>
      ) : (
        <Summary summary={summary} />
      )}

      
    </div>
  );
}