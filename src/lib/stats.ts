import { Lead, PIPELINE_STAGES, Stage, STAGES } from "./types";

/**
 * Rene funktioner der regner dashboard-tallene ud fra en liste af leads.
 * "Rene" betyder: samme input giver altid samme output, og de rører ikke
 * databasen — det gør dem nemme at læse og teste.
 */

// Hvor mange leads ligger i hvert stage? Fx { lead: 3, kontaktet: 2, ... }.
export function antalPrStage(leads: Lead[]): Record<Stage, number> {
  // Start med 0 i alle stages, så tomme kolonner også får et tal.
  const start = Object.fromEntries(STAGES.map((s) => [s, 0])) as Record<
    Stage,
    number
  >;
  return leads.reduce((acc, lead) => {
    acc[lead.stage] += 1;
    return acc;
  }, start);
}

// Samlet værdi af de leads der stadig er "i spil" (åben pipeline).
export function pipelineVaerdi(leads: Lead[]): number {
  return leads
    .filter((l) => PIPELINE_STAGES.includes(l.stage))
    .reduce((sum, l) => sum + l.deal_value, 0);
}

// Samlet værdi af de leads vi har vundet (aktive kunder).
export function vundetVaerdi(leads: Lead[]): number {
  return leads
    .filter((l) => l.stage === "aktiv")
    .reduce((sum, l) => sum + l.deal_value, 0);
}

// Antal aktive kunder.
export function antalAktive(leads: Lead[]): number {
  return leads.filter((l) => l.stage === "aktiv").length;
}
