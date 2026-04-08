import { MdOutlineSettingsInputComponent } from "react-icons/md";
import { ImFont } from "react-icons/im";
import { ColorPicker } from "../ui/colorPicker";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "../../types/form";

const SettingsSection = () => {
  const { watch, setValue } = useFormContext<CourseFormValues>();
  const color = watch("color");

  const backgroundColor = color?.[0] ?? "#ffffff";
  const textColor = color?.[1] ?? "#000000";

  return (
    <div className="grid grid-cols-1 gap-3 rounded-2xl bg-green-400/40 p-2 md:grid-cols-2 shadow-xl">
      <div className="col-span-1 flex items-center justify-between pt-2 pl-3 md:col-span-2">
        <div className="flex items-center">
          <MdOutlineSettingsInputComponent className="mr-4 inline text-2xl" />
          <span className="text-2xl font-semibold">Einstellungen</span>
        </div>
      </div>

      <div className="col-span-1 mt-3 gap-3 p-3 md:col-span-2 flex items-center">
        <ColorPicker
          color={backgroundColor}
          onChange={(newColor) => {
            setValue("color", [newColor, textColor]);
          }}
        >
          <button
            type="button"
            className="h-20 w-20 cursor-pointer rounded-md border shadow-sm"
            style={{ backgroundColor }}
            aria-label="Hintergrundfarbe auswählen"
          />
        </ColorPicker>

        <ColorPicker
          color={textColor}
          onChange={(newColor) => {
            setValue("color", [backgroundColor, newColor]);
          }}
        >
          <button
            type="button"
            className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-md border bg-white shadow-sm"
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
    </div>
  );
};

export default SettingsSection;
