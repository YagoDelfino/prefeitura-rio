'use client';

import * as React from "react";

import Summary from "./components/Summary";
import ChildrenList from "./components/ChildrenList";
import type { ChildDataRaw, SummaryData } from "../types";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type BooleanFilter = "todos" | "true" | "false";

type ChildrenQueryFilters = {
  neighborhoods?: string[];
  revisado?: BooleanFilter;
  comAlerta?: BooleanFilter;
  pagina?: number;
  limite?: number;
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
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição do resumo:", error);
    return {};
  }
}

async function fetchChildren(filters: ChildrenQueryFilters = {}): Promise<ChildDataRaw[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const params = new URLSearchParams();

    if (filters.neighborhoods && filters.neighborhoods.length > 0) {
      params.set("bairro", filters.neighborhoods.join(","));
    }

    if (filters.revisado && filters.revisado !== "todos") {
      params.set("revisado", filters.revisado);
    }

    if (filters.comAlerta && filters.comAlerta !== "todos") {
      params.set("comAlerta", filters.comAlerta);
    }

    if (filters.pagina) {
      params.set("pagina", String(filters.pagina));
    }

    if (filters.limite) {
      params.set("limite", String(filters.limite));
    }

    const query = params.toString();
    const url = `${apiUrl}/api/children${query ? `?${query}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Erro ao buscar crianças:", response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Erro na requisição das crianças:", error);
    return [];
  }
}

export default function PageDashboard() {
  const [summary, setSummary] = React.useState<SummaryData>({});
  const [children, setChildren] = React.useState<ChildDataRaw[]>([]);
  const [neighborhoods, setNeighborhoods] = React.useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = React.useState<string[]>([]);
  const [reviewFilter, setReviewFilter] = React.useState<BooleanFilter>("todos");
  const [alertFilter, setAlertFilter] = React.useState<BooleanFilter>("todos");
  const [page, setPage] = React.useState(1);
  const limit = 10;

  const [summaryLoading, setSummaryLoading] = React.useState(true);
  const [childrenLoading, setChildrenLoading] = React.useState(true);
  const neighborhoodsAnchor = useComboboxAnchor();

  const reviewFilterLabel: Record<BooleanFilter, string> = {
    todos: "Todos",
    true: "Revisados",
    false: "Não revisados",
  };

  const alertFilterLabel: Record<BooleanFilter, string> = {
    todos: "Todos",
    true: "Com alertas",
    false: "Sem alertas",
  };

  React.useEffect(() => {
    async function loadSummary() {
      setSummaryLoading(true);
      const data = await fetchSummary();
      setSummary(data);
      setSummaryLoading(false);
    }

    loadSummary();
  }, []);

  React.useEffect(() => {
    async function loadNeighborhoods() {
      const data = await fetchChildren();
      const uniqueNeighborhoods = Array.from(
        new Set(data.map((child) => child.bairro).filter(Boolean))
      ) as string[];
      setNeighborhoods(uniqueNeighborhoods);
    }

    loadNeighborhoods();
  }, []);

  React.useEffect(() => {
    async function loadChildren() {
      setChildrenLoading(true);
      const data = await fetchChildren({
        neighborhoods: selectedNeighborhoods,
        revisado: reviewFilter,
        comAlerta: alertFilter,
        pagina: page,
        limite: limit,
      });
      setChildren(data);
      setChildrenLoading(false);
    }

    loadChildren();
  }, [selectedNeighborhoods, reviewFilter, alertFilter, page]);

  React.useEffect(() => {
    setPage(1);
  }, [selectedNeighborhoods, reviewFilter, alertFilter]);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl typo-subtitle text-var(--color-text-primary) mb-1">Visão Geral</h2>
        <p className="text-sm">Acompanhamento de crianças em situação de vulnerabilidade social</p>
      </div>

      {summaryLoading ? (
        <div className="text-center py-8 text-[#5a6b82]">Carregando resumo...</div>
      ) : (
        <Summary summary={summary} />
      )}

      <div className="mb-6">
        <h2 className="text-2xl typo-subtitle text-var(--color-text-primary) mb-1">Lista de Crianças</h2>
      </div>

      <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
          <Combobox
            multiple
            autoHighlight
            items={neighborhoods}
            value={selectedNeighborhoods}
            onValueChange={setSelectedNeighborhoods}
          >
            <ComboboxGroup>
              <ComboboxLabel className="text-sm text-[#5a6b82] p-0">Bairros</ComboboxLabel>
              <ComboboxChips
                ref={neighborhoodsAnchor}
                className="relative w-full rounded-md border border-input bg-white px-3 py-1 pr-8 m-1 shadow-none focus-within:border-ring focus-within:ring-0"
              >
                <ComboboxValue>
                  {(values) => (
                    <React.Fragment>
                      {values.map((value: string) => (
                        <ComboboxChip key={value} className="h-6 rounded-sm bg-muted/70 text-xs">
                          {value}
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        placeholder={values.length === 0 ? "Filtrar por bairros" : ""}
                        className="min-w-16 text-sm text-[var(--color-brand-text)]"
                      />
                    </React.Fragment>
                  )}
                </ComboboxValue>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-2 size-4 -translate-y-1/2 text-muted-foreground" />
              </ComboboxChips>
              <ComboboxContent anchor={neighborhoodsAnchor}>
                <ComboboxList>
                  {(item) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </ComboboxGroup>
          </Combobox>

          <div className="flex flex-col gap-1 text-sm">
            <span className="text-[#5a6b82]">Status de revisão</span>
            <Select value={reviewFilter} onValueChange={(value) => setReviewFilter(value as BooleanFilter)}>
              <SelectTrigger className="h-9 w-full rounded-md border border-input bg-white text-[var(--color-brand-text)] shadow-none focus-visible:ring-0">
                <SelectValue>{reviewFilterLabel[reviewFilter]}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="bottom" align="start">
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="true">Revisados</SelectItem>
                  <SelectItem value="false">Não revisados</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1 text-sm">
            <span className="text-[#5a6b82]">Presença de alertas</span>
            <Select value={alertFilter} onValueChange={(value) => setAlertFilter(value as BooleanFilter)}>
              <SelectTrigger className="h-9 w-full rounded-md border border-input bg-white text-[var(--color-brand-text)] shadow-none focus-visible:ring-0">
                <SelectValue>{alertFilterLabel[alertFilter]}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false} side="bottom" align="start">
                <SelectGroup>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="true">Com alertas</SelectItem>
                  <SelectItem value="false">Sem alertas</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 text-right text-sm text-[#5a6b82] self-center">
            <span> {children.length ? `${children.length}` : 'Nenhuma'} criança{children.length !== 1 ? 's' : ''} </span>
          </div>

        </div>

        {childrenLoading ? (
          <div className="text-center py-8 text-[#5a6b82]">Carregando crianças...</div>
        ) : (
          <ChildrenList children={children} />
        )}

        <div className="flex items-center justify-between text-sm text-[#5a6b82]">

          <div className="flex items-center gap-2">
            <Button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || childrenLoading}
              variant="outline"
              size="sm"
              className="bg-white disabled:opacity-50"
            >
              Anterior
            </Button>
            <span className="px-2">Página {page}</span>
            <Button
              type="button"
              onClick={() => setPage((current) => current + 1)}
              disabled={childrenLoading || children.length < limit}
              variant="outline"
              size="sm"
              className="bg-white disabled:opacity-50"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
