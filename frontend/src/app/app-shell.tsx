"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  clearAuthTokenCookie,
  getBrowserAuthToken,
  verifyAuthToken,
} from "@/lib/auth";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const showHeader = pathname !== "/";

  useEffect(() => {
    const isLoginPage = pathname === "/";
    let cancelled = false;
    let intervalId: number | undefined;

    const syncAuthState = async () => {
      const token = getBrowserAuthToken();

      if (!token) {
        if (!isLoginPage) {
          router.replace("/");
        }

        return;
      }

      const isValid = await verifyAuthToken(token);

      if (cancelled) {
        return;
      }

      if (!isValid) {
        document.cookie = clearAuthTokenCookie();
        router.replace("/");
        return;
      }

      if (isLoginPage) {
        router.replace("/dashboard");
      }
    };

    void syncAuthState();

    const handleFocus = () => {
      void syncAuthState();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncAuthState();
      }
    };

    intervalId = window.setInterval(() => {
      void syncAuthState();
    }, 60000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pathname, router]);

  if (!showHeader) {
    return <>{children}</>;
  }

  return (
    <>
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
      <main className="container mx-auto px-4 py-6 max-w-7xl">{children}</main>
    </>
  );
}
