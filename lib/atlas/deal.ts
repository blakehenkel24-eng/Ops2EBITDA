import type { Deal, DealDocument, FundMandate, DealContextData, DocStatus } from "@/lib/atlas/deal-types";
import { buildDealContextString } from "@/lib/atlas/deal-context";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class DealServiceError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
    this.name = "DealServiceError";
  }
}

export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function idFilter(id: string): string {
  if (!isUuid(id)) throw new DealServiceError("Invalid deal identifier", 400);
  return encodeURIComponent(id);
}

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
  if (!e) throw new DealServiceError("Deal data service is not configured", 503);
  const res = await fetch(`${e.url}/rest/v1/${path}`, {
    ...init,
    headers: headers(e.key, (init?.headers as Record<string, string>) ?? {}),
  });
  if (!res.ok) {
    throw new DealServiceError(`Deal data service request failed (${res.status})`);
  }
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
  const rows = await rest<Deal[]>(`deals?id=eq.${idFilter(id)}`, {
    method: "PATCH",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
  });
  return rows?.[0] ?? null;
}

export async function deleteDeal(id: string): Promise<boolean> {
  const safeId = idFilter(id);
  const documents = await listDealDocuments(id);
  const rows = await rest<Pick<Deal, "id">[]>(`deals?id=eq.${safeId}&select=id`, {
    method: "DELETE",
    headers: { Prefer: "return=representation" },
  });
  if (!rows?.length) return false;

  const paths = documents.map((document) => document.storage_path).filter(Boolean);
  if (paths.length && !(await deleteStorageObjects(paths))) {
    throw new DealServiceError("Deal deleted, but document storage cleanup failed");
  }
  return true;
}

export async function listDealDocuments(dealId: string): Promise<DealDocument[]> {
  const safeId = idFilter(dealId);
  return (await rest<DealDocument[]>(
    `deal_documents?deal_id=eq.${safeId}&select=*&order=created_at.asc`
  )) ?? [];
}

export async function getMandate(): Promise<FundMandate | null> {
  const rows = await rest<FundMandate[]>("fund_mandate?select=*&limit=1");
  return rows?.[0] ?? null;
}

export async function getDealContextData(dealId: string): Promise<DealContextData | null> {
  if (!env()) return null;
  const safeId = idFilter(dealId);
  const deals = await rest<Deal[]>(`deals?id=eq.${safeId}&select=*&limit=1`);
  const deal = deals?.[0];
  if (!deal) return null;
  const documents = await rest<DealDocument[]>(
    `deal_documents?deal_id=eq.${safeId}&select=doc_type,filename,digest,status`
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
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${e.url}/storage/v1/object/deal-documents/${encodedPath}`, {
    method: "POST",
    headers: { apikey: e.key, Authorization: `Bearer ${e.key}`, "Content-Type": contentType },
    body: bytes as BodyInit,
  });
  return res.ok;
}

export async function deleteStorageObjects(paths: string[]): Promise<boolean> {
  if (!paths.length) return true;
  const e = env();
  if (!e) return false;
  const res = await fetch(`${e.url}/storage/v1/object/deal-documents`, {
    method: "DELETE",
    headers: headers(e.key),
    body: JSON.stringify({ prefixes: paths }),
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
  await rest(`deal_documents?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ digest, status }),
  });
}
