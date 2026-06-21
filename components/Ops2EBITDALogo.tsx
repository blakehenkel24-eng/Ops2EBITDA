import React from 'react';

export function Ops2EBITDALogo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-newsreader font-medium text-[1em] leading-none text-ink whitespace-nowrap ${className}`}>
      Ops
      <span
        className="px-[0.025em]"
        style={{
          color: "oklch(60% 0.21 248)",
          fontStyle: "italic",
          fontWeight: 750,
          textShadow: "0 0 0.015em oklch(60% 0.21 248)",
        }}
      >
        2
      </span>
      EBITDA
    </span>
  );
}
