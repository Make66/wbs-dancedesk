import { useState, useEffect } from "react";
import { Percent, Save, Check, Plus, Trash2, Pencil, X } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { settingsStore } from "../../stores/settingsStore";

type RebateItem = {
  title: string;
  category: string;
  tn1Percent: string;
  tn1Value: string;
  tn2Percent: string;
  tn2Value: string;
};

const emptyForm = (): RebateItem => ({
  title: "",
  category: "",
  tn1Percent: "",
  tn1Value: "",
  tn2Percent: "",
  tn2Value: "",
});

type StoreRebate = NonNullable<ReturnType<typeof settingsStore.getState>["settings"]["rebates"]>[number];

const toLocal = (r: StoreRebate): RebateItem => ({
  title: r.title,
  category: r.category ?? "",
  tn1Percent: r.tn1Percent != null ? String(r.tn1Percent) : "",
  tn1Value: r.tn1Value != null ? String(r.tn1Value) : "",
  tn2Percent: r.tn2Percent != null ? String(r.tn2Percent) : "",
  tn2Value: r.tn2Value != null ? String(r.tn2Value) : "",
});

const fromLocal = (item: RebateItem): Record<string, unknown> => {
  const entry: Record<string, unknown> = { title: item.title.trim() };
  if (item.category) entry.category = item.category;
  if (item.tn1Percent !== "") entry.tn1Percent = Number(item.tn1Percent);
  if (item.tn1Value !== "") entry.tn1Value = Number(item.tn1Value);
  if (item.tn2Percent !== "") entry.tn2Percent = Number(item.tn2Percent);
  if (item.tn2Value !== "") entry.tn2Value = Number(item.tn2Value);
  return entry;
};

const RebateForm = ({
  form,
  onChange,
}: {
  form: RebateItem;
  onChange: (f: RebateItem) => void;
}) => {
  const inputClass =
    "h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-lg focus:outline-none focus:ring-0";

  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Bezeichnung *"
        value={form.title}
        onChange={(e) => onChange({ ...form, title: e.target.value })}
        className={inputClass}
      />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground pl-1">Kategorie</span>
          <input
            type="text"
            placeholder="z. B. Kurs"
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            className={inputClass}
          />
        </div>
        {(
          [
            { key: "tn1Percent", label: "TN1 %" },
            { key: "tn1Value", label: "TN1 Wert" },
            { key: "tn2Percent", label: "TN2 %" },
            { key: "tn2Value", label: "TN2 Wert" },
          ] as { key: keyof RebateItem; label: string }[]
        ).map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground pl-1">{label}</span>
            <input
              type="number"
              min={0}
              max={100}
              placeholder="0–100"
              value={form[key]}
              onChange={(e) => onChange({ ...form, [key]: e.target.value })}
              className={inputClass}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const RebateSettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<RebateItem>(emptyForm());
  const [isAdding, setIsAdding] = useState(false);
  const [addForm, setAddForm] = useState<RebateItem>(emptyForm());
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const rebates = settingsStore((s) => s.settings.rebates);
  const setSettings = settingsStore((s) => s.setSettings);

  const [items, setItems] = useState<RebateItem[]>([]);

  useEffect(() => {
    setItems(rebates ? rebates.map(toLocal) : []);
  }, [rebates]);

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...items[index]! });
    setIsAdding(false);
  };

  const handleEditSave = () => {
    if (editingIndex === null) return;
    setItems((prev) => prev.map((item, i) => (i === editingIndex ? editForm : item)));
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleAdd = () => {
    if (!addForm.title.trim()) return;
    setItems((prev) => [...prev, addForm]);
    setAddForm(emptyForm());
    setIsAdding(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const payload = items.map(fromLocal);
      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rebates: payload }),
      });
      if (!response.ok) throw new Error(`Fehler beim Speichern (${response.status}).`);
      setSettings({
        rebates: payload as NonNullable<ReturnType<typeof settingsStore.getState>["settings"]["rebates"]>,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSaving(false);
    }
  };

  const infoText = (item: RebateItem) => {
    const parts: string[] = [];
    if (item.category) parts.push(item.category);
    if (item.tn1Percent) parts.push(`TN1: ${item.tn1Percent}%`);
    if (item.tn2Percent) parts.push(`TN2: ${item.tn2Percent}%`);
    return parts.join(" · ");
  };

  return (
    <div className="p-4 bg-purple-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between ml-2 cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          <Percent className="w-6 h-6" />
          <h3 className="font-semibold text-2xl">Rabatte</h3>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="text-2xl mr-2" />
        ) : (
          <RiArrowDownSLine className="text-2xl mr-2" />
        )}
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-2">
          {items.length === 0 && !isAdding && (
            <p className="text-sm text-muted-foreground pl-2">
              Keine Einträge vorhanden. Klicke auf „Eintrag hinzufügen" um einen Rabatt zu erstellen.
            </p>
          )}

          {items.map((item, index) => (
            <div key={index}>
              {editingIndex === index ? (
                <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
                  <RebateForm form={editForm} onChange={setEditForm} />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEditSave}
                      disabled={!editForm.title.trim()}
                      className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                  <span className="text-sm text-muted-foreground shrink-0 hidden sm:block">
                    {infoText(item)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="h-9 w-9 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-purple-500 transition-colors shrink-0"
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

          {isAdding ? (
            <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
              <RebateForm form={addForm} onChange={setAddForm} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!addForm.title.trim()}
                  className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-purple-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  <span>Hinzufügen</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setIsAdding(false); setAddForm(emptyForm()); }}
                  className="h-10 w-10 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-background/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => { setIsAdding(true); setEditingIndex(null); }}
              className="h-12 px-6 rounded-2xl border border-dashed border-muted-foreground bg-background/20 flex items-center gap-3 text-muted-foreground cursor-pointer hover:bg-purple-500 hover:text-foreground hover:border-solid transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Eintrag hinzufügen</span>
            </button>
          )}

          <div className="flex items-center gap-3 mt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-12 px-6 rounded-2xl bg-background/40 border border-muted-foreground flex items-center gap-3 text-lg cursor-pointer hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {isSaving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
            </button>
            {saveError && <span className="text-sm text-red-500">{saveError}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default RebateSettingsSection;
