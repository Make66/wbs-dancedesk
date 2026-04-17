import { useState } from "react";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";
import { Flag, Pencil, Trash2, Plus, Check, Save, X, RefreshCw, CalendarIcon } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { DatePicker } from "../ui/DatePicker";
import { settingsStore } from "../../stores/settingsStore";
import type { Holiday } from "../../stores/settingsStore";

const dateToString = (d: Date): string => format(d, "yyyy-MM-dd");
const stringToDate = (s: string): Date | undefined => {
  if (!s) return undefined;
  try {
    return parseISO(s);
  } catch {
    return undefined;
  }
};
const formatDisplay = (s: string): string => {
  const d = stringToDate(s);
  return d ? format(d, "dd. MMM yyyy", { locale: de }) : "Datum wählen";
};

type EditForm = { title: string; date: string };

const emptyForm = (): EditForm => ({ title: "", date: "" });

const toEditForm = (h: Holiday): EditForm => ({
  title: h.title,
  date: h.start.dateTime,
});

const fromEditForm = (f: EditForm): Holiday => ({
  title: f.title,
  start: { dateTime: f.date },
  end: { dateTime: f.date },
});

const HolidaySettingsSection = () => {
  const holidays = settingsStore((s) => s.settings.holidays);
  const federalState = settingsStore((s) => s.settings.basic.federalState ?? "HE");
  const setSettings = settingsStore((s) => s.setSettings);

  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(emptyForm());
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<EditForm>(emptyForm());
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const items: Holiday[] = (holidays?.federal as Holiday[] | undefined) ?? [];

  const updateItems = (nextItems: Holiday[]) => {
    setSettings({ holidays: { ...holidays, federal: nextItems } });
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings/holidays/federal/${federalState}`,
      );
      if (!response.ok) throw new Error(`Fehler beim Laden (${response.status}).`);
      const data: Holiday[] = await response.json();
      updateItems(data);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm(toEditForm(items[index]!));
    setIsAdding(false);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    updateItems(items.map((item, i) => (i === editingIndex ? fromEditForm(editForm) : item)));
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    updateItems(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAdd = () => {
    if (!addForm.title || !addForm.date) return;
    updateItems([...items, fromEditForm(addForm)]);
    setAddForm(emptyForm());
    setIsAdding(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holidays: { ...holidays, federal: items } }),
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
    <div className="p-4 bg-teal-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between ml-2 cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          <Flag className="w-6 h-6" />
          <h3 className="font-semibold text-2xl">Feiertage</h3>
        </div>
        <div className="flex items-center gap-6">
          {isOpen && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate();
              }}
              disabled={isGenerating}
              className="h-10 flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-tooltip-id="tooltip"
              data-tooltip-content={`Feiertage automatisch laden`}
              data-tooltip-place="bottom"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
            </button>
          )}
          {isOpen ? (
            <RiArrowUpSLine className="text-2xl mr-2" />
          ) : (
            <RiArrowDownSLine className="text-2xl mr-2" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-2">
          {generateError && <p className="text-sm text-red-500 pl-2">{generateError}</p>}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground pl-2">
              Keine Einträge vorhanden. Klicke auf „Generieren" um die Feiertage zu laden.
            </p>
          )}

          {items.map((item, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Bezeichnung"
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground pl-1">Datum</span>
                    <DatePicker
                      value={stringToDate(editForm.date)}
                      onChange={(d) => d && setEditForm((f) => ({ ...f, date: dateToString(d) }))}
                    >
                      <button
                        type="button"
                        className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg text-left flex items-center gap-3 cursor-pointer hover:bg-teal-500 transition-colors"
                      >
                        <CalendarIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                        {formatDisplay(editForm.date)}
                      </button>
                    </DatePicker>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEditSave}
                      className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-teal-500 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>Übernehmen</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingIndex(null)}
                      className="h-10 w-10 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-background/60 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-16 rounded-2xl border border-muted-foreground bg-background/40 flex items-center px-5 gap-4">
                  <span className="flex-1 text-lg font-medium truncate">{item.title}</span>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {formatDisplay(item.start.dateTime)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="h-9 w-9 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-teal-500 transition-colors shrink-0"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="h-9 w-9 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {isAdding ? (
            <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder="Bezeichnung"
                value={addForm.title}
                onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none"
              />
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground pl-1">Datum</span>
                <DatePicker
                  value={stringToDate(addForm.date)}
                  onChange={(d) => d && setAddForm((f) => ({ ...f, date: dateToString(d) }))}
                >
                  <button
                    type="button"
                    className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg text-left flex items-center gap-3 cursor-pointer hover:bg-teal-500 transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                    {formatDisplay(addForm.date)}
                  </button>
                </DatePicker>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!addForm.title || !addForm.date}
                  className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-teal-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Hinzufügen</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setAddForm(emptyForm());
                  }}
                  className="h-10 w-10 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-background/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsAdding(true);
                setEditingIndex(null);
              }}
              className="h-12 px-6 rounded-2xl border border-dashed border-muted-foreground bg-background/20 flex items-center gap-3 text-muted-foreground cursor-pointer hover:bg-teal-500 hover:text-foreground hover:border-solid transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Eintrag hinzufügen</span>
            </button>
          )}

          {/* Speichern */}
          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || items.length === 0}
              className="h-12 px-6 rounded-2xl bg-background/40 border border-muted-foreground flex items-center gap-3 text-lg cursor-pointer hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {isSaving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
            </button>
            {saveError && <span className="text-sm text-red-700">{saveError}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default HolidaySettingsSection;
