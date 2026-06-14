"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LeadFormDialog } from "./LeadFormDialog";

// Knap der åbner "nyt lead"-formularen. Styrer selv om modalen er åben.
export function AddLeadButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <span className="text-base leading-none">+</span> Tilføj lead
      </Button>
      <LeadFormDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
