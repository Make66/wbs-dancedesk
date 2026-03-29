import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

type IconPickerProps = {
  icon: string;
  onChange: (icon: string) => void;
  children?: React.ReactNode;
};

const ICONS = ["bongo", "drum", "rattle", "saxophone", "tambourine", "trumpet"];

export function IconPicker({ icon, onChange, children }: IconPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-100 space-y-4 p-4">
        <div className="text-sm font-medium">Icon wählen</div>

        <div className="flex flex-wrap gap-2">
          {ICONS.map((item) => {
            const isActive = icon?.toLowerCase() === item.toLowerCase();

            return (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className={`h-10 w-10 rounded-full ${
                  isActive ? "scale-110" : "border-transparent"
                }`}
              >
                <img src={`/icons/${item}.svg`} alt={item} className="cursor-pointer" />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
