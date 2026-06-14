"use client";

import { useMemo, useState } from "react";
import { Lead, Stage, STAGES, STAGE_META } from "@/lib/types";
import { Input, Select } from "@/components/ui/fields";
import { LeadRow } from "./LeadRow";

/**
 * Listevisning som alternativ til boardet.
 * Har fritekst-søgning (navn/virksomhed/email) og et stage-filter. Filtreringen
 * sker i browseren med useMemo, så det føles øjeblikkeligt.
 */
export function LeadList({ leads }: { leads: Lead[] }) {
  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<"alle" | Stage>("alle");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const matchStage = stageFilter === "alle" || l.stage === stageFilter;
      const matchTekst =
        q === "" ||
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q);
      return matchStage && matchTekst;
    });
  }, [leads, query, stageFilter]);

  return (
    <div className="space-y-3">
      {/* Søgning + filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="search"
          placeholder="Søg på navn, virksomhed eller email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:max-w-xs"
        />
        <Select
          aria-label="Filtrér på stage"
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value as "alle" | Stage)}
          className="sm:max-w-[12rem]"
        >
          <option value="alle">Alle stadier</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_META[s].label}
            </option>
          ))}
        </Select>
        <span className="text-sm text-slate-400 sm:ml-auto">
          {filtered.length} af {leads.length}
        </span>
      </div>

      {/* Tabel-agtig liste */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Kolonne-overskrifter (kun på store skærme). */}
        <div className="hidden grid-cols-[1.6fr_1.4fr_0.9fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-500 md:grid">
          <span>Navn</span>
          <span>Kontakt</span>
          <span>Værdi</span>
          <span>Stage</span>
          <span className="text-right">Handlinger</span>
        </div>

        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-slate-400">
            Ingen leads matcher din søgning.
          </p>
        ) : (
          filtered.map((lead) => <LeadRow key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
}
