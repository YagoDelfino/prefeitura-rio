"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import {
	AlertCircle,
	ArrowLeft,
	Check,
	CheckCircle2,
	CircleDashed,
	GraduationCap,
	Heart,
	Users,
} from "lucide-react";

import type { ChildDataRaw } from "@/app/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBrowserAuthToken } from "@/lib/auth";
import { translateAlert } from "@/lib/alerts";

type DetailSection = {
	status: string;
	details: string;
	lastUpdate?: string;
};

function buildMissingSection(areaLabel: string): DetailSection {
	return {
		status: "Sem informações cadastradas",
		details: `Esta criança ainda não possui registros de ${areaLabel.toLowerCase()}.`,
	};
}

function formatDate(value?: string): string {
	if (!value) return "Não informado";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getAge(dataNascimento?: string): number | null {
	if (!dataNascimento) return null;
	const birthDate = new Date(dataNascimento);
	if (Number.isNaN(birthDate.getTime())) return null;

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
		age -= 1;
	}

	return age >= 0 ? age : null;
}

function getAllAlerts(child: ChildDataRaw): string[] {
	return [
		...(child.saude?.alertas ?? []),
		...(child.educacao?.alertas ?? []),
		...(child.assistencia_social?.alertas ?? []),
	].map(translateAlert);
}

function buildHealthSection(child: ChildDataRaw): DetailSection | null {
	const area = child.saude;
	if (!area) return buildMissingSection("Saúde");

	const alerts = (area.alertas ?? []).map(translateAlert);
	const hasAlert = alerts.length > 0;

	const details = [
		`Vacinas em dia: ${area.vacinas_em_dia ? "Sim" : "Não"}`,
		`Ultima consulta: ${formatDate(area.ultima_consulta)}`,
		...(alerts.length ? [`Alertas: ${alerts.join("; ")}`] : []),
	].join(". ");

	return {
		status: hasAlert ? "Alerta" : "Sem alertas",
		details,
		lastUpdate: child.revisado_em ? formatDate(child.revisado_em) : undefined,
	};
}

function buildEducationSection(child: ChildDataRaw): DetailSection | null {
	const area = child.educacao;
	if (!area) return buildMissingSection("Educação");

	const alerts = (area.alertas ?? []).map(translateAlert);
	const hasAlert = alerts.length > 0;

	const details = [
		`Escola: ${area.escola ?? "Não informada"}`,
		`Frequencia: ${area.frequencia_percent ?? "Não informada"}%`,
		...(alerts.length ? [`Alertas: ${alerts.join("; ")}`] : []),
	].join(". ");

	return {
		status: hasAlert ? "Alerta" : "Sem alertas",
		details,
		lastUpdate: child.revisado_em ? formatDate(child.revisado_em) : undefined,
	};
}

function buildSocialSection(child: ChildDataRaw): DetailSection | null {
	const area = child.assistencia_social;
	if (!area) return buildMissingSection("Assistência social");

	const alerts = (area.alertas ?? []).map(translateAlert);
	const hasAlert = alerts.length > 0;

	const details = [
		`Cadastro Unico: ${area.cad_unico ? "Sim" : "Não"}`,
		`Beneficio ativo: ${area.beneficio_ativo ? "Sim" : "Não"}`,
		...(alerts.length ? [`Alertas: ${alerts.join("; ")}`] : []),
	].join(". ");

	return {
		status: hasAlert ? "Alerta" : "Sem alertas",
		details,
		lastUpdate: child.revisado_em ? formatDate(child.revisado_em) : undefined,
	};
}

function DetailSectionCard({
	title,
	icon,
	data,
	colorClass,
}: {
	title: string;
	icon: React.ReactNode;
	data: DetailSection | null;
	colorClass: string;
}) {
	if (!data) {
		return (
			<Card className="border-dashed border-[#13335a]/20 bg-white">
				<CardHeader className="pb-3">
					<CardTitle className="flex items-center gap-2 text-base text-[#13335a]">
						{icon}
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="text-sm italic text-[#5a6b82]">Sem dados registrados nesta area</div>
				</CardContent>
			</Card>
		);
	}

	const isAlert = data.status === "Alerta";
	const isMissing = data.status === "Sem informações cadastradas";

	return (
		<Card
			className={`bg-white ${
				isAlert ? `border-l-4 ${colorClass}` : isMissing ? "border-dashed border-[#13335a]/20" : "border-[#13335a]/10"
			}`}
		>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base text-[#13335a]">
					{icon}
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-start gap-2">
					{isMissing ? (
						<CircleDashed className="mt-0.5 h-5 w-5 shrink-0 text-[#5a6b82]" />
					) : isAlert ? (
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
					) : (
						<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
					)}
					<div className="flex-1">
						<div
							className={`font-medium ${
								isMissing ? "text-[#5a6b82]" : isAlert ? "text-orange-700" : "text-green-700"
							}`}
						>
							{data.status}
						</div>
						<div className="mt-1 text-sm text-muted-foreground">{data.details}</div>
					</div>
				</div>
				{data.lastUpdate ? (
					<div className="border-t border-[#13335a]/10 pt-2 text-xs text-[#5a6b82]">
						Ultima atualizacao: {data.lastUpdate}
					</div>
				) : isMissing ? (
					<div className="border-t border-[#13335a]/10 pt-2 text-xs text-[#5a6b82]">
						Sem histórico para exibir nesta área.
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}

async function getChildById(id: string): Promise<ChildDataRaw | null> {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		const response = await fetch(`${apiUrl}/api/children/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) return null;
		return await response.json();
	} catch {
		return null;
	}
}

async function reviewChild(id: string): Promise<boolean> {
	try {
		const token = getBrowserAuthToken();

		if (!token) {
			return false;
		}

		const apiUrl = process.env.NEXT_PUBLIC_API_URL;
		const response = await fetch(`${apiUrl}/api/children/${id}/review`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ revisado: true }),
		});

		return response.ok;
	} catch {
		return false;
	}
}

export default function ChildDetailPage() {
	const router = useRouter();
	const params = useParams<{ id: string }>();
	const childId = params?.id;

	const [child, setChild] = React.useState<ChildDataRaw | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [isReviewing, setIsReviewing] = React.useState(false);
	const [actionMessage, setActionMessage] = React.useState("");

	React.useEffect(() => {
		async function load() {
			if (!childId) {
				setLoading(false);
				return;
			}

			setLoading(true);
			const data = await getChildById(childId);
			setChild(data);
			setLoading(false);
		}

		load();
	}, [childId]);

	async function handleMarkReviewed() {
		if (!child?.id) return;

		setIsReviewing(true);
		setActionMessage("");
		const success = await reviewChild(child.id);

		if (success) {
			setChild((current) => (current ? { ...current, revisado: true } : current));
			setActionMessage("Caso marcado como revisado com sucesso.");
		} else {
			setActionMessage("Não foi possivel marcar como revisado. Verifique sua sessão.");
		}

		setIsReviewing(false);
	}

	if (loading) {
		return <div className="py-8 text-center text-[#5a6b82]">Carregando detalhes...</div>;
	}

	if (!child) {
		return (
			<div className="space-y-4">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/dashboard")}
					className="hover:bg-[#13335a]/5"
				>
					<ArrowLeft className="h-4 w-4 text-[#13335a]" />
					Voltar
				</Button>
				<Card className="bg-white">
					<CardContent className="py-6 text-[#5a6b82]">Criança não encontrada.</CardContent>
				</Card>
			</div>
		);
	}

	const age = getAge(child.data_nascimento);
	const alerts = getAllAlerts(child);
	const hasAlerts = alerts.length > 0;

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-start">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => router.push("/dashboard")}
					className="self-start hover:bg-[#13335a]/5"
				>
					<ArrowLeft className="h-4 w-4 text-[#13335a]" />
					Voltar
				</Button>

				<div className="flex-1">
					<h2 className="typo-subtitle text-2xl text-[#13335a]">{child.nome ?? "Sem nome"}</h2>
					<p className="text-sm text-[#5a6b82]">
						{age !== null ? `${age} anos` : "Idade não informada"} | {child.bairro ?? "Bairro não informado"}
					</p>
				</div>

				{child.revisado ? (
					<Badge className="flex items-center gap-1 bg-green-600 hover:bg-green-700">
						<Check className="h-3 w-3" />
						Revisado
					</Badge>
				) : (
					<Button
						onClick={handleMarkReviewed}
						disabled={isReviewing}
						className="bg-[#13335a] text-white hover:bg-[#2a688f]"
					>
						{isReviewing ? "Marcando..." : "Marcar como Revisado"}
					</Button>
				)}
			</div>

			{actionMessage ? <p className="text-sm text-[#5a6b82]">{actionMessage}</p> : null}

			{hasAlerts ? (
				<div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
					<div className="flex items-start gap-2">
						<AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
						<div>
							<div className="font-medium text-orange-900">Esta crianca possui alertas ativos</div>
							<div className="mt-1 text-sm text-orange-700">{alerts.join(" | ")}</div>
						</div>
					</div>
				</div>
			) : null}

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<DetailSectionCard
					title="Saude"
					icon={<Heart className="h-4 w-4" />}
					data={buildHealthSection(child)}
					colorClass="border-l-red-500"
				/>
				<DetailSectionCard
					title="Educacao"
					icon={<GraduationCap className="h-4 w-4" />}
					data={buildEducationSection(child)}
					colorClass="border-l-blue-500"
				/>
				<DetailSectionCard
					title="Assistencia Social"
					icon={<Users className="h-4 w-4" />}
					data={buildSocialSection(child)}
					colorClass="border-l-purple-500"
				/>
			</div>

			<Card className="border-[#13335a]/10 bg-white">
				<CardHeader>
					<CardTitle className="text-base text-[#13335a]">Informacoes adicionais</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2 text-sm text-[#5a6b82]">
					<p>Responsavel: {child.responsavel ?? "Não informado"}</p>
					<p>Revisado por: {child.revisado_por ?? "Não informado"}</p>
					<p>Revisado em: {formatDate(child.revisado_em)}</p>
				</CardContent>
			</Card>
		</div>
	);
}
