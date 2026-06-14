import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * `cn` samler flere klasse-navne til ét. clsx håndterer betingede klasser
 * (fx isActive && "bg-blue-500"), og twMerge sørger for, at modstridende
 * Tailwind-klasser ikke kæmper mod hinanden (sidste vinder).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
