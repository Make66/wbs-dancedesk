import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { COLOR_PALETTE } from "../../lib/constants/colors";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  children?: React.ReactNode;
};

export function ColorPicker({ color, onChange, children }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-120 p-4 space-y-4">
        <div className="text-sm font-medium">Farbe wählen</div>

        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((preset) =>
            preset.map((pre) => {
              const isActive = color === pre;
              return (
                <button
                  key={pre}
                  onClick={() => onChange(pre)}
                  className={`w-8 h-8 rounded-full border-2 transition cursor-pointer ${
                    isActive ? "border-black scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: pre }}
                />
              );
            }),
          )}
        </div>
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
