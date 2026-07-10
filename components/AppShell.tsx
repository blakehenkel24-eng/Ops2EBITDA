import Link from 'next/link';
import { Ops2EBITDALogo } from './Ops2EBITDALogo';
import { ClientNav } from './ClientNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <header className="sticky top-0 z-50 border-b border-line/40 bg-bone/75 backdrop-blur-xl shadow-[0_1px_3px_oklch(31%_0.038_248_/_0.04),0_4px_12px_oklch(31%_0.038_248_/_0.03)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-8">
          <Link href="/" className="text-xl shrink-0 hover:opacity-80 transition-opacity">
            <Ops2EBITDALogo />
          </Link>
          <ClientNav />
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="site-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-16">
            <div>
              <Link href="/" className="text-lg inline-block">
                <Ops2EBITDALogo />
              </Link>
              <p className="mt-4 text-sm leading-6 text-stone font-geist max-w-[28ch]">
                Private equity operations knowledge base and AI-powered research tools for value creation.
              </p>
            </div>

            <div>
              <p className="font-mono-label text-stone/50 mb-4">Knowledge</p>
              <ul className="space-y-2.5 text-sm font-geist">
                <FooterLink href="/fundamentals">Fundamentals</FooterLink>
                <FooterLink href="/playbooks">Playbooks</FooterLink>
                <FooterLink href="/industries">Industries</FooterLink>
                <FooterLink href="/kpis">KPIs</FooterLink>
              </ul>
            </div>

            <div>
              <p className="font-mono-label text-stone/50 mb-4">Product</p>
              <ul className="space-y-2.5 text-sm font-geist">
                <FooterLink href="/atlas-iq/chat">Atlas IQ</FooterLink>
                <FooterLink href="/offerings#toolkit">Operating Assets</FooterLink>
                <FooterLink href="/ai-for-pe-professionals">AI for PE</FooterLink>
              </ul>
            </div>

            <div>
              <p className="font-mono-label text-stone/50 mb-4">Company</p>
              <ul className="space-y-2.5 text-sm font-geist">
                <FooterLink href="/offerings#toolkit">Pricing</FooterLink>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-line/30 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono-label text-stone/40 text-xs">
              © {new Date().getFullYear()} Ops2EBITDA
            </p>
            <p className="font-mono-label text-stone/40 text-xs">
              Private Equity Operations Knowledge Base
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="text-stone/70 hover:text-ink transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}
