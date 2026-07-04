import { NextResponse } from "next/server";
import { updateDeal, deleteDeal } from "@/lib/atlas/deal";
import type { Deal } from "@/lib/atlas/deal-types";

const FIELDS: (keyof Deal)[] = ["name", "target", "sector", "stage", "deal_type", "thesis", "levers"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const patch: Partial<Deal> = {};
  for (const f of FIELDS) if (f in body) (patch as Record<string, unknown>)[f] = body[f];
  const deal = await updateDeal(id, patch);
  if (!deal) return NextResponse.json({ error: "Could not update deal" }, { status: 500 });
  return NextResponse.json({ deal });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteDeal(id);
  return NextResponse.json({ ok: true });
}
