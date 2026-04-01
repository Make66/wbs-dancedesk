import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

type ColorPickerProps = {
  color: string;
  onChange: (color: string) => void;
  children?: React.ReactNode;
};

const PRESET_COLORS = [
  ["#fca5a5", "#f87171", "#ef4444", "#dc2626", "#b91c1c"],
  ["#fcd34d", "#fbbf24", "#f59e0b", "#d97706", "#b45309"],
  ["#bef264", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f"],
  ["#67e8f9", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490"],
  ["#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca"],
  ["#d8b4fe", "#c084fc", "#a855f7", "#9333ea", "#7e22ce"],
  ["#f9a8d4", "#f472b6", "#ec4899", "#db2777", "#be185d"],
  ["#d4d4d8", "#a1a1aa", "#71717a", "#52525b", "#3f3f46"],
  ["#FFFFFF", "#000000"],
];

export function ColorPicker({ color, onChange, children }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="w-56 p-4 space-y-4">
        <div className="text-sm font-medium">Farbe wählen</div>

        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) =>
            preset.map((pre) => {
              const isActive = color === pre;
              return (
                <button
                  key={pre}
                  onClick={() => onChange(pre)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
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
