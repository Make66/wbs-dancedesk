import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { cn } from "../../lib/utils";

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

const DatesPicker = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();
  const dates = watch("dates") || [];

  const handleToggleStart = (index: number) => {
    const updatedDates = dates.map((item, i) =>
      i === index
        ? {
            ...item,
            isStart: !item.isStart,
          }
        : item,
    );

    setValue("dates", updatedDates, { shouldDirty: true });
  };

  return (
    <div className="mt-1 pt-4 border-t border-muted-foreground">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 4xl:grid-cols-7 gap-3 mb-4">
        {dates.map((item, index) => (
          <button
            key={`${item.date}-${index}`}
            type="button"
            onClick={() => handleToggleStart(index)}
            className={cn(
              "relative flex min-h-22 w-full cursor-pointer items-center justify-between rounded-2xl border border-muted-foreground bg-background/40 px-6 py-4 text-left transition-colors hover:bg-blue-400",
              item.isStart && "bg-muted-foreground/40 text-background",
            )}
          >
            <div className="flex flex-col">
              <span className="text-md font-medium">{formatDateLabel(item.date)}</span>
              <span className="text-sm opacity-80">
                {item.isStart ? "Anmeldung möglich" : "Kein neuer Starttermin"}
              </span>
            </div>

            {item.isStart && <Check className="h-5 w-5 shrink-0" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatesPicker;
