/**
 * Centrale typer og "stage"-konfiguration for hele appen.
 *
 * Dette er ÉT sted, hvor pipelinens stadier defineres. Både UI'en (farver,
 * labels, kolonne-rækkefølge) og databasen (CHECK-constraint i migrationen)
 * holder sig til den samme liste. Skal du tilføje et stadie, gør du det her.
 */

// Et "stage" er hvor langt et lead er i salgsrejsen.
export type Stage =
  | "lead"
  | "kontaktet"
  | "tilbud_sendt"
  | "kontrakt"
  | "aktiv"
  | "tabt";

// Rækkefølgen kolonnerne vises i på kanban-boardet (venstre → højre).
export const STAGES: Stage[] = [
  "lead",
  "kontaktet",
  "tilbud_sendt",
  "kontrakt",
  "aktiv",
  "tabt",
];

// Visuel + tekstlig info pr. stage. `badge`/`dot` er Tailwind-klasser.
export const STAGE_META: Record<
  Stage,
  { label: string; badge: string; dot: string }
> = {
  lead: {
    label: "Lead",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  },
  kontaktet: {
    label: "Kontaktet",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
  tilbud_sendt: {
    label: "Tilbud sendt",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  kontrakt: {
    label: "Kontrakt",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  aktiv: {
    label: "Aktiv kunde",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  tabt: {
    label: "Tabt",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

// Stadier der tæller som "åben pipeline" (alt undtagen vundet og tabt).
// Bruges til at regne den samlede pipeline-værdi ud i dashboardet.
export const PIPELINE_STAGES: Stage[] = [
  "lead",
  "kontaktet",
  "tilbud_sendt",
  "kontrakt",
];

// Et lead, præcis som det ligger i databasen / fallback-lageret.
export interface Lead {
  id: string;
  name: string; // kontaktperson
  company: string; // virksomhed
  email: string; // kontakt-email
  deal_value: number; // deal-værdi i hele DKK
  stage: Stage;
  notes: string;
  created_at: string; // ISO-dato
  updated_at: string; // ISO-dato
}

// Felterne brugeren selv udfylder i formularen (resten sættes af systemet).
export interface LeadInput {
  name: string;
  company: string;
  email: string;
  deal_value: number;
  stage: Stage;
  notes: string;
}
