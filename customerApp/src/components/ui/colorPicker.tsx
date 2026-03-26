import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";

type ColorPickerProps = {
  initialColor?: string;
  onChange?: (color: string) => void;
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
];

export function ColorPicker({ initialColor, onChange }: ColorPickerProps) {
  const [color, setColor] = useState(initialColor || "#ef4444");

  const handleChange = (newColor: string) => {
    setColor(newColor);
    onChange?.(newColor);
  };

  return (
    <Popover>
      {/* Trigger (dein Kreis) */}
      <PopoverTrigger asChild>
        <button
          className="w-10 h-10 rounded-full border shadow cursor-pointer"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>

      {/* Inhalt */}
      <PopoverContent className="w-56 p-4 space-y-4">
        <div className="text-sm font-medium">Farbe wählen</div>

        {/* Presets */}
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((preset) =>
            preset.map((pre) => {
              const isActive = color.toLowerCase() === pre.toLowerCase();
              return (
                <button
                  key={pre}
                  onClick={() => handleChange(pre)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    isActive ? "border-black scale-110" : "border-transparent"
                  }`}
                  style={{ backgroundColor: pre }}
                />
              );
            }),
          )}
        </div>

        {/* HEX Input */}
        <input
          type="text"
          value={color}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </PopoverContent>
    </Popover>
  );
}
