"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, Maximize2 } from "lucide-react";
import { AtlasChat } from "./AtlasChat";

export function AtlasSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Don't show sidebar on Atlas IQ pages (they have full UI)
  if (pathname.startsWith("/atlas-iq")) return null;

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 w-12 h-12 bg-accent text-[oklch(98%_0.004_240)] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
          aria-label="Open Atlas IQ"
        >
          <span className="font-newsreader text-sm font-semibold">IQ</span>
        </button>
      )}

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/20"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-bone border-l border-line/70 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-line/70">
          <span className="font-mono-label text-accent">Atlas IQ</span>
          <div className="flex items-center gap-2">
            <Link
              href="/atlas-iq/chat"
              className="text-stone hover:text-ink transition-colors p-1"
              title="Expand to full page"
            >
              <Maximize2 size={14} strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-stone hover:text-ink transition-colors p-1"
              aria-label="Close Atlas IQ"
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Chat (only render when open to save resources) */}
        {open && (
          <div className="h-[calc(100%-3rem)]">
            <AtlasChat />
          </div>
        )}
      </div>
    </>
  );
}
