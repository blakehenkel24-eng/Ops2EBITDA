import type { Deal, DealDocument, FundMandate, DealContextData, DocStatus } from "@/lib/atlas/deal-types";
import { buildDealContextString } from "@/lib/atlas/deal-context";

function env() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return { url, key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function rest<T>(path: string, init?: RequestInit): Promise<T | null> {
  const e = env();
  if (!e) return null;
  const res = await fetch(`${e.url}/rest/v1/${path}`, {
    ...init,
    headers: headers(e.key, (init?.headers as Record<string, string>) ?? {}),
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

export async function listDeals(): Promise<Deal[]> {
  return (await rest<Deal[]>("deals?select=*&order=updated_at.desc")) ?? [];
}

export async function createDeal(input: { name: string }): Promise<Deal | null> {
  const rows = await rest<Deal[]>("deals", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ name: input.name }),
  });
  return rows?.[0] ?? null;
}

export async function updateDeal(id: string, patch: Partial<Deal>): Promise<Deal | null> {
  const rows = await rest<Deal[]>(`deals?id=eq.${id}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

export async function deleteDeal(id: string): Promise<void> {
  await rest(`deals?id=eq.${id}`, { method: "DELETE" });
}

export async function listDealDocuments(dealId: string): Promise<DealDocument[]> {
  return (await rest<DealDocument[]>(
    `deal_documents?deal_id=eq.${dealId}&select=*&order=created_at.asc`
  )) ?? [];
}

export async function getMandate(): Promise<FundMandate | null> {
  const rows = await rest<FundMandate[]>("fund_mandate?select=*&limit=1");
  return rows?.[0] ?? null;
}

export async function getDealContextData(dealId: string): Promise<DealContextData | null> {
  if (!env()) return null;
  const deals = await rest<Deal[]>(`deals?id=eq.${dealId}&select=*&limit=1`);
  const deal = deals?.[0];
  if (!deal) return null;
  const documents = await rest<DealDocument[]>(
    `deal_documents?deal_id=eq.${dealId}&select=doc_type,filename,digest,status`
  );
  const mandateRows = await rest<FundMandate[]>("fund_mandate?select=*&limit=1");
  return { deal, documents: documents ?? [], mandate: mandateRows?.[0] ?? null };
}

export async function buildDealContext(dealId: string | null | undefined): Promise<string> {
  if (!dealId) return "";
  const data = await getDealContextData(dealId);
  return buildDealContextString(data);
}

export async function uploadToStorage(path: string, bytes: Uint8Array, contentType: string): Promise<boolean> {
  const e = env();
  if (!e) return false;
  const res = await fetch(`${e.url}/storage/v1/object/deal-documents/${path}`, {
    method: "POST",
    headers: { apikey: e.key, Authorization: `Bearer ${e.key}`, "Content-Type": contentType },
    body: bytes as BodyInit,
  });
  return res.ok;
}

export async function insertDocument(input: {
  deal_id: string; filename: string; doc_type: string | null; storage_path: string; byte_size: number;
}): Promise<DealDocument | null> {
  const rows = await rest<DealDocument[]>("deal_documents", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...input, status: "reading" }),
  });
  return rows?.[0] ?? null;
}

export async function setDocumentDigest(id: string, digest: string | null, status: DocStatus): Promise<void> {
  await rest(`deal_documents?id=eq.${id}`, {
    method: "PATCH",
    body: JSON.stringify({ digest, status }),
  });
}
