"use client";

import { usePathname } from "next/navigation";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const showHeader = pathname !== "/";

  return (
    <>
      {showHeader ? (
        <header className="bg-[var(--color-brand-primary)] p-4">
          <div className="flex items-center gap-8">
            <img
              src="Logo Prefeitura horizontal branco.png"
              alt="Logo Prefeitura do Rio"
              className="h-10 w-auto"
            />
            <h1 className="text-2xl font-bold text-white">Painel de Vulnerabilidade Infantil</h1>
          </div>
        </header>
      ) : null}
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
    </>
  );
}
