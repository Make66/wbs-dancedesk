import { useState, useEffect } from "react";
import { ClipboardList, Save, Check, Plus, Minus } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { settingsStore } from "../../stores/settingsStore";

type LocalRegistration = {
  titleCol1: string;
  titleCol2: string;
  delTime: string;
  checkSeats: boolean;
  waitingList: boolean;
  displayPastNumber: string;
  displayNumberOccurrences: string;
};

const RegistrationSettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const registration = settingsStore((s) => s.settings.registration);
  const setSettings = settingsStore((s) => s.setSettings);

  const [local, setLocal] = useState<LocalRegistration>({
    titleCol1: "",
    titleCol2: "",
    delTime: "",
    checkSeats: false,
    waitingList: false,
    displayPastNumber: "",
    displayNumberOccurrences: "",
  });

  useEffect(() => {
    setLocal({
      titleCol1: registration.titleCol1 ?? "",
      titleCol2: registration.titleCol2 ?? "",
      delTime: registration.delTime != null ? String(registration.delTime) : "",
      checkSeats: registration.checkSeats ?? false,
      waitingList: registration.waitingList ?? false,
      displayPastNumber:
        registration.displayPastNumber != null ? String(registration.displayPastNumber) : "",
      displayNumberOccurrences:
        registration.displayNumberOccurrences != null
          ? String(registration.displayNumberOccurrences)
          : "",
    });
  }, [registration]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const payload: Record<string, unknown> = {
        checkSeats: local.checkSeats,
        waitingList: local.waitingList,
      };
      if (local.titleCol1) payload.titleCol1 = local.titleCol1;
      if (local.titleCol2) payload.titleCol2 = local.titleCol2;
      if (local.delTime !== "") payload.delTime = Number(local.delTime);
      if (local.displayPastNumber !== "") payload.displayPastNumber = Number(local.displayPastNumber);
      if (local.displayNumberOccurrences !== "")
        payload.displayNumberOccurrences = Number(local.displayNumberOccurrences);

      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ registration: payload }),
      });
      if (!response.ok) throw new Error(`Fehler beim Speichern (${response.status}).`);
      setSettings({ registration: payload });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSaving(false);
    }
  };

  const textInputClass =
    "h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-sm focus:outline-none focus:ring-0";

  return (
    <div className="p-4 bg-cyan-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between ml-2 cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          <ClipboardList className="w-6 h-6" />
          <h3 className="font-semibold text-2xl">Anmeldung</h3>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="text-2xl mr-2" />
        ) : (
          <RiArrowDownSLine className="text-2xl mr-2" />
        )}
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(
              [
                { key: "titleCol1", label: "Spalte 1 Titel", placeholder: "z. B. Kurs" },
                { key: "titleCol2", label: "Spalte 2 Titel", placeholder: "z. B. Termin" },
              ] as { key: keyof LocalRegistration; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground pl-1">{label}</label>
                <input
                  type="text"
                  value={local[key] as string}
                  onChange={(e) => setLocal((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={textInputClass}
                />
              </div>
            ))}

            {(
              [
                { key: "delTime", label: "Löschfrist (Tage)", placeholder: "z. B. 30" },
                {
                  key: "displayPastNumber",
                  label: "Vergangene Kurse anzeigen",
                  placeholder: "z. B. 5",
                },
                {
                  key: "displayNumberOccurrences",
                  label: "Termine anzeigen",
                  placeholder: "z. B. 10",
                },
              ] as { key: keyof LocalRegistration; label: string; placeholder: string }[]
            ).map(({ key, label, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground pl-1">{label}</label>
                <input
                  type="number"
                  value={local[key] as string}
                  onChange={(e) => setLocal((prev) => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={textInputClass}
                />
              </div>
            ))}

            {(
              [
                { key: "checkSeats", label: "Plätze prüfen" },
                { key: "waitingList", label: "Warteliste aktiv" },
              ] as { key: "checkSeats" | "waitingList"; label: string }[]
            ).map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground pl-1">{label}</label>
                <button
                  type="button"
                  onClick={() => setLocal((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={`h-12 w-full rounded-xl border border-muted-foreground px-4 text-sm flex items-center gap-3 transition-colors cursor-pointer ${
                    local[key]
                      ? "bg-cyan-500 text-white"
                      : "bg-background/40 text-muted-foreground"
                  }`}
                >
                  {local[key] ? (
                    <Plus className="w-4 h-4 shrink-0" />
                  ) : (
                    <Minus className="w-4 h-4 shrink-0" />
                  )}
                  {local[key] ? "Aktiv" : "Inaktiv"}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-cyan-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
            </button>
            {saveError && <span className="text-sm text-red-500">{saveError}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationSettingsSection;
