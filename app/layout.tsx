import type { Metadata } from "next";
import { AppShell } from "@/components/AppShell";
import { AtlasSidebar } from "@/components/AtlasSidebar";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

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
  icons: {
    icon: "/brand/ops2ebitda-logo-linkedin.png",
  },
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
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
        <AtlasSidebar />
      </body>
    </html>
  );
}
