import Link from 'next/link';
import { Ops2EBITDALogo } from './Ops2EBITDALogo';
import { ClientNav } from './ClientNav';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bone text-ink flex flex-col">
      <header className="sticky top-0 z-50 bg-bone border-b border-stone/30">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl hover:opacity-80 transition-opacity">
            <Ops2EBITDALogo />
          </Link>
          <ClientNav />
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12">
        {children}
      </main>
      <footer className="border-t border-stone/30 bg-bone py-8 text-center text-sm text-stone mt-12">
        <div className="max-w-6xl mx-auto px-4 font-mono-label">
          Ops2EBITDA · Operating Knowledge for PE
        </div>
      </footer>
    </div>
  );
}
