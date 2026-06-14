"use client";

import { useState, useTransition } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { Lead, STAGES, STAGE_META } from "@/lib/types";
import { formatDKK, formatDato } from "@/lib/format";
import { cn } from "@/lib/utils";
import { moveStageAction } from "@/app/leads/actions";
import { LeadFormDialog } from "@/components/leads/LeadFormDialog";
import { DeleteLeadButton } from "@/components/leads/DeleteLeadButton";

/**
 * Et kort der viser ét lead på kanban-boardet.
 *
 * - Hele kortet kan trækkes (useDraggable fra @dnd-kit).
 * - "⋯"-knappen åbner en lille menu med Rediger / Flyt til / Slet. "Flyt til"
 *   er et alternativ til drag-drop (godt på mobil og for tastatur-brugere).
 */
export function LeadCard({
  lead,
  dndEnabled = true,
}: {
  lead: Lead;
  dndEnabled?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id });

  // Vi slår drag-attributterne til FØRST når komponenten er mountet i browseren.
  // Ellers ville @dnd-kit tilføje aria-attributter, der ikke matcher server-
  // renderingen (en "hydration mismatch"). Server + første klient-render er nu ens.
  const dragProps = dndEnabled ? { ...attributes, ...listeners } : {};

  function flytTil(stage: Lead["stage"]) {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await moveStageAction(lead.id, stage);
      if (result.ok) toast.success(`Flyttet til “${STAGE_META[stage].label}”`);
      else toast.error(result.error);
    });
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Translate.toString(transform) }}
        className={cn(
          "group relative rounded-lg border border-slate-200 bg-white p-3 shadow-sm",
          dndEnabled && "cursor-grab active:cursor-grabbing",
          isDragging && "opacity-40",
          pending && "opacity-60",
        )}
        {...dragProps}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{lead.name}</p>
            {lead.company && (
              <p className="truncate text-sm text-slate-500">{lead.company}</p>
            )}
          </div>

          {/* Menu-knap. onPointerDown stopper, så et klik ikke starter en drag. */}
          <button
            type="button"
            aria-label="Handlinger"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => setMenuOpen((v) => !v)}
            className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ⋯
          </button>
        </div>

        <p className="mt-2 text-sm font-semibold text-slate-800">
          {formatDKK(lead.deal_value)}
        </p>

        {lead.notes && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
            {lead.notes}
          </p>
        )}

        <p className="mt-2 text-[11px] text-slate-400">
          Oprettet {formatDato(lead.created_at)}
        </p>

        {/* Lille dropdown-menu. */}
        {menuOpen && (
          <div
            className="absolute right-2 top-9 z-10 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setEditOpen(true);
              }}
              className="block w-full rounded px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              Rediger
            </button>

            <div className="my-1 border-t border-slate-100" />
            <p className="px-2 py-1 text-[11px] uppercase tracking-wide text-slate-400">
              Flyt til
            </p>
            {STAGES.filter((s) => s !== lead.stage).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => flytTil(s)}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-100"
              >
                <span
                  className={cn("h-2 w-2 rounded-full", STAGE_META[s].dot)}
                />
                {STAGE_META[s].label}
              </button>
            ))}

            <div className="my-1 border-t border-slate-100" />
            <div className="px-2 py-1.5">
              <DeleteLeadButton id={lead.id} name={lead.name} />
            </div>
          </div>
        )}
      </div>

      <LeadFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        lead={lead}
      />
    </>
  );
}
