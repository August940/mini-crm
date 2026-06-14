/**
 * Små formaterings-hjælpere, så tal og datoer ser danske ud overalt.
 */

// Formaterer et heltal som DKK, fx 45000 → "45.000 kr.".
export function formatDKK(amount: number): string {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Formaterer en ISO-dato som dansk dato, fx "2026-06-14" → "14. jun. 2026".
export function formatDato(iso: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
