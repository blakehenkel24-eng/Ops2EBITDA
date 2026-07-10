import { NextResponse } from "next/server";
import { DealServiceError, listDeals, createDeal, getMandate, isUuid, listDealDocuments } from "@/lib/atlas/deal";

function serviceError(error: unknown) {
  const status = error instanceof DealServiceError ? error.status : 500;
  const message = error instanceof DealServiceError ? error.message : "Deal request failed";
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dealId = searchParams.get("documentsFor");
  if (dealId) {
    if (!isUuid(dealId)) return NextResponse.json({ error: "Invalid deal identifier" }, { status: 400 });
    try {
      return NextResponse.json({ documents: await listDealDocuments(dealId) });
    } catch (error) {
      return serviceError(error);
    }
  }
  try {
    const [deals, mandate] = await Promise.all([listDeals(), getMandate()]);
    return NextResponse.json({ deals, mandate });
  } catch (error) {
    return serviceError(error);
  }
}

export async function POST(req: Request) {
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
  const name = typeof input.name === "string" && input.name.trim() ? input.name.trim() : "New deal";
  if (name.length > 200) return NextResponse.json({ error: "Deal name is too long" }, { status: 400 });
  try {
    const deal = await createDeal({ name });
    if (!deal) return NextResponse.json({ error: "Could not create deal" }, { status: 502 });
    return NextResponse.json({ deal });
  } catch (error) {
    return serviceError(error);
  }
}
