import { NextResponse } from "next/server";
import { DealServiceError, updateDeal, deleteDeal, isUuid } from "@/lib/atlas/deal";
import type { Deal } from "@/lib/atlas/deal-types";

const FIELDS: (keyof Deal)[] = ["name", "target", "sector", "stage", "deal_type", "thesis", "levers"];
const STAGES = new Set(["sourced", "screening", "ioi", "loi", "diligence", "ic", "closed", "passed"]);
const DEAL_TYPES = new Set(["platform", "bolt_on", "tuck_in", "carve_out", "other"]);
const LEVERS = new Set(["organic_growth", "margin_expansion", "buy_and_build", "multiple_expansion", "deleveraging"]);
const TEXT_LIMITS: Partial<Record<keyof Deal, number>> = { name: 200, target: 200, sector: 120, thesis: 10_000 };

function serviceError(error: unknown) {
  const status = error instanceof DealServiceError ? error.status : 500;
  const message = error instanceof DealServiceError ? error.message : "Deal request failed";
  return NextResponse.json({ error: message }, { status });
}

function validatePatch(patch: Partial<Deal>): string | null {
  for (const [field, limit] of Object.entries(TEXT_LIMITS)) {
    const value = patch[field as keyof Deal];
    if (value !== undefined && value !== null && (typeof value !== "string" || value.length > limit)) {
      return `Invalid ${field}`;
    }
  }
  if (patch.name !== undefined && (!patch.name || !patch.name.trim())) return "Invalid name";
  if (patch.stage !== undefined && patch.stage !== null && !STAGES.has(patch.stage)) return "Invalid stage";
  if (patch.deal_type !== undefined && patch.deal_type !== null && !DEAL_TYPES.has(patch.deal_type)) return "Invalid deal_type";
  if (patch.levers !== undefined && (!Array.isArray(patch.levers) || patch.levers.some((lever) => !LEVERS.has(lever)))) {
    return "Invalid levers";
  }
  return null;
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid deal identifier" }, { status: 400 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const input = body as Record<string, unknown>;
  const patch: Partial<Deal> = {};
  for (const f of FIELDS) if (f in input) (patch as Record<string, unknown>)[f] = input[f];
  if (!Object.keys(patch).length) return NextResponse.json({ error: "No supported fields provided" }, { status: 400 });
  const validationError = validatePatch(patch);
  if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });
  try {
    const deal = await updateDeal(id, patch);
    if (!deal) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    return NextResponse.json({ deal });
  } catch (error) {
    return serviceError(error);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isUuid(id)) return NextResponse.json({ error: "Invalid deal identifier" }, { status: 400 });
  try {
    const deleted = await deleteDeal(id);
    if (!deleted) return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return serviceError(error);
  }
}
