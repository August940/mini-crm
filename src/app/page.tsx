import { getLeads } from "@/lib/data/leads";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { Workspace } from "@/components/Workspace";
import { AddLeadButton } from "@/components/leads/AddLeadButton";

// Forsiden er en server-komponent: den henter leads på serveren (Supabase eller
// lokal fallback) og sender dem videre til dashboard og workspace.
// force-dynamic: hent altid friske data, så listen er opdateret efter ændringer.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const leads = await getLeads();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
      {/* Header med titel og "Tilføj lead"-knap. */}
      <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">
            Pipeline <span className="text-slate-400">· Mini-CRM</span>
          </h1>
          <p className="text-sm text-slate-500">
            Følg kunderejsen fra lead til aktiv kunde.
          </p>
        </div>
        <AddLeadButton />
      </header>

      <div className="space-y-6">
        <StatsBar leads={leads} />
        <Workspace leads={leads} />
      </div>
    </div>
  );
}
