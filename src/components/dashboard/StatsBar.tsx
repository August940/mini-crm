import { Lead, STAGES, STAGE_META } from "@/lib/types";
import {
  antalAktive,
  antalPrStage,
  pipelineVaerdi,
  vundetVaerdi,
} from "@/lib/stats";
import { formatDKK } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Dashboard øverst på siden. Viser de vigtigste tal med ét blik:
 * åben pipeline-værdi, vundet værdi, antal aktive kunder og antal leads i alt.
 * Nederst en lille oversigt med antal leads pr. stage.
 *
 * Dette er en server-komponent: tallene regnes på serveren ud fra `leads`.
 */
export function StatsBar({ leads }: { leads: Lead[] }) {
  const prStage = antalPrStage(leads);

  const kort = [
    {
      label: "Åben pipeline",
      value: formatDKK(pipelineVaerdi(leads)),
      hint: "Værdi af leads stadig i spil",
    },
    {
      label: "Vundet værdi",
      value: formatDKK(vundetVaerdi(leads)),
      hint: "Værdi fra aktive kunder",
    },
    {
      label: "Aktive kunder",
      value: String(antalAktive(leads)),
      hint: "Leads i stadiet “Aktiv kunde”",
    },
    {
      label: "Leads i alt",
      value: String(leads.length),
      hint: "På tværs af alle stadier",
    },
  ];

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kort.map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {k.label}
            </p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {k.value}
            </p>
            <p className="mt-1 text-xs text-slate-400">{k.hint}</p>
          </div>
        ))}
      </div>

      {/* Lille fordeling pr. stage. */}
      <div className="flex flex-wrap gap-2">
        {STAGES.map((s) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600"
          >
            <span className={cn("h-2 w-2 rounded-full", STAGE_META[s].dot)} />
            {STAGE_META[s].label}
            <span className="font-semibold text-slate-900">{prStage[s]}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
