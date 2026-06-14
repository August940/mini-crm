"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
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

// Returnerer false ved server-render + første klient-render, og true derefter.
// SSR-sikkert (ingen effect/setState), så det matcher under hydrering. Vi bruger
// det til at slå drag-attributterne til FØRST når siden er hydreret.
function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true, // i browseren
    () => false, // på serveren
  );
}

/**
 * Kanban-boardet: én kolonne pr. stage, og kort man kan trække imellem dem.
 *
 * Optimistisk UI: når et kort slippes, flytter vi det med det samme i den
 * lokale state (føles hurtigt), og kalder DEREFTER serveren. Går serveren galt,
 * ruller vi tilbage og viser en fejl.
 */
export function KanbanBoard({ leads }: { leads: Lead[] }) {
  // Lokal kopi af leads, så vi kan flytte kort med det samme (optimistisk).
  const [items, setItems] = useState<Lead[]>(leads);
  const [, startTransition] = useTransition();

  // Synkronisér med friske server-data UNDER render (React's anbefalede måde at
  // justere state på, når en prop ændrer sig — uden en useEffect). Når serveren
  // sender en ny `leads`-liste (efter revalidate), nulstiller vi den lokale kopi.
  const [forrigeLeads, setForrigeLeads] = useState<Lead[]>(leads);
  if (forrigeLeads !== leads) {
    setForrigeLeads(leads);
    setItems(leads);
  }

  // Drag slås først til når siden er hydreret (matcher server-render).
  const dndEnabled = useHydrated();

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
            dndEnabled={dndEnabled}
          />
        ))}
      </div>
    </DndContext>
  );
}
