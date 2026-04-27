import type { Metadata } from "next";
import localFont from "next/font/local";
import AppShell from "./app-shell";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const ceraCompact = localFont({
  src: [
    {
      path: "./fonts/Cera Compact Pro Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Cera Compact Pro Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Cera Compact Pro Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-cera-compact",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Painel de Vulnerabilidade Infantil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={cn("h-full", "antialiased", ceraCompact.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
