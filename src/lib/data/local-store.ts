import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Lead, LeadInput, Stage } from "../types";
import { SEED_LEADS } from "./seed";

/**
 * Lokal fil-fallback. Bruges når der IKKE er Supabase-nøgler i miljøet.
 *
 * Data gemmes i en JSON-fil i `.data/leads.json` (ligger i .gitignore).
 * Det betyder, at appen kører med nul opsætning — perfekt når en anden
 * cloner repoet — og at ændringer faktisk gemmes mellem genstarter.
 *
 * Bemærk: dette er bevidst simpelt (ingen rigtig database). Til produktion
 * bruger vi Supabase i stedet, se leads.ts.
 */

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "leads.json");

// Laver seed-rækkerne om til rigtige Lead-objekter med id'er og datoer.
function buildSeed(): Lead[] {
  const now = Date.now();
  return SEED_LEADS.map((s) => {
    const created = new Date(now - s.daysAgo * 24 * 60 * 60 * 1000);
    return {
      id: crypto.randomUUID(),
      name: s.name,
      company: s.company,
      email: s.email,
      deal_value: s.deal_value,
      stage: s.stage,
      notes: s.notes,
      created_at: created.toISOString(),
      updated_at: created.toISOString(),
    };
  });
}

// Sørg for at filen findes. Findes den ikke, skrives seed-data første gang.
async function ensureFile(): Promise<void> {
  try {
    await fs.access(FILE);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(buildSeed(), null, 2), "utf8");
  }
}

async function readAll(): Promise<Lead[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE, "utf8");
  return JSON.parse(raw) as Lead[];
}

async function writeAll(leads: Lead[]): Promise<void> {
  await fs.writeFile(FILE, JSON.stringify(leads, null, 2), "utf8");
}

// Nyeste lead øverst.
export async function localGetLeads(): Promise<Lead[]> {
  const leads = await readAll();
  return leads.sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function localCreateLead(input: LeadInput): Promise<Lead> {
  const leads = await readAll();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: crypto.randomUUID(),
    ...input,
    created_at: now,
    updated_at: now,
  };
  await writeAll([lead, ...leads]);
  return lead;
}

export async function localUpdateLead(
  id: string,
  input: LeadInput,
): Promise<Lead> {
  const leads = await readAll();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lead ikke fundet");
  const updated: Lead = {
    ...leads[idx],
    ...input,
    updated_at: new Date().toISOString(),
  };
  leads[idx] = updated;
  await writeAll(leads);
  return updated;
}

export async function localSetStage(id: string, stage: Stage): Promise<void> {
  const leads = await readAll();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) throw new Error("Lead ikke fundet");
  leads[idx] = {
    ...leads[idx],
    stage,
    updated_at: new Date().toISOString(),
  };
  await writeAll(leads);
}

export async function localDeleteLead(id: string): Promise<void> {
  const leads = await readAll();
  await writeAll(leads.filter((l) => l.id !== id));
}
