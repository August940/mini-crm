import { Stage } from "../types";

/**
 * Seed-data: realistiske danske leads, så appen ser "levende" ud første gang.
 *
 * Vi gemmer en `daysAgo` i stedet for en fast dato, så datoerne altid ser
 * friske ud uanset hvornår appen startes. Den lokale fallback laver datoerne
 * om til rigtige tidsstempler. (supabase/seed.sql spejler de samme rækker.)
 */
export interface SeedLead {
  name: string;
  company: string;
  email: string;
  deal_value: number;
  stage: Stage;
  notes: string;
  daysAgo: number; // hvor mange dage siden leadet blev oprettet
}

export const SEED_LEADS: SeedLead[] = [
  {
    name: "Mette Sørensen",
    company: "Nordisk Byg A/S",
    email: "mette@nordiskbyg.dk",
    deal_value: 120000,
    stage: "lead",
    notes: "Kom ind via kontaktformular. Vil høre om abonnement til 15 brugere.",
    daysAgo: 2,
  },
  {
    name: "Lars Holm",
    company: "Holm Consulting",
    email: "lars@holmconsulting.dk",
    deal_value: 85000,
    stage: "kontaktet",
    notes: "Ringede tirsdag. Sender mere info om priser. Følg op om en uge.",
    daysAgo: 6,
  },
  {
    name: "Sofie Lund",
    company: "Lund Design",
    email: "sofie@lunddesign.dk",
    deal_value: 240000,
    stage: "tilbud_sendt",
    notes: "Tilbud sendt 12/6. Afventer svar fra deres ledelse.",
    daysAgo: 11,
  },
  {
    name: "Anders Kjær",
    company: "Kjær Logistik",
    email: "anders@kjaerlogistik.dk",
    deal_value: 450000,
    stage: "kontrakt",
    notes: "Kontrakt under review hos deres jurist. Forventet underskrift næste uge.",
    daysAgo: 19,
  },
  {
    name: "Camilla Berg",
    company: "BergTech ApS",
    email: "camilla@bergtech.dk",
    deal_value: 180000,
    stage: "aktiv",
    notes: "Onboardet og kører. Meget tilfreds. Mulighed for udvidelse i Q4.",
    daysAgo: 34,
  },
  {
    name: "Jonas Dahl",
    company: "Dahl Marketing",
    email: "jonas@dahlmarketing.dk",
    deal_value: 60000,
    stage: "lead",
    notes: "Hentede whitepaper. Lille team, men vokser hurtigt.",
    daysAgo: 1,
  },
  {
    name: "Pernille Vinther",
    company: "Vinther & Co",
    email: "pernille@vintherco.dk",
    deal_value: 95000,
    stage: "kontaktet",
    notes: "Booket demo til fredag kl. 10. Interesseret i rapport-modulet.",
    daysAgo: 4,
  },
  {
    name: "Frederik Møller",
    company: "Møller Industri",
    email: "frederik@mollerindustri.dk",
    deal_value: 320000,
    stage: "tilbud_sendt",
    notes: "Vil have tilbud med både årlig og månedlig betaling. Sendt 9/6.",
    daysAgo: 8,
  },
  {
    name: "Ida Nielsen",
    company: "Nielsen Group",
    email: "ida@nielsengroup.dk",
    deal_value: 510000,
    stage: "aktiv",
    notes: "Største kunde. Kvartalsvis check-in aftalt. Reference muligt.",
    daysAgo: 52,
  },
  {
    name: "Thomas Bach",
    company: "Bach Software",
    email: "thomas@bachsoftware.dk",
    deal_value: 75000,
    stage: "tabt",
    notes: "Valgte en konkurrent pga. pris. Genovervej om 6 måneder.",
    daysAgo: 40,
  },
  {
    name: "Louise Friis",
    company: "Friis Rådgivning",
    email: "louise@friisraadgivning.dk",
    deal_value: 40000,
    stage: "lead",
    notes: "Anbefalet af Camilla (BergTech). Varm lead.",
    daysAgo: 3,
  },
  {
    name: "Rasmus Toft",
    company: "Toft Energi",
    email: "rasmus@toftenergi.dk",
    deal_value: 600000,
    stage: "kontrakt",
    notes: "Stor aftale. Afventer godkendelse af budget. Tæt på lukning.",
    daysAgo: 23,
  },
];
