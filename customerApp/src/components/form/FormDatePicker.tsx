import { FaPlay, FaStop } from "react-icons/fa6";
import { DatePicker } from "../ui/DatePicker";
import { cn } from "../../lib/utils";

type FormDatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  type: "start" | "end";
  className?: string;
};

const FormDatePicker = ({ value, onChange, type, className }: FormDatePickerProps) => {
  return (
    <DatePicker value={value} onChange={onChange}>
      <button type="button" className={cn("flex justify-start items-center", className)}>
        <div>
          {type === "start" && <FaPlay className="inline mr-6 text-2xl" />}
          {type === "end" && <FaStop className="inline mr-6 text-2xl" />}
          <span className={cn(value ? "text-foreground" : "text-muted-foreground")}>
            {value
              ? value.toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })
              : type === "start"
                ? "Startdatum wählen"
                : "Enddatum wählen"}
          </span>
        </div>
      </button>
    </DatePicker>
  );
};

export default FormDatePicker;
