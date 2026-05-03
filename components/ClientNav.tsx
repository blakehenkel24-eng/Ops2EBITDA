'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Layers, Menu, X } from 'lucide-react';

export function ClientNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Library', icon: BookOpen },
    { href: '/study', label: 'Study Plans', icon: Layers },
  ];

  return (
    <>
      <nav className="hidden md:flex gap-6 font-geist text-sm font-medium">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 transition-colors ${
                isActive ? 'text-ochre' : 'hover:text-ochre'
              }`}
            >
              <Icon size={16} strokeWidth={1.5} />
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
        <div className="absolute top-16 left-0 right-0 bg-bone border-b border-stone/30 shadow-sm md:hidden p-4 flex flex-col gap-2 z-40">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 font-geist text-base font-medium p-3 rounded-md transition-colors ${
                  isActive ? 'bg-stone/10 text-ochre' : 'text-ink hover:bg-stone/5 hover:text-ochre'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
