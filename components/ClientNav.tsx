'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  ChevronDown,
  Database,
  Factory,
  Menu,
  Package,
  X,
} from 'lucide-react';
import { aiNavLinks } from '@/lib/aiForPE';

export function ClientNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [knowledgeMenuOpen, setKnowledgeMenuOpen] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  const knowledgeLinks = [
    { href: '/', label: 'Library Home', icon: BookOpen },
    { href: '/fundamentals', label: 'Fundamentals', icon: Database },
    { href: '/playbooks', label: 'Playbooks', icon: BriefcaseBusiness },
    { href: '/industries', label: 'Industries', icon: Factory },
    { href: '/kpis', label: 'KPIs', icon: Activity },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isAiLinkActive = (href: string) => {
    if (href === '/ai-for-pe-professionals') {
      return pathname === href;
    }
    return isActive(href);
  };

  const knowledgeActive = knowledgeLinks.some((link) => isActive(link.href));
  const aiActive = isActive('/ai-for-pe-professionals');

  return (
    <>
      <nav className="hidden md:flex items-center gap-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => setKnowledgeMenuOpen((open) => !open)}
            className={`font-mono-label flex items-center gap-2 px-3 py-2 transition-all duration-200 border border-transparent whitespace-nowrap ${
              knowledgeActive || pathname === '/'
                ? 'border-accent/20 text-accent bg-accent-soft'
                : 'text-stone hover:text-ink hover:bg-paper hover:border-line'
            }`}
            aria-expanded={knowledgeMenuOpen}
            aria-haspopup="menu"
          >
            <BookOpen size={14} strokeWidth={1.7} aria-hidden="true" />
            Knowledge Base
            <ChevronDown size={13} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <div
            className={`absolute right-0 top-full z-50 mt-2 w-56 border border-line/80 bg-paper p-2 shadow-[0_20px_50px_oklch(31%_0.038_248_/_0.14)] transition-all duration-150 ${
              knowledgeMenuOpen
                ? 'visible opacity-100'
                : 'invisible opacity-0'
            }`}
          >
            {knowledgeLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setKnowledgeMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-accent-soft text-accent'
                      : 'text-stone hover:bg-bone hover:text-ink'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <link.icon size={15} strokeWidth={1.7} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAiMenuOpen((open) => !open)}
            className={`font-mono-label flex items-center gap-2 px-3 py-2 transition-all duration-200 border border-transparent whitespace-nowrap ${
              aiActive
                ? 'border-accent/20 text-accent bg-accent-soft'
                : 'text-stone hover:text-ink hover:bg-paper hover:border-line'
            }`}
            aria-expanded={aiMenuOpen}
            aria-haspopup="menu"
          >
            <BrainCircuit size={14} strokeWidth={1.7} aria-hidden="true" />
            AI for PE Professionals
            <ChevronDown size={13} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <div
            className={`absolute right-0 top-full z-50 mt-2 w-72 border border-line/80 bg-paper p-2 shadow-[0_20px_50px_oklch(31%_0.038_248_/_0.14)] transition-all duration-150 ${
              aiMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'
            }`}
          >
            {aiNavLinks.map((link) => {
              const active = isAiLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setAiMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 text-sm transition-colors ${
                    active
                      ? 'bg-accent-soft text-accent'
                      : 'text-stone hover:bg-bone hover:text-ink'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <BrainCircuit size={15} strokeWidth={1.7} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          href="/offerings#toolkit"
          className="font-mono-label flex items-center gap-2 border border-accent/35 bg-paper/90 text-accent px-3 py-2 transition-all duration-200 whitespace-nowrap hover:border-accent/55 hover:bg-accent-soft/70 hover:text-ink"
        >
          <Package size={14} strokeWidth={1.7} aria-hidden="true" />
          Get the Toolkit
        </Link>
      </nav>
      
      <div className="md:hidden flex items-center">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone hover:text-ink transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-paper border-b border-line/80 shadow-lg md:hidden p-4 flex flex-col gap-1 z-40">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 font-mono-label p-3 transition-colors ${
              pathname === '/' ? 'bg-accent-soft text-accent' : 'text-stone hover:bg-bone hover:text-ink'
            }`}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            <BookOpen size={15} strokeWidth={1.7} aria-hidden="true" />
            Knowledge Base
          </Link>
          <div className="ml-4 border-l border-line/80 pl-3">
            {knowledgeLinks.slice(1).map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 text-sm transition-colors ${
                    active ? 'bg-accent-soft text-accent' : 'text-stone hover:bg-bone hover:text-ink'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <link.icon size={15} strokeWidth={1.7} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/ai-for-pe-professionals"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 font-mono-label p-3 transition-colors ${
              aiActive ? 'bg-accent-soft text-accent' : 'text-stone hover:bg-bone hover:text-ink'
            }`}
            aria-current={aiActive ? 'page' : undefined}
          >
            <BrainCircuit size={15} strokeWidth={1.7} aria-hidden="true" />
            AI for PE Professionals
          </Link>
          <div className="ml-4 border-l border-line/80 pl-3">
            {aiNavLinks.slice(1).map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 text-sm transition-colors ${
                    active ? 'bg-accent-soft text-accent' : 'text-stone hover:bg-bone hover:text-ink'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <BrainCircuit size={15} strokeWidth={1.7} aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {[
            { href: '/offerings#toolkit', label: 'Get the Toolkit', icon: Package, active: false },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 font-mono-label p-3 transition-colors ${
                link.label === 'Get the Toolkit'
                  ? 'mt-1 border border-accent/35 bg-paper/90 text-accent hover:border-accent/55 hover:bg-accent-soft/70 hover:text-ink'
                  : link.active
                    ? 'bg-accent-soft text-accent'
                    : 'text-stone hover:bg-bone hover:text-ink'
              }`}
              aria-current={link.active ? 'page' : undefined}
            >
              <link.icon size={15} strokeWidth={1.7} aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
