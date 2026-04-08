import { cn } from "../../lib/utils";
import { FaIcons } from "react-icons/fa";
import { ICONS } from "../../lib/constants/iconPicker-constants";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

type IconPickerProps = {
  value?: string;
  onChange: (iconName: string) => void;
};

export function IconPicker({ value, onChange }: IconPickerProps) {
  const selectedIcon = ICONS.find((item) => item.name === value);
  const SelectedIcon = selectedIcon?.icon ?? FaIcons;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-11 w-11 bg-transparent cursor-pointer items-center justify-center rounded-md border shadow-sm"
          aria-label="Textfarbe auswählen"
        >
          <SelectedIcon className="text-xl" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-100 p-4">
        <div className="flex gap-2 overflow-y-auto">
          {ICONS.map((item) => {
            const Icon = item.icon;
            const isSelected = item.name === value;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  onChange(item.name);
                }}
                className={cn(
                  "relative cursor-pointer flex h-6 w-6 items-center justify-center rounded-xl border transition hover:bg-gray-50",
                  isSelected && "border-black bg-gray-100",
                )}
                title={item.name}
              >
                <Icon className="text-lg" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
