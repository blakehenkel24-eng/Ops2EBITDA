import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni" });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost" });

export const metadata: Metadata = {
  title: "PE Ops Knowledge Base",
  description:
    "A static private equity operations knowledge base for value creation, industries, KPIs, and operator playbooks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
