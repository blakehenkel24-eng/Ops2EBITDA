import { NextResponse } from "next/server";
import { listDeals, createDeal, getMandate, listDealDocuments } from "@/lib/atlas/deal";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dealId = searchParams.get("documentsFor");
  if (dealId) {
    return NextResponse.json({ documents: await listDealDocuments(dealId) });
  }
  const [deals, mandate] = await Promise.all([listDeals(), getMandate()]);
  return NextResponse.json({ deals, mandate });
}

export async function POST(req: Request) {
  const body = await req.json();
  const name = typeof body?.name === "string" && body.name.trim() ? body.name.trim() : "New deal";
  const deal = await createDeal({ name });
  if (!deal) return NextResponse.json({ error: "Could not create deal" }, { status: 500 });
  return NextResponse.json({ deal });
}
