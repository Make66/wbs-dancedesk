import { MdOutlineSettingsInputComponent } from "react-icons/md";
import { ImFont } from "react-icons/im";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { HiOutlineReceiptTax, HiReceiptTax } from "react-icons/hi";
import { ColorPicker } from "../ui/colorPicker";
import { useFormContext } from "react-hook-form";
import type { CourseFormValues } from "./schemas/course-schema";
import { Check } from "lucide-react";
import ShiftComponent from "./ShiftComponent";

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
      <div className="col-span-1 p-3">
        <div className="flex items-center gap-6">
          {watch("isBookedOut") ? (
            <button
              type="button"
              className="relative h-22 w-22 bg-muted-foreground text-background hover:bg-blue-400 border border-muted-foreground rounded-xl cursor-pointer flex justify-center items-center"
              onClick={() => setValue("isBookedOut", false, { shouldDirty: true })}
              data-tooltip-id="tooltip"
              data-tooltip-content="Kurs öffnen (Anmeldungen möglich)"
              data-tooltip-place="bottom"
            >
              <div className="flex flex-col items-center justify-center mt-2">
                <FaLock className="text-3xl" />
                <span className="text-sm font-medium">closed</span>
              </div>
              <Check className="h-4 w-4 absolute top-2 right-2" />
            </button>
          ) : (
            <button
              type="button"
              className="h-22 w-22 bg-background hover:bg-blue-400 border border-muted-foreground rounded-xl cursor-pointer flex justify-center items-center"
              onClick={() => setValue("isBookedOut", true, { shouldDirty: true })}
              data-tooltip-id="tooltip"
              data-tooltip-content="Kurs schließen (keine Anmeldungen mehr möglich)"
              data-tooltip-place="bottom"
            >
              <div className="flex flex-col items-center justify-center mt-2">
                <FaLockOpen className="text-3xl" />
                <span className="text-sm font-medium">open</span>
              </div>
            </button>
          )}
          {watch("isTaxFree") ? (
            <button
              type="button"
              className="h-22 w-22 bg-background hover:bg-blue-400 border border-muted-foreground rounded-xl cursor-pointer flex justify-center items-center"
              onClick={() => setValue("isTaxFree", false, { shouldDirty: true })}
              data-tooltip-id="tooltip"
              data-tooltip-content="Umsatzsteuerfrei (Preisangabe ohne MwSt.)"
              data-tooltip-place="bottom"
            >
              <div className="flex flex-col items-center justify-center mt-2">
                <HiOutlineReceiptTax className="text-3xl" />
                <span className="text-sm font-medium">tax-free</span>
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="relative h-22 w-22 bg-muted-foreground text-background hover:bg-blue-400 border border-muted-foreground rounded-xl cursor-pointer flex justify-center items-center"
              onClick={() => setValue("isTaxFree", true, { shouldDirty: true })}
              data-tooltip-id="tooltip"
              data-tooltip-content="Umsatzsteuerpflichtig (Preisangabe mit MwSt.)"
              data-tooltip-place="bottom"
            >
              <div className="flex flex-col items-center justify-center mt-2">
                <HiReceiptTax className="text-3xl" />
                <span className="text-sm font-medium">tax</span>
              </div>
              <Check className="h-4 w-4 absolute top-2 right-2" />
            </button>
          )}
        </div>
        <div className="col-span-1 gap-3 p-3 md:col-span-2 flex items-center">
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
      <div>
        <div>
          <ShiftComponent />
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
