"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

/**
 * En enkel modal (pop-up vindue). Den er "controlled": forælderen styrer om
 * den er åben via `open`, og får besked om at lukke via `onClose`.
 * Vi undgår et ekstra bibliotek og holder det forståeligt.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  // Luk med Escape-tasten, og lås baggrundens scroll mens modalen er åben.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-4 sm:items-center"
      onClick={onClose} // klik på den mørke baggrund lukker
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl",
          "my-8 sm:my-0",
        )}
        onClick={(e) => e.stopPropagation()} // klik inde i kortet lukker IKKE
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-900">{title}</h2>
        {children}
      </div>
    </div>
  );
}
