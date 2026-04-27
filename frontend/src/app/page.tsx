"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${apiUrl}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setErrorMessage("E-mail ou senha invalidos.");
        return;
      }

      const data = (await response.json()) as { token?: string };

      if (!data.token) {
        setErrorMessage("Falha ao autenticar. Tente novamente.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setErrorMessage("Nao foi possivel conectar ao servidor.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
    <main className="bg-[var(--color-brand-primary)] min-h-screen flex items-center justify-center">
      <div className="bg-[var(--color-brand-neutral)] p-10 rounded-lg shadow-lg">
        <img src="Logo Prefeitura horizontal azul.png" alt="Logo" className="mx-auto mb-6 w-36" />
        <h1 className="text-2xl font-bold mb-2">Painel de Vulnerabilidade Infantil</h1>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
              <label className="typo-body">E-mail</label>
              <input
                type="text"
                placeholder="tecnico@prefeitura.rio"
                className="w-full p-2 border border-gray-300 rounded"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
          </div>
          <div className="space-y-2">
              <label className="typo-body">Senha</label>
              <input
                type="password"
                placeholder="********"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
          </div>
          {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--color-brand-primary)] text-white font-bold py-2 rounded hover:bg-[var(--color-brand-gradient-end)] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-300"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
    </>
  );
}
