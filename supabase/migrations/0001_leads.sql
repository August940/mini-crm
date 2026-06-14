-- 0001_leads.sql
-- Opretter den eneste tabel i appen: `leads`.

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  company     text not null default '',
  email       text not null default '',
  deal_value  integer not null default 0,
  -- stage skal være ét af de gyldige stadier. Listen spejler src/lib/types.ts.
  stage       text not null default 'lead'
              check (stage in ('lead','kontaktet','tilbud_sendt','kontrakt','aktiv','tabt')),
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Hurtigere sortering/filtrering på de felter vi bruger mest.
create index if not exists leads_stage_idx on public.leads (stage);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- Hold updated_at opdateret automatisk ved hver ændring.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- Slå Row Level Security til. Appen tilgår kun tabellen fra serveren (aldrig
-- fra browseren). Da der endnu ikke er login, tillader policy'en de nødvendige
-- handlinger. NÆSTE SKRIDT (se README): tilføj auth og stram disse policies,
-- så hver bruger kun kan se og redigere sine egne leads.
alter table public.leads enable row level security;

drop policy if exists "demo_full_access" on public.leads;
create policy "demo_full_access"
  on public.leads
  for all
  to anon, authenticated
  using (true)
  with check (true);
