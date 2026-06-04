import type { Metadata } from "next";
import { Newsreader, Geist, JetBrains_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { AtlasSidebar } from "@/components/AtlasSidebar";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

const newsreader = Newsreader({ subsets: ["latin"], variable: "--font-family-newsreader" });
const geist = Geist({ subsets: ["latin"], variable: "--font-family-geist" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-family-jetbrains" });

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: siteName,
  title: {
    default: "Ops2EBITDA | Private Equity Operations Knowledge Base",
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${geist.variable} ${jetbrains.variable}`}>
      <body>
        <AppShell>{children}</AppShell>
        <AtlasSidebar />
      </body>
    </html>
  );
}
