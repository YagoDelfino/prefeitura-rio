import React from "react";
import { AlertTriangle, AlertCircleIcon, CheckCircle2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SummaryData } from "../../types";

export default function Summary({ summary }: { summary: SummaryData }) {
  const total = summary?.total ?? 0;
  const revisado = summary?.revisado ?? 0;
  const alertas = {
    saude: summary?.alertas?.saude ?? 0,
    educacao: summary?.alertas?.educacao ?? 0,
    assistencia_social: summary?.alertas?.assistencia_social ?? 0,
  };
  const criancasComAlertas = summary?.criancasComAlertas ?? 0;

  const revisadoPorcentagem = total > 0 ? ((revisado / total) * 100).toFixed(0) : "0";

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-[#13335a]/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#5a6b82]">Total de Criancas</CardTitle>
          <Users className="h-4 w-4 text-[#13335a]" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-[#13335a]">{total}</div>
          <p className="mt-1 text-xs text-[#5a6b82]">Cadastradas no sistema</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#5a6b82]">Crianças com Alertas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-orange-700">{criancasComAlertas}</div>
          <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#5a6b82]">Crianças encontradas com alertas</span>
              </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#5a6b82]">Total de Alertas</CardTitle>
          <AlertCircleIcon className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-red-700">{alertas.assistencia_social + alertas.educacao + alertas.saude}</div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5a6b82]">Saúde:</span>
              <span className="font-medium text-red-700">{alertas.saude}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5a6b82]">Educação:</span>
              <span className="font-medium text-red-700">{alertas.educacao}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#5a6b82]">Assistência:</span>
              <span className="font-medium text-red-700">{alertas.assistencia_social}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#5a6b82]">Crianças já Revisadas</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-green-700">{revisado}</div>
          <p className="mt-1 text-xs text-[#5a6b82]">{revisadoPorcentagem}% do total</p>
        </CardContent>
      </Card>

      <Card className="border-[#42b9eb]/30 bg-[#42b9eb]/5 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-[#5a6b82]">Crianças Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-[#2a688f]"/>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-semibold text-[#2a688f]">{total - revisado}</div>
          <p className="mt-1 text-xs text-[#5a6b82]">Aguardando revisão</p>
        </CardContent>
      </Card>
    </div>
  );
}