"use client";

import { useEffect, useState, useTransition } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { Lead, Stage, STAGES } from "@/lib/types";
import { moveStageAction } from "@/app/leads/actions";
import { StageColumn } from "./StageColumn";

/**
 * Kanban-boardet: én kolonne pr. stage, og kort man kan trække imellem dem.
 *
 * Optimistisk UI: når et kort slippes, flytter vi det med det samme i den
 * lokale state (føles hurtigt), og kalder DEREFTER serveren. Går serveren galt,
 * ruller vi tilbage og viser en fejl.
 */
export function KanbanBoard({ leads }: { leads: Lead[] }) {
  // Lokal kopi af leads, så vi kan flytte kort med det samme.
  const [items, setItems] = useState<Lead[]>(leads);
  const [, startTransition] = useTransition();

  // `mounted` bliver true efter første render i browseren. Vi bruger det til at
  // slå drag-attributterne til, så server- og klient-render matcher (ingen
  // hydration-fejl). Indtil da kan man stadig flytte via "⋯"-menuen.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Når serveren sender friske data (efter revalidate), synkroniser.
  useEffect(() => setItems(leads), [leads]);

  // Kræv at man trækker mindst 6px, før en drag starter — så almindelige
  // klik (fx på menu-knappen) ikke ved et uheld bliver til en drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const leadId = String(active.id);
    const nyStage = over.id as Stage;

    const lead = items.find((l) => l.id === leadId);
    if (!lead || lead.stage === nyStage) return; // ingen ændring

    const forrige = items; // gem til evt. tilbagerulning
    // Optimistisk: opdatér stage lokalt med det samme.
    setItems((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: nyStage } : l)),
    );

    startTransition(async () => {
      const result = await moveStageAction(leadId, nyStage);
      if (!result.ok) {
        setItems(forrige); // rul tilbage ved fejl
        toast.error(result.error);
      }
    });
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      {/* Vandret scroll på mobil, så alle kolonner kan nås. */}
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {STAGES.map((stage) => (
          <StageColumn
            key={stage}
            stage={stage}
            leads={items.filter((l) => l.stage === stage)}
            dndEnabled={mounted}
          />
        ))}
      </div>
    </DndContext>
  );
}
