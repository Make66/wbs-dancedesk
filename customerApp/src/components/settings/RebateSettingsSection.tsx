import { useState, useEffect } from "react";
import { Percent, Save, Check, Plus, Trash2 } from "lucide-react";
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

const emptyRebate = (): RebateItem => ({
  title: "",
  category: "",
  tn1Percent: "",
  tn1Value: "",
  tn2Percent: "",
  tn2Value: "",
});

const toLocal = (rebates: NonNullable<ReturnType<typeof settingsStore.getState>["settings"]["rebates"]>): RebateItem[] =>
  rebates.map((r) => ({
    title: r.title,
    category: r.category ?? "",
    tn1Percent: r.tn1Percent != null ? String(r.tn1Percent) : "",
    tn1Value: r.tn1Value != null ? String(r.tn1Value) : "",
    tn2Percent: r.tn2Percent != null ? String(r.tn2Percent) : "",
    tn2Value: r.tn2Value != null ? String(r.tn2Value) : "",
  }));

const RebateSettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const rebates = settingsStore((s) => s.settings.rebates);
  const setSettings = settingsStore((s) => s.setSettings);

  const [items, setItems] = useState<RebateItem[]>([]);

  useEffect(() => {
    setItems(rebates ? toLocal(rebates) : []);
  }, [rebates]);

  const updateItem = (index: number, field: keyof RebateItem, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const hasInvalidTitle = items.some((item) => !item.title.trim());
    if (hasInvalidTitle) {
      setSaveError("Alle Rabatte müssen eine Bezeichnung haben.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const payload = items.map((item) => {
        const entry: Record<string, unknown> = { title: item.title.trim() };
        if (item.category) entry.category = item.category;
        if (item.tn1Percent !== "") entry.tn1Percent = Number(item.tn1Percent);
        if (item.tn1Value !== "") entry.tn1Value = Number(item.tn1Value);
        if (item.tn2Percent !== "") entry.tn2Percent = Number(item.tn2Percent);
        if (item.tn2Value !== "") entry.tn2Value = Number(item.tn2Value);
        return entry;
      });

      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rebates: payload }),
      });
      if (!response.ok) throw new Error(`Fehler beim Speichern (${response.status}).`);
      setSettings({ rebates: payload as NonNullable<ReturnType<typeof settingsStore.getState>["settings"]["rebates"]> });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm focus:outline-none focus:ring-0";

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
        <div className="mt-4 flex flex-col gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-muted-foreground pl-1">Bezeichnung *</label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => updateItem(index, "title", e.target.value)}
                    placeholder="z. B. Geschwisterrabatt"
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="mt-5 h-10 w-10 flex items-center justify-center rounded-xl border border-muted-foreground bg-background/40 hover:bg-red-500 transition-colors cursor-pointer shrink-0"
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Rabatt entfernen"
                  data-tooltip-place="bottom"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground pl-1">Kategorie</label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(e) => updateItem(index, "category", e.target.value)}
                    placeholder="z. B. Kurs"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground pl-1">TN1 %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.tn1Percent}
                    onChange={(e) => updateItem(index, "tn1Percent", e.target.value)}
                    placeholder="0–100"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground pl-1">TN1 Wert</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.tn1Value}
                    onChange={(e) => updateItem(index, "tn1Value", e.target.value)}
                    placeholder="0–100"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground pl-1">TN2 %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.tn2Percent}
                    onChange={(e) => updateItem(index, "tn2Percent", e.target.value)}
                    placeholder="0–100"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground pl-1">TN2 Wert</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={item.tn2Value}
                    onChange={(e) => updateItem(index, "tn2Value", e.target.value)}
                    placeholder="0–100"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setItems((prev) => [...prev, emptyRebate()])}
            className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-purple-500 transition-colors text-sm w-fit"
          >
            <Plus className="w-4 h-4" />
            Rabatt hinzufügen
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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

export default RebateSettingsSection;
