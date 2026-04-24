import { useAuth } from "../context";

export const MODULE = {
  ANMELDUNGEN:  "Anmeldungen",
  EINSTELLUNGEN:"Einstellungen",
  KALENDER:     "Kalender",
  KURSE:        "Kurse",
  LEHRER:       "Lehrer",
  NEWS:         "News",
  RAEUME:       "Räume",
  TEILNEHMER:   "Teilnehmer",
} as const;

export type ModuleName = (typeof MODULE)[keyof typeof MODULE];

/**
 * Returns a `has(moduleName)` function that checks whether the current user
 * has a module with that name assigned.
 * Admins always return true for every module.
 */
export function useModuleAccess(): (name: ModuleName) => boolean {
  const { user } = useAuth();

  if (user?.role === "admin") return () => true;

  const assignedNames = new Set((user?.modules ?? []).map((m) => m.name));

  return (name: ModuleName) => assignedNames.has(name);
}
