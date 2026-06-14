"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteLeadAction } from "@/app/leads/actions";
import { cn } from "@/lib/utils";

/**
 * Sletter et lead efter en bekræftelse. Vi bruger en simpel browser-confirm,
 * så man ikke kommer til at slette ved et uheld.
 */
export function DeleteLeadButton({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function slet() {
    if (!window.confirm(`Slet leadet "${name}"? Dette kan ikke fortrydes.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteLeadAction(id);
      if (result.ok) toast.success("Lead slettet");
      else toast.error(result.error);
    });
  }

  return (
    <button
      type="button"
      onClick={slet}
      disabled={pending}
      className={cn(
        "text-left text-sm text-rose-600 hover:text-rose-700 disabled:opacity-50",
        className,
      )}
    >
      {pending ? "Sletter…" : "Slet"}
    </button>
  );
}
