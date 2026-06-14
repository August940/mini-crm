"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Lead, STAGES, STAGE_META } from "@/lib/types";
import { formatDKK, formatDato } from "@/lib/format";
import { Select } from "@/components/ui/fields";
import { StageBadge } from "@/components/ui/StageBadge";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { DeleteLeadButton } from "@/components/leads/DeleteLeadButton";
import { moveStageAction } from "@/app/leads/actions";

/**
 * Én række i listevisningen. Layoutet er responsivt:
 *  - på store skærme: kolonner side om side (md:grid-cols-…)
 *  - på mobil: alt stablet under hinanden.
 * I listen kan man skifte stage direkte med en dropdown (et simpelt alternativ
 * til at trække kort på boardet).
 */
export function LeadRow({ lead }: { lead: Lead }) {
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function skiftStage(stage: Lead["stage"]) {
    startTransition(async () => {
      const result = await moveStageAction(lead.id, stage);
      if (result.ok) toast.success(`Flyttet til “${STAGE_META[stage].label}”`);
      else toast.error(result.error);
    });
  }

  return (
    <>
      <div
        className="grid grid-cols-1 gap-2 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0 hover:bg-slate-50 md:grid-cols-[1.6fr_1.4fr_0.9fr_1fr_auto] md:items-center md:gap-4"
      >
        {/* Navn + virksomhed */}
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900">{lead.name}</p>
          {lead.company && (
            <p className="truncate text-xs text-slate-500">{lead.company}</p>
          )}
        </div>

        {/* Email + oprettet-dato */}
        <div className="min-w-0 text-slate-600">
          <p className="truncate">{lead.email || "—"}</p>
          <p className="text-xs text-slate-400">{formatDato(lead.created_at)}</p>
        </div>

        {/* Deal-værdi */}
        <div className="font-medium text-slate-800">
          {formatDKK(lead.deal_value)}
        </div>

        {/* Stage: badge på mobil-visning + dropdown til at skifte */}
        <div className="flex items-center gap-2">
          <span className="md:hidden">
            <StageBadge stage={lead.stage} />
          </span>
          <Select
            aria-label="Skift stage"
            value={lead.stage}
            disabled={pending}
            onChange={(e) => skiftStage(e.target.value as Lead["stage"])}
            className="h-8 py-1 text-xs"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_META[s].label}
              </option>
            ))}
          </Select>
        </div>

        {/* Handlinger */}
        <div className="flex items-center gap-3 md:justify-end">
          <button
            type="button"
            onClick={() => setEditOpen(true)}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Rediger
          </button>
          <DeleteLeadButton id={lead.id} name={lead.name} />
        </div>
      </div>

      <LeadFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        lead={lead}
      />
    </>
  );
}
