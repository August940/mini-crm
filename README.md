# Pipeline · Mini-CRM

En lille **CRM / pipeline-tracker**: følg en kundes rejse fra **lead → kontaktet → tilbud sendt → kontrakt → aktiv kunde** (samt **tabt**). Bygget som portfolio-projekt for at vise både fullstack-udvikling og en operations-tankegang — at styre og overskue kunderejsen ét sted.

> **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase (Postgres) · @dnd-kit · Zod · Sonner

---

## Hvad kan den?

- **Kanban-board** med en kolonne pr. stage. Træk kort mellem kolonnerne (drag-and-drop) for at flytte et lead videre i pipelinen. Hvert kort har også en menu, så man kan flytte/redigere/slette uden at trække.
- **Dashboard øverst**: åben pipeline-værdi (DKK), vundet værdi, antal aktive kunder, antal leads i alt — plus fordeling pr. stage.
- **Listevisning** som alternativ til boardet, med **fritekst-søgning** (navn/virksomhed/email) og **stage-filter**. I listen kan man skifte stage direkte med en dropdown.
- **Opret / rediger / slet leads** (navn, virksomhed, kontakt-email, deal-værdi i DKK, stage, noter, oprettet-dato).
- **Seed-data** med 12 realistiske danske leads, så appen ser levende ud fra første åbning.
- **Responsivt** og lyst UI, klar til at vise frem.

## Skærmbilleder

> _Plads til screenshots — tag dem fra den kørende app og læg dem i `docs/`._

| Board | Liste |
| --- | --- |
| `docs/screenshot-board.png` | `docs/screenshot-liste.png` |

---

## Kom i gang

Kræver Node 18+ (udviklet på Node 26) og npm.

```bash
npm install
npm run dev
# åbn http://localhost:3000
```

**Du behøver ikke at sætte noget op for at komme i gang.** Hvis der ikke er nogen Supabase-nøgler, gemmer appen automatisk data i en lokal fil (`.data/leads.json`) med det samme seed-data. Perfekt til hurtigt at prøve den af.

### Valgfrit: kør med Supabase (Postgres)

Vil du bruge en rigtig database i stedet for den lokale fil:

1. Opret et gratis projekt på [supabase.com](https://supabase.com).
2. Kør SQL'en i `supabase/migrations/0001_leads.sql` og derefter `supabase/seed.sql` (fx i Supabase SQL Editor).
3. Kopiér `.env.example` til `.env.local` og udfyld:

   ```bash
   cp .env.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=...        # Project Settings → API
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...   # Project Settings → API
   ```

4. Genstart `npm run dev`. Appen registrerer automatisk nøglerne og bruger Supabase.

---

## Hvordan er det skruet sammen?

```
src/
  app/
    page.tsx            # forsiden (server-komponent): henter leads + viser dashboard/workspace
    leads/actions.ts    # Server Actions: opret/opdatér/slet/flyt-stage
  components/
    dashboard/          # StatsBar (dashboard-tal)
    board/              # KanbanBoard, StageColumn, LeadCard (drag-drop)
    list/               # LeadList, LeadRow (søgning + filter)
    leads/              # LeadFormDialog, AddLeadButton, DeleteLeadButton
    ui/                 # små genbrugelige byggeklodser (Button, Modal, fields, …)
  lib/
    types.ts            # ét sted med stages, farver og Lead-typen
    validation.ts       # Zod-skema (input valideres på serveren)
    stats.ts            # rene funktioner til dashboard-beregninger
    format.ts           # formatér DKK og datoer
    data/leads.ts       # DATALAGET: vælger Supabase eller lokal fallback
    data/local-store.ts # JSON-fil-fallback
    supabase/server.ts  # Supabase-klient (kun server-side)
supabase/
  migrations/0001_leads.sql  # tabel + CHECK + RLS + updated_at-trigger
  seed.sql                   # demo-data
```

**Et par bevidste valg:**

- **Ét datalag (`lib/data/leads.ts`).** Resten af appen er ligeglad med, om data ligger i Supabase eller en lokal fil — den importerer kun herfra. Det gør databasen til en detalje, man kan skifte ud.
- **Alle ændringer går gennem Server Actions** på serveren, som validerer med Zod først. Browseren taler aldrig direkte med databasen.
- **Optimistisk UI på boardet:** når man trækker et kort, flytter det med det samme, og serveren opdateres bagefter. Går noget galt, ruller appen tilbage.

---

## Hvad jeg lærte

- **Server Actions i Next.js (App Router).** Hvordan man laver mutationer uden at skrive et separat API-lag, og hvorfor validering altid skal ske på serveren (`revalidatePath` for at vise friske data bagefter).
- **At designe et udskifteligt datalag.** Ved at samle al dataadgang ét sted kunne jeg starte uden database (lokal fil) og koble Supabase på senere uden at ændre UI'et. God operations-vane: gør det nemt at komme i gang, og gør infrastruktur til noget man kan bytte ud.
- **Drag-and-drop med @dnd-kit**, og en virkelig faldgrube undervejs: en *hydration mismatch*, fordi biblioteket tilføjede attributter i browseren, som ikke fandtes ved server-rendering. Løst ved først at aktivere drag efter mount.
- **Row Level Security i Postgres** — og hvorfor man tænker på adgangskontrol fra starten, selv i en lille app.
- **At holde tal-logik adskilt** i rene funktioner (`stats.ts`), så dashboardet er nemt at læse og ville være nemt at teste.

---

## Næste skridt (ikke bygget endnu)

- **AI-opfølgningsmail (Claude API):** en knap på et lead, der genererer et udkast til en opfølgnings-email ud fra leadets noter — så man hurtigt kan komme videre med kunden.
- **Login og brugere:** tilføj auth og stram RLS-policies, så hver bruger kun ser sine egne leads.
- **Aktivitets-historik** pr. lead (hvornår skiftede det stage, hvem gjorde hvad).
- **Eksport til CSV** og simple rapporter (fx win-rate pr. måned).

---

_Bygget af August Hahn Michelsen._
