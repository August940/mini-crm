"use client";

import { useDroppable } from "@dnd-kit/core";
import { Lead, Stage, STAGE_META } from "@/lib/types";
import { formatDKK } from "@/lib/format";
import { cn } from "@/lib/utils";
import { LeadCard } from "./LeadCard";

/**
 * Én kolonne på boardet = ét stage. Den er en "droppable" zone: når et kort
 * slippes her, ved boardet at leadet skal flyttes til netop dette stage.
 */
export function StageColumn({
  stage,
  leads,
  dndEnabled = true,
}: {
  stage: Stage;
  leads: Lead[];
  dndEnabled?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const meta = STAGE_META[stage];
  const sum = leads.reduce((acc, l) => acc + l.deal_value, 0);

  return (
    <div className="flex w-72 shrink-0 flex-col">
      {/* Kolonne-overskrift med farve, navn, antal og samlet værdi. */}
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full", meta.dot)} />
          <span className="text-sm font-semibold text-slate-700">
            {meta.label}
          </span>
          <span className="rounded-full bg-slate-100 px-1.5 text-xs text-slate-500">
            {leads.length}
          </span>
        </div>
        <span className="text-xs text-slate-400">{formatDKK(sum)}</span>
      </div>

      {/* Selve drop-zonen. Bliver fremhævet når et kort svæver over den. */}
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-32 flex-1 flex-col gap-2 rounded-xl border border-dashed p-2 transition-colors",
          isOver
            ? "border-slate-400 bg-slate-100"
            : "border-slate-200 bg-slate-50/60",
        )}
      >
        {leads.length === 0 ? (
          <p className="px-1 py-6 text-center text-xs text-slate-400">
            Træk et kort hertil
          </p>
        ) : (
          leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} dndEnabled={dndEnabled} />
          ))
        )}
      </div>
    </div>
  );
}
