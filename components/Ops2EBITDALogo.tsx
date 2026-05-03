import React from 'react';

export function Ops2EBITDALogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-newsreader font-medium text-[1em] tracking-[-0.025em] leading-none text-ink whitespace-nowrap ${className}`}>
      Ops<span className="italic font-semibold text-ochre px-[0.02em]">2</span>EBITDA
    </span>
  );
}
