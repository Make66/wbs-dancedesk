import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { appIcons, type AppIconName } from "../icons";

type IconPickerProps = {
  icon: string;
  onChange: (icon: AppIconName) => void;
  children?: React.ReactNode;
};

const ICONS = Object.entries(appIcons) as [AppIconName, React.FC<React.SVGProps<SVGSVGElement>>][];

export function IconPicker({ icon, onChange, children }: IconPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-[260px] space-y-4 p-4">
        <div className="text-sm font-medium">Icon wählen</div>

        <div className="flex flex-wrap gap-2">
          {ICONS.map(([name, Icon]) => {
            const isActive = icon?.toLowerCase() === name.toLowerCase();

            return (
              <button
                key={name}
                type="button"
                onClick={() => onChange(name)}
                className={[
                  "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
                  isActive
                    ? "scale-110 border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-muted",
                ].join(" ")}
                aria-label={`Wähle ${name} Icon`}
              >
                <Icon
                  className={[
                    "h-6 w-6 transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
