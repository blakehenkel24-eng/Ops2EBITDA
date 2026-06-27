-- Deal Workspace schema. Tenancy columns (org_id/owner_id) are present but
-- nullable and unenforced in Phase 1; Phase 2 (auth) adds RLS on them.

create table if not exists deals (
  id          uuid primary key default gen_random_uuid(),
  org_id      uuid,
  owner_id    uuid,
  name        text not null,
  target      text,
  sector      text,
  stage       text,
  deal_type   text,
  thesis      text,
  levers      text[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists deal_documents (
  id            uuid primary key default gen_random_uuid(),
  deal_id       uuid not null references deals(id) on delete cascade,
  filename      text not null,
  doc_type      text,
  storage_path  text not null,
  digest        text,
  status        text not null default 'pending',
  byte_size     int,
  created_at    timestamptz not null default now()
);

create table if not exists fund_mandate (
  id            uuid primary key default gen_random_uuid(),
  org_id        uuid,
  sectors       text,
  ev_band       text,
  ebitda_band   text,
  deal_types    text[] not null default '{}',
  geography     text,
  return_target text,
  updated_at    timestamptz not null default now()
);

create index if not exists deal_documents_deal_id_idx on deal_documents(deal_id);

-- NOTE: The private storage bucket `deal-documents` is created out-of-band via
-- the Storage API (POST {SUPABASE_URL}/storage/v1/bucket), not here — the
-- storage schema is not guaranteed to exist when this SQL migration runs, and a
-- raw `insert into storage.buckets` aborts the transaction on fresh projects.
--
-- NOTE (Phase 1): RLS is intentionally NOT enabled on these tables. Access is
-- server-side only via the service key. Phase 2 (auth) must enable RLS and add
-- policies on org_id/owner_id before enterprise go-live — confidential CIM/QoE
-- data must not be reachable with the anon key.
