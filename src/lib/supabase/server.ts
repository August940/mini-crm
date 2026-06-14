import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase-klient til server-brug.
 *
 * Vigtigt: vi opretter KUN denne klient inde i Server Actions / server-kode.
 * Browseren får aldrig en database-klient og taler aldrig direkte med Supabase
 * — al adgang går gennem vores egne server-funktioner. Det holder angrebsfladen
 * lille, selv om appen (endnu) ikke har login.
 *
 * Tabellen har Row Level Security slået til. Da der ikke er brugere endnu,
 * tillader policy'en de nødvendige handlinger. Næste skridt (se README) er at
 * tilføje login og stramme policies, så hver bruger kun ser sine egne leads.
 */

// Er Supabase sat op? Hvis ikke, falder datalaget tilbage til en lokal fil.
export function hasSupabase(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    // Ingen brugersessioner — vi laver kun korte server-til-server kald.
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
