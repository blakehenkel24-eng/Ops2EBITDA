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
          className="text-[12px] font-geist text-stone/55 bg-transparent border border-line/35 px-2.5 py-1 rounded-lg hover:text-accent hover:border-accent/25 hover:bg-accent/4 transition-all duration-150"
        >
          {cmd.label}
        </button>
      ))}
    </div>
  );
}
