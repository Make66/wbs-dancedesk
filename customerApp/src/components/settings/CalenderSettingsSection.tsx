import { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { Sunrise, Sunset, Timer, Ruler, Check, Save } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { settingsStore } from "../../stores/settingsStore";
import { cn } from "../../lib/utils";

const MINUTES_PER_SLOT_OPTIONS = [5, 10, 15, 20, 30, 60];
const SLOT_HEIGHT_OPTIONS = [10, 15, 20, 25, 30];

const CalenderSettingsSection = () => {
  const calendar = settingsStore((s) => s.settings.calendar);
  const setSettings = settingsStore((s) => s.setSettings);

  const [minutesOpen, setMinutesOpen] = useState(false);
  const [slotHeightOpen, setSlotHeightOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleHourChange = (field: "startHour" | "endHour", raw: string) => {
    const value = Math.min(24, Math.max(0, Number(raw) || 0));
    setSettings({ calendar: { ...calendar, [field]: value } });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ calendar }),
      });
      if (!response.ok) throw new Error("Fehler beim Speichern der Einstellungen.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-blue-400/60 rounded-2xl">
      <div className="flex items-center gap-4 ml-2">
        <FaCalendarAlt className="text-2xl" />
        <h3 className="font-semibold text-2xl">Kalender</h3>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="relative">
          <Sunrise className="absolute top-1/2 -translate-y-1/2 left-6 text-xl w-5 h-5" />
          <input
            type="text"
            value={calendar.startHour}
            onChange={(e) => handleHourChange("startHour", e.target.value)}
            className="h-16 w-full rounded-2xl border border-muted-foreground bg-background/40 pl-16 pr-4 text-lg focus:outline-none focus:ring-0"
            data-tooltip-id="tooltip"
            data-tooltip-content="Startzeit des Kalenders (Stunde)"
            data-tooltip-place="bottom"
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-24 text-lg text-muted-foreground">
            Uhr
          </span>
        </div>
        <div className="relative">
          <Sunset className="absolute top-1/2 -translate-y-1/2 left-6 text-xl w-5 h-5" />
          <input
            type="text"
            value={calendar.endHour}
            onChange={(e) => handleHourChange("endHour", e.target.value)}
            className="h-16 w-full rounded-2xl border border-muted-foreground bg-background/40 pl-16 pr-4 text-lg focus:outline-none focus:ring-0"
            data-tooltip-id="tooltip"
            data-tooltip-content="Endzeit des Kalenders (Stunde)"
            data-tooltip-place="bottom"
          />
          <span className="absolute top-1/2 -translate-y-1/2 left-24 text-lg text-muted-foreground">
            Uhr
          </span>
        </div>

        {/* minutesPerSlot */}
        <Popover open={minutesOpen} onOpenChange={setMinutesOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-16 w-full rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-6 gap-4 hover:bg-blue-500 transition-colors cursor-pointer"
              data-tooltip-id="tooltip"
              data-tooltip-content="Minuten pro Zeitslot"
              data-tooltip-place="bottom"
            >
              <Timer className="w-5 h-5 shrink-0" />
              <span className="text-lg">{calendar.minutesPerSlot} min / Slot</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width)">
            <div className="grid gap-1 p-1">
              {MINUTES_PER_SLOT_OPTIONS.map((min) => (
                <button
                  key={min}
                  type="button"
                  onClick={() => {
                    setSettings({ calendar: { ...calendar, minutesPerSlot: min } });
                    setMinutesOpen(false);
                  }}
                  className={cn(
                    "rounded-md px-3 py-2 text-lg text-left cursor-pointer hover:bg-blue-400",
                    calendar.minutesPerSlot === min && "bg-foreground text-background font-medium",
                  )}
                >
                  {min} min
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* slotHeight */}
        <Popover open={slotHeightOpen} onOpenChange={setSlotHeightOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-16 w-full rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-6 gap-4 hover:bg-blue-500 transition-colors cursor-pointer"
              data-tooltip-id="tooltip"
              data-tooltip-content="Höhe eines Zeitslots in Pixeln"
              data-tooltip-place="bottom"
            >
              <Ruler className="w-5 h-5 shrink-0" />
              <span className="text-lg">{calendar.slotHeight} px / Slot</span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width)">
            <div className="grid gap-1 p-1">
              {SLOT_HEIGHT_OPTIONS.map((px) => (
                <button
                  key={px}
                  type="button"
                  onClick={() => {
                    setSettings({ calendar: { ...calendar, slotHeight: px } });
                    setSlotHeightOpen(false);
                  }}
                  className={cn(
                    "rounded-md px-3 py-2 text-lg text-left cursor-pointer hover:bg-blue-400",
                    calendar.slotHeight === px && "bg-foreground text-background font-medium",
                  )}
                >
                  {px} px
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Save button */}
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-6 rounded-2xl bg-background/40 border border-muted-foreground flex items-center gap-3 text-lg cursor-pointer hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {isSaving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
          </button>
          {saveError && <span className="text-sm text-red-500">{saveError}</span>}
        </div>
      </div>
    </div>
  );
};

export default CalenderSettingsSection;
