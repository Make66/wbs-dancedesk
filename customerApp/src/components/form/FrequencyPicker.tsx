import { AudioWaveform } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import type { CourseFrequency } from "../../types/course-types";
import { cn } from "../../lib/utils";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";
import { useState } from "react";

const frequencyOptions: { id: CourseFrequency; name: string }[] = [
  { id: "daily", name: "täglich" },
  { id: "weekly", name: "wöchentlich" },
  { id: "biweekly", name: "14-tägig" },
  { id: "monthly", name: "monatlich" },
] as const;

const FrequencyPicker = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { watch, setValue } = useFormContext<CourseFormValues>();
  return (
    <div className="h-22 w-full bg-background rounded-2xl border border-muted-foreground flex items-center hover:bg-blue-500 transition-colors">
      <Popover open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger asChild>
          <button className="w-full h-full flex items-center cursor-pointer">
            <div className="flex">
              <AudioWaveform className="text-2xl ml-6" />
              <span className="ml-4 text-lg">
                {frequencyOptions.find((o) => o.id === watch("frequency"))?.name}
              </span>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] overflow-y-scroll scrollbar">
          <div className="grid gap-1 p-2">
            {frequencyOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setValue("frequency", option.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "rounded-md px-3 py-2 text-lg hover:bg-blue-400 text-left cursor-pointer",
                  watch("frequency") === option.id && "bg-foreground text-background font-medium",
                )}
              >
                {option.name}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FrequencyPicker;
