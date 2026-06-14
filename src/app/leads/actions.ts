"use server";

import { revalidatePath } from "next/cache";
import {
  createLead,
  deleteLead,
  setLeadStage,
  updateLead,
} from "@/lib/data/leads";
import { leadSchema } from "@/lib/validation";
import { Stage, STAGES } from "@/lib/types";

/**
 * Server Actions: alle ændringer af leads sker her, på serveren.
 *
 * Hvert action:
 *  1) validerer input med Zod (man kan ikke stole på browseren),
 *  2) kalder datalaget (Supabase eller lokal fallback),
 *  3) kalder revalidatePath("/") så forsiden viser de friske data.
 *
 * De returnerer et simpelt resultat, så formularen kan vise en fejl pænt
 * i stedet for at appen crasher.
 */
export type ActionResult = { ok: true } | { ok: false; error: string };

// Find en kort, læsbar fejlbesked uanset hvad der gik galt.
function fejlBesked(e: unknown): string {
  return e instanceof Error ? e.message : "Noget gik galt. Prøv igen.";
}

export async function createLeadAction(values: unknown): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ugyldige felter" };
  }
  try {
    await createLead(parsed.data);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: fejlBesked(e) };
  }
}

export async function updateLeadAction(
  id: string,
  values: unknown,
): Promise<ActionResult> {
  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Ugyldige felter" };
  }
  try {
    await updateLead(id, parsed.data);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: fejlBesked(e) };
  }
}

export async function deleteLeadAction(id: string): Promise<ActionResult> {
  try {
    await deleteLead(id);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: fejlBesked(e) };
  }
}

// Bruges af kanban-boardet når et kort trækkes til en ny kolonne.
export async function moveStageAction(
  id: string,
  stage: Stage,
): Promise<ActionResult> {
  // Dobbelttjek at stage er gyldigt, før vi rører databasen.
  if (!STAGES.includes(stage)) {
    return { ok: false, error: "Ukendt stage" };
  }
  try {
    await setLeadStage(id, stage);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: fejlBesked(e) };
  }
}
