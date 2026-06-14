"use client";

import { useState } from "react";
import { Lead } from "@/lib/types";
import { cn } from "@/lib/utils";
import { KanbanBoard } from "@/components/board/KanbanBoard";
import { LeadList } from "@/components/list/LeadList";

type Tab = "board" | "liste";

/**
 * Skifter mellem de to visninger af de samme leads: kanban-board og liste.
 * Begge får den samme `leads`-liste fra serveren.
 */
export function Workspace({ leads }: { leads: Lead[] }) {
  const [tab, setTab] = useState<Tab>("board");

  return (
    <div className="space-y-4">
      {/* Fane-knapper */}
      <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1">
        {(["board", "liste"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {t === "board" ? "Board" : "Liste"}
          </button>
        ))}
      </div>

      {tab === "board" ? (
        <KanbanBoard leads={leads} />
      ) : (
        <LeadList leads={leads} />
      )}
    </div>
  );
}
