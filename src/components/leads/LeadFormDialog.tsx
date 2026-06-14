"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select, Textarea } from "@/components/ui/fields";
import { Lead, LeadInput, STAGES, STAGE_META } from "@/lib/types";
import { createLeadAction, updateLeadAction } from "@/app/leads/actions";

// Tomme startværdier til "tilføj"-formularen.
const TOM: LeadInput = {
  name: "",
  company: "",
  email: "",
  deal_value: 0,
  stage: "lead",
  notes: "",
};

/**
 * Modal med formular til at oprette ELLER redigere et lead.
 * Forælderen styrer om den er åben (open) og giver et `lead` med ved redigering.
 */
export function LeadFormDialog({
  open,
  onClose,
  lead,
}: {
  open: boolean;
  onClose: () => void;
  lead?: Lead; // hvis sat → redigerings-tilstand
}) {
  const erRedigering = Boolean(lead);

  // Formular-felterne holdes i én state-variabel. Ved redigering starter vi
  // med leadets nuværende værdier, ellers med tomme felter.
  const [form, setForm] = useState<LeadInput>(
    lead
      ? {
          name: lead.name,
          company: lead.company,
          email: lead.email,
          deal_value: lead.deal_value,
          stage: lead.stage,
          notes: lead.notes,
        }
      : TOM,
  );

  // useTransition giver os en "pending"-tilstand mens serveren arbejder.
  const [pending, startTransition] = useTransition();

  function opdater<K extends keyof LeadInput>(felt: K, vaerdi: LeadInput[K]) {
    setForm((f) => ({ ...f, [felt]: vaerdi }));
  }

  function gem() {
    startTransition(async () => {
      const result = erRedigering
        ? await updateLeadAction(lead!.id, form)
        : await createLeadAction(form);

      if (result.ok) {
        toast.success(erRedigering ? "Lead opdateret" : "Lead oprettet");
        onClose();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={erRedigering ? "Rediger lead" : "Nyt lead"}
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          gem();
        }}
      >
        <div>
          <Label htmlFor="name">Navn *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => opdater("name", e.target.value)}
            placeholder="Fx Mette Sørensen"
            autoFocus
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company">Virksomhed</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => opdater("company", e.target.value)}
              placeholder="Fx Nordisk Byg A/S"
            />
          </div>
          <div>
            <Label htmlFor="email">Kontakt-email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => opdater("email", e.target.value)}
              placeholder="navn@firma.dk"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="deal_value">Deal-værdi (DKK)</Label>
            <Input
              id="deal_value"
              type="number"
              min={0}
              step={1000}
              value={form.deal_value}
              onChange={(e) => opdater("deal_value", Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select
              id="stage"
              value={form.stage}
              onChange={(e) => opdater("stage", e.target.value as LeadInput["stage"])}
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_META[s].label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Noter</Label>
          <Textarea
            id="notes"
            rows={3}
            value={form.notes}
            onChange={(e) => opdater("notes", e.target.value)}
            placeholder="Hvad er status? Hvad er næste skridt?"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annullér
          </Button>
          <Button type="submit" disabled={pending}>
            {pending ? "Gemmer…" : erRedigering ? "Gem ændringer" : "Opret lead"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
