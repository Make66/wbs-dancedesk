import type { PaymentType } from "../../types/course-types";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { PAYMENT } from "../../lib/constants/icon-constants";

type PaymentPickerProps = {
  selected?: PaymentType[];
  onChange?: (types: PaymentType[]) => void;
};

const PaymentPicker = ({ selected = [], onChange }: PaymentPickerProps) => {
  const toggleMethod = (method: PaymentType) => {
    const newMethods = selected.includes(method)
      ? selected.filter((m) => m !== method)
      : [...selected, method];
    onChange?.(newMethods);
  };

  return (
    <div className="w-fit rounded-xl relative">
      <div className="flex items-center justify-between w-fit">
        {PAYMENT.map((method, index) => (
          <div key={method.id} className="relative">
            <button
              type="button"
              onClick={() => toggleMethod(method.id as PaymentType)}
              className={cn(
                index === 0 && "rounded-l-2xl",
                index === PAYMENT.length - 1 && "rounded-r-2xl",
                `w-30 h-22 border flex items-center justify-center cursor-pointer transition-all hover:bg-blue-400 ${
                  selected.includes(method.id as PaymentType)
                    ? "bg-muted-foreground text-background"
                    : "border-muted-foreground"
                }`,
              )}
            >
              <div className="mt-2 flex flex-col gap-1 items-center justify-center">
                <span>{method.icon}</span>
                <span className="text-[13px]">{method.name}</span>
              </div>
            </button>
            {selected.includes(method.id as PaymentType) && (
              <Check className="h-4 w-4 absolute top-2 right-5 text-background" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPicker;
