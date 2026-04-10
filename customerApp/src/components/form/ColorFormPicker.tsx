import { ImFont } from "react-icons/im";
import { ColorPicker } from "../ui/colorPicker";

type ColorFormPickerProps = {
  color: [string, string];
  onChange: (newColor: [string, string]) => void;
};

const ColorFormPicker = ({ color, onChange }: ColorFormPickerProps) => {
  const backgroundColor = color?.[0] ?? "#ffffff";
  const textColor = color?.[1] ?? "#000000";

  return (
    <div className="p-3 bg-background/40 rounded-2xl flex">
      <ColorPicker
        color={backgroundColor}
        onChange={(newColor) => {
          onChange?.([newColor, textColor]);
        }}
      >
        <button
          type="button"
          className="h-20 w-20 cursor-pointer rounded-l-2xl border shadow-sm"
          style={{ backgroundColor }}
          aria-label="Hintergrundfarbe auswählen"
        />
      </ColorPicker>

      <ColorPicker
        color={textColor}
        onChange={(newColor) => {
          onChange?.([backgroundColor, newColor]);
        }}
      >
        <button
          type="button"
          className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-r-2xl border bg-white shadow-sm"
          aria-label="Textfarbe auswählen"
        >
          <ImFont
            className="text-4xl"
            style={{
              color: textColor,
              stroke: "#000",
              strokeWidth: "1px",
            }}
          />
        </button>
      </ColorPicker>
    </div>
  );
};

export default ColorFormPicker;
