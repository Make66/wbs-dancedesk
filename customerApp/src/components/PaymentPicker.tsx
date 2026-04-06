import { FaCoins } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { FaPaypal } from "react-icons/fa";
import type { PaymentType } from "../types/course-types";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

type PaymentPickerProps = {
  selected?: PaymentType[];
  onChange?: (types: PaymentType[]) => void;
};

const PaymentPicker = ({ selected = [], onChange }: PaymentPickerProps) => {
  const paymentMethods = [
    { id: "cash", name: "Bar", icon: <FaCoins className="text-2xl" /> },
    { id: "invoice", name: "Rechnung", icon: <AiFillBank className="text-2xl" /> },
    { id: "paypal", name: "PayPal", icon: <FaPaypal className="text-2xl" /> },
  ] as const;

  const toggleMethod = (method: PaymentType) => {
    const newMethods = selected.includes(method)
      ? selected.filter((m) => m !== method)
      : [...selected, method];
    onChange?.(newMethods);
  };

  return (
    <div className="w-fit rounded-xl relative">
      <div className="flex items-center justify-between w-fit">
        {paymentMethods.map((method, index) => (
          <div key={method.id} className="relative">
            <button
              type="button"
              onClick={() => toggleMethod(method.id as PaymentType)}
              className={cn(
                index === 0 && "rounded-l-2xl",
                index === paymentMethods.length - 1 && "rounded-r-2xl",
                `w-30 h-20 border flex items-center justify-center cursor-pointer transition-all hover:bg-blue-400 ${
                  selected.includes(method.id as PaymentType)
                    ? "bg-muted-foreground text-background"
                    : "border-muted-foreground"
                }`,
              )}
              data-tooltip-id="tooltip"
              data-tooltip-content={method.name}
              data-tooltip-place="top"
            >
              <span>{method.icon}</span>
            </button>
            {selected.includes(method.id as PaymentType) && (
              <Check className="h-4 w-4 absolute top-2 right-7 text-background" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPicker;
