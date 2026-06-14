import "server-only";
import { Lead, LeadInput } from "../types";
import { createServerClient, hasSupabase } from "../supabase/server";
import {
  localCreateLead,
  localDeleteLead,
  localGetLeads,
  localUpdateLead,
} from "./local-store";

/**
 * Datalaget — ét sted hvor al læsning/skrivning af leads sker.
 *
 * Hver funktion tjekker `hasSupabase()`:
 *  - er der Supabase-nøgler → brug databasen
 *  - ellers → brug den lokale fil-fallback
 *
 * Resten af appen importerer KUN herfra og er ligeglad med hvilket lager der
 * bruges. Det gør Supabase til en detalje, vi kan skifte ud, uden at røre UI'en.
 */

export async function getLeads(): Promise<Lead[]> {
  if (!hasSupabase()) return localGetLeads();

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Lead[];
}

export async function createLead(input: LeadInput): Promise<Lead> {
  if (!hasSupabase()) return localCreateLead(input);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    .insert(input)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Lead;
}

export async function updateLead(
  id: string,
  input: LeadInput,
): Promise<Lead> {
  if (!hasSupabase()) return localUpdateLead(id, input);

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("leads")
    // updated_at sættes automatisk af en trigger i databasen (se migrationen).
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Lead;
}

export async function deleteLead(id: string): Promise<void> {
  if (!hasSupabase()) return localDeleteLead(id);

  const supabase = createServerClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
