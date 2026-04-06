import { FaCoins } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { FaPaypal } from "react-icons/fa";
import type { PaymentType } from "../types/course-types";
import { Check } from "lucide-react";

type PaymentPickerProps = {
  selected?: PaymentType[];
  onChange?: (types: PaymentType[]) => void;
};

const PaymentPicker1 = ({ selected = [], onChange }: PaymentPickerProps) => {
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
    <div className="p-6 border border-muted-foreground w-fit rounded-xl relative">
      <span className="absolute -top-3 left-3 bg-background text-foreground text-xs px-2 py-1 rounded-full tracking-wider">
        Zahlungsmethoden
      </span>
      <div className="flex items-center justify-between w-fit gap-2">
        {paymentMethods.map((method) => (
          <div key={method.id} className="relative">
            <button
              type="button"
              onClick={() => toggleMethod(method.id as PaymentType)}
              className={`w-20 h-20 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
                selected.includes(method.id as PaymentType)
                  ? "bg-muted-foreground text-background"
                  : "border-muted-foreground"
              }`}
              data-tooltip-id="tooltip"
              data-tooltip-content={method.name}
              data-tooltip-place="top"
            >
              <span>{method.icon}</span>
            </button>
            {selected.includes(method.id as PaymentType) && (
              <Check className="h-4 w-4 absolute top-2 right-2 text-background" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentPicker1;
