import Link from "next/link";
import { AlertTriangle, Eye, MapPin } from "lucide-react";

import type { ChildDataRaw } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { translateAlert } from "@/lib/alerts";

function getChildAlerts(child: ChildDataRaw): string[] {
  return [
    ...(child.saude?.alertas ?? []),
    ...(child.educacao?.alertas ?? []),
    ...(child.assistencia_social?.alertas ?? []),
  ].map(translateAlert);
}

function getChildAge(dataNascimento?: string): number | null {
  if (!dataNascimento) return null;

  const birth = new Date(dataNascimento);
  if (Number.isNaN(birth.getTime())) return null;

  const today = new Date();
  let idade = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    idade -= 1;
  }

  return idade >= 0 ? idade : null;
}

export default function ChildrenList({ children }: { children: ChildDataRaw[] }) {
  if (children.length === 0) {
    return (
      <Card className="border-[#13335a]/15 bg-white">
        <CardContent className="py-6 text-sm text-[#5a6b82]">
          Nenhuma criança encontrada com os filtros selecionados.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {children.map((child) => {
        const alerts = getChildAlerts(child);
        const hasAlerts = alerts.length > 0;
        const idade = getChildAge(child.data_nascimento);

        return (
          <Card
            key={child.id ?? child.nome}
            className={`bg-white transition-all hover:shadow-md ${
              hasAlerts ? "border-l-4 border-l-orange-500" : "border-[#13335a]/10"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="truncate font-medium text-[#13335a]">{child.nome ?? "Sem nome"}</h3>
                    {hasAlerts ? <AlertTriangle className="h-4 w-4 shrink-0 text-orange-600" /> : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-[#5a6b82]">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {child.bairro ?? "Bairro não informado"}
                    </span>

                    {idade !== null ? (
                      <>
                        <span className="mx-1 text-[#5a6b82]">|</span>
                        <span>{idade} anos</span>
                      </>
                    ) : null}

                    {child.revisado ? (
                      <>
                      <span className="mx-1 text-[#5a6b82]">|</span>
                        <Badge variant="outline" className="border-green-200 bg-green-50 text-xs text-green-700">
                          Revisado
                        </Badge>
                      </>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm text-[#5a6b82]">Responsável: {child.responsavel ?? "Não informado"}</p>

                  {alerts.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {alerts.map((alert, idx) => (
                        <Badge key={`${child.id}-${idx}`} variant="secondary" className="text-xs">
                          {alert}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                <Link href={`/dashboard/${child.id}`} className="self-start">
                  <Button
                    variant="outline"
                    size="sm"
                    className="sm:self-start border-[#13335a]/20 text-[#13335a] hover:bg-[#13335a] hover:text-white"
                  >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver detalhes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}