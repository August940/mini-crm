import { z } from "zod";
import { Stage, STAGES } from "./types";

/**
 * Zod-skema der validerer det, brugeren indtaster i lead-formularen.
 *
 * Vi validerer ALTID på serveren (i Server Actions), aldrig kun i browseren —
 * en bruger kan omgå browser-validering, så serveren er den der bestemmer.
 */
export const leadSchema = z.object({
  name: z.string().trim().min(1, "Navn er påkrævet").max(120),
  company: z.string().trim().max(120).default(""),
  // Tillad enten en gyldig email eller helt tomt felt.
  email: z
    .union([z.string().trim().email("Ugyldig email"), z.literal("")])
    .default(""),
  // FormData/inputs giver tekst — coerce laver det om til et tal.
  deal_value: z.coerce
    .number()
    .int("Skal være et helt tal")
    .min(0, "Kan ikke være negativ")
    .max(1_000_000_000),
  stage: z.enum(STAGES as [Stage, ...Stage[]]),
  notes: z.string().trim().max(2000).default(""),
});

// Typen udledt af skemaet (matcher LeadInput i types.ts).
export type LeadFormValues = z.infer<typeof leadSchema>;
