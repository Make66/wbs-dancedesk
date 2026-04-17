import { Check, Pencil, Trash2, Plus, X, CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";
import { useState } from "react";
import { DatePicker } from "../ui/DatePicker";
import { format, parseISO } from "date-fns";
import { de } from "date-fns/locale";

type CourseFormValues = {
  dates: {
    date: string;
    isStart: boolean;
  }[];
};

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);

  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDate(s: string): Date | undefined {
  try {
    return parseISO(s.length === 10 ? s : s.substring(0, 10));
  } catch {
    return undefined;
  }
}

function fromDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

const DatesPicker = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();
  const dates = watch("dates") || [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [isAdding, setIsAdding] = useState(false);
  const [addDate, setAddDate] = useState<Date | undefined>(undefined);

  const handleToggleStart = (index: number) => {
    setValue(
      "dates",
      dates.map((item, i) => (i === index ? { ...item, isStart: !item.isStart } : item)),
      { shouldDirty: true },
    );
  };

  const handleDelete = (index: number) => {
    setValue(
      "dates",
      dates.filter((_, i) => i !== index),
      { shouldDirty: true },
    );
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleEditOpen = (index: number) => {
    setEditingIndex(index);
    setEditDate(toDate(dates[index]!.date));
    setIsAdding(false);
  };

  const handleEditSave = () => {
    if (editingIndex === null || !editDate) return;
    setValue(
      "dates",
      dates.map((item, i) =>
        i === editingIndex ? { ...item, date: fromDate(editDate) } : item,
      ),
      { shouldDirty: true },
    );
    setEditingIndex(null);
  };

  const handleAdd = () => {
    if (!addDate) return;
    setValue("dates", [...dates, { date: fromDate(addDate), isStart: false }], {
      shouldDirty: true,
    });
    setAddDate(undefined);
    setIsAdding(false);
  };

  return (
    <div className="mt-1 pt-4 border-t border-muted-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-7 gap-3 mb-4">
        {dates.map((item, index) =>
          editingIndex === index ? (
            <div
              key={`edit-${item.date}-${index}`}
              className="rounded-2xl border border-muted-foreground bg-background/40 px-4 py-3 flex flex-col gap-3"
            >
              <DatePicker value={editDate} onChange={setEditDate}>
                <button
                  type="button"
                  className="h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm text-left flex items-center gap-2 cursor-pointer hover:bg-blue-400 transition-colors"
                >
                  <CalendarIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
                  {editDate ? format(editDate, "dd. MMM yyyy", { locale: de }) : "Datum wählen"}
                </button>
              </DatePicker>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEditSave}
                  disabled={!editDate}
                  className="h-9 px-4 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 text-sm cursor-pointer hover:bg-blue-400 transition-colors disabled:opacity-40"
                >
                  <Check className="w-4 h-4" />
                  <span>OK</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingIndex(null)}
                  className="h-9 w-9 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-background/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              key={`${item.date}-${index}`}
              className={cn(
                "relative flex min-h-22 w-full cursor-pointer items-center justify-between rounded-2xl border border-muted-foreground bg-background/40 px-4 py-4 text-left transition-colors hover:bg-blue-400",
                item.isStart && "bg-muted-foreground/40 text-background",
              )}
              onClick={() => handleToggleStart(index)}
            >
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-md font-medium">{formatDateLabel(item.date)}</span>
                <span className="text-sm opacity-80">
                  {item.isStart ? "Anmeldung möglich" : "Kein neuer Starttermin"}
                </span>
              </div>

              {item.isStart && <Check className="h-5 w-5 shrink-0 mr-2" />}

              <div className="flex gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleEditOpen(index)}
                  className="h-8 w-8 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  className="h-8 w-8 rounded-xl border border-muted-foreground bg-background/40 flex items-center justify-center cursor-pointer hover:bg-red-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ),
        )}
      </div>

      {isAdding ? (
        <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3 mb-3">
          <DatePicker value={addDate} onChange={setAddDate}>
            <button
              type="button"
              className="h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm text-left flex items-center gap-2 cursor-pointer hover:bg-blue-400 transition-colors"
            >
              <CalendarIcon className="w-4 h-4 shrink-0 text-muted-foreground" />
              {addDate ? format(addDate, "dd. MMM yyyy", { locale: de }) : "Datum wählen"}
            </button>
          </DatePicker>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!addDate}
              className="h-10 px-5 rounded-xl border border-muted-foreground bg-background/40 flex items-center gap-2 cursor-pointer hover:bg-blue-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
              <span>Hinzufügen</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setAddDate(undefined);
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
          className="h-12 px-6 rounded-2xl border border-dashed border-muted-foreground bg-background/20 flex items-center gap-3 text-muted-foreground cursor-pointer hover:bg-blue-400 hover:text-foreground hover:border-solid transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Termin hinzufügen</span>
        </button>
      )}
    </div>
  );
};

export default DatesPicker;
