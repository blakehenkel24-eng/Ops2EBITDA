"use client";

import { ATLAS_COMMANDS } from "@/lib/atlas/prompts";

export function AtlasCommandBar({
  onCommand,
  compact = false,
}: {
  onCommand: (command: string) => void;
  compact?: boolean;
}) {
  const commands = compact ? ATLAS_COMMANDS.slice(0, 5) : ATLAS_COMMANDS;

  return (
    <div className="flex flex-wrap gap-1.5">
      {commands.map((cmd) => (
        <button
          key={cmd.name}
          type="button"
          onClick={() => onCommand(`/${cmd.name}`)}
          title={cmd.prompt}
          className="font-mono-label text-[10px] text-stone/70 bg-transparent border border-line/50 px-2 py-1 rounded-full hover:text-accent hover:border-accent/30 hover:bg-accent/4 transition-all duration-150"
        >
          {cmd.label}
        </button>
      ))}
    </div>
  );
}
