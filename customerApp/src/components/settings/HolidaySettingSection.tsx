import { useState } from "react";
import { LuTreePalm } from "react-icons/lu";
import { Pencil, Trash2, Plus, Check, Save, X, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { settingsStore } from "../../stores/settingsStore";
import { cn } from "../../lib/utils";

const STATE_LABELS: Record<string, string> = {
  BW: "Baden-Württemberg",
  BY: "Bayern",
  BE: "Berlin",
  BB: "Brandenburg",
  HB: "Bremen",
  HH: "Hamburg",
  HE: "Hessen",
  MV: "Mecklenburg-Vorpommern",
  NI: "Niedersachsen",
  NW: "Nordrhein-Westfalen",
  RP: "Rheinland-Pfalz",
  SL: "Saarland",
  SN: "Sachsen",
  ST: "Sachsen-Anhalt",
  SH: "Schleswig-Holstein",
  TH: "Thüringen",
};

type Holiday = {
  title: string;
  start: { dateTime: string };
  end: { dateTime: string };
};

type EditForm = { title: string; startDate: string; endDate: string };

const emptyForm = (): EditForm => ({ title: "", startDate: "", endDate: "" });

const toEditForm = (h: Holiday): EditForm => ({
  title: h.title,
  startDate: h.start.dateTime,
  endDate: h.end.dateTime,
});

const fromEditForm = (f: EditForm): Holiday => ({
  title: f.title,
  start: { dateTime: f.startDate },
  end: { dateTime: f.endDate },
});

const HolidaySettingSection = () => {
  const holidays = settingsStore((s) => s.settings.holidays);
  const federalState = settingsStore((s) => s.settings.basic.federalState);
  const setSettings = settingsStore((s) => s.setSettings);

  const availableStates = Object.keys(holidays?.school ?? {});
  const defaultState = federalState && availableStates.includes(federalState)
    ? federalState
    : (availableStates[0] ?? "HE");

  const [selectedState, setSelectedState] = useState(defaultState);
  const [statePickerOpen, setStatePickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm());
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const schoolHolidays = holidays?.school ?? {};
  const items: Holiday[] = schoolHolidays[selectedState] ?? [];

  const updateHolidays = (nextItems: Holiday[]) => {
    setSettings({
      holidays: {
        ...holidays,
        school: { ...schoolHolidays, [selectedState]: nextItems },
      },
    });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(toEditForm(items[index]!));
    setIsAdding(false);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    const next = items.map((item, i) =>
      i === editingIndex ? fromEditForm(editForm) : item,
    );
    updateHolidays(next);
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    updateHolidays(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAdd = () => {
    if (!addForm.title || !addForm.startDate || !addForm.endDate) return;
    updateHolidays([...items, fromEditForm(addForm)]);
    setAddForm(emptyForm());
    setIsAdding(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidays: { ...holidays, school: schoolHolidays } }),
      });
      if (!response.ok) throw new Error("Fehler beim Speichern.");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 bg-pink-400/60 rounded-2xl">
      <div className="flex items-center gap-4 ml-2">
        <LuTreePalm className="text-2xl" />
        <h3 className="font-semibold text-2xl">Schulferien und Feiertage</h3>
      </div>

      <div className="mt-4 flex flex-col gap-3">

        {/* Bundesland-Selector */}
        <Popover open={statePickerOpen} onOpenChange={setStatePickerOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-16 w-full md:w-80 rounded-2xl border border-muted-foreground bg-background/40 flex items-center justify-between px-6 gap-4 hover:bg-pink-500 transition-colors cursor-pointer"
            >
              <span className="text-lg font-medium">
                {STATE_LABELS[selectedState] ?? selectedState}
              </span>
              <ChevronDown className="w-4 h-4 shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 max-h-80 overflow-y-auto">
            <div className="grid gap-1 p-1">
              {availableStates.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setSelectedState(code);
                    setEditingIndex(null);
                    setIsAdding(false);
                    setStatePickerOpen(false);
                  }}
                  className={cn(
                    "rounded-md px-3 py-2 text-left cursor-pointer hover:bg-pink-400",
                    selectedState === code && "bg-foreground text-background font-medium",
                  )}
                >
                  <span className="font-mono text-sm mr-2">{code}</span>
                  {STATE_LABELS[code] ?? code}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Liste */}
        <div className="flex flex-col gap-2">
          {items.length === 0 && (
            <p className="text-sm text-muted-foreground pl-2">Keine Einträge vorhanden.</p>
          )}

          {items.map((item, index) => (
            <div key={index}>
              {editingIndex === index ? (
                /* Inline-Bearbeitungsform */
                <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Bezeichnung"
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground pl-1">Von</span>
                      <input
                        type="date"
                        value={editForm.startDate}
                        onChange={(e) => setEditForm((f) => ({ ...f, startDate: e.target.value }))}
                        className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground pl-1">Bis</span>
                      <input
                        type="date"
                        value={editForm.endDate}
                        onChange={(e) => setEditForm((f) => ({ ...f, endDate: e.target.value }))}
                        className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEditSave}
                      className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-pink-500 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Übernehmen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-background/60 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Anzeigezeile */
                <div className="h-16 rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-5 gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="text-lg font-medium truncate block">{item.title}</span>
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {item.start.dateTime} – {item.end.dateTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="h-9 w-9 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-pink-500 transition-colors shrink-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="h-9 w-9 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Hinzufügen */}
        {isAdding ? (
          <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
            <input
              type="text"
              placeholder="Bezeichnung"
              value={addForm.title}
              onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
              className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground pl-1">Von</span>
                <input
                  type="date"
                  value={addForm.startDate}
                  onChange={(e) => setAddForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground pl-1">Bis</span>
                <input
                  type="date"
                  value={addForm.endDate}
                  onChange={(e) => setAddForm((f) => ({ ...f, endDate: e.target.value }))}
                  className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAdd}
                disabled={!addForm.title || !addForm.startDate || !addForm.endDate}
                className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-pink-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Hinzufügen</span>
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setAddForm(emptyForm()); }}
                className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-background/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => { setIsAdding(true); setEditingIndex(null); }}
            className="h-12 px-6 rounded-2xl border border-dashed border-muted-foreground bg-background/20 flex items-center gap-3 text-muted-foreground cursor-pointer hover:bg-pink-500 hover:text-foreground hover:border-solid transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Eintrag hinzufügen</span>
          </button>
        )}

        {/* Speichern */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-12 px-6 rounded-2xl bg-background/40 border border-muted-foreground flex items-center gap-3 text-lg cursor-pointer hover:bg-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default HolidaySettingSection;
