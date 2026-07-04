export type DealStage =
  | "sourced" | "screening" | "ioi" | "loi" | "diligence" | "ic" | "closed" | "passed";

export type DealType =
  | "platform" | "bolt_on" | "tuck_in" | "carve_out" | "other";

export type ValueLever =
  | "organic_growth" | "margin_expansion" | "buy_and_build" | "multiple_expansion" | "deleveraging";

export type DocStatus = "pending" | "reading" | "ready" | "failed";

export interface Deal {
  id: string;
  name: string;
  target: string | null;
  sector: string | null;
  stage: DealStage | null;
  deal_type: DealType | null;
  thesis: string | null;
  levers: ValueLever[];
  created_at: string;
  updated_at: string;
}

export interface DealDocument {
  id: string;
  deal_id: string;
  filename: string;
  doc_type: string | null;
  storage_path: string;
  digest: string | null;
  status: DocStatus;
  byte_size: number | null;
  created_at: string;
}

export interface FundMandate {
  id: string;
  sectors: string | null;
  ev_band: string | null;
  ebitda_band: string | null;
  deal_types: string[];
  geography: string | null;
  return_target: string | null;
  updated_at: string;
}

/** Shape consumed by the context builder. */
export interface DealContextData {
  deal: Deal;
  documents: Pick<DealDocument, "doc_type" | "filename" | "digest" | "status">[];
  mandate: FundMandate | null;
}
