'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Layers, Menu, X, Database, Briefcase, Factory, Activity } from 'lucide-react';

export function ClientNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Library', icon: BookOpen },
    { href: '/fundamentals', label: 'Fundamentals', icon: Database },
    { href: '/playbooks', label: 'Playbooks', icon: Briefcase },
    { href: '/industries', label: 'Industries', icon: Factory },
    { href: '/kpis', label: 'KPIs', icon: Activity },
    { href: '/study', label: 'Study Plans', icon: Layers },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-mono-label px-3 py-2 transition-all duration-200 border-b-2 whitespace-nowrap ${
                active 
                  ? 'border-ochre text-ochre bg-paper' 
                  : 'border-transparent text-stone hover:text-ink hover:bg-paper'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone hover:text-ink transition-colors"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-paper border-b border-stone/30 shadow-lg md:hidden p-4 flex flex-col gap-1 z-40">
          {links.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 font-mono-label p-3 transition-colors ${
                  active ? 'bg-bone text-ochre' : 'text-stone hover:bg-bone hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
