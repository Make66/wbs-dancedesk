import { FaCoins } from "react-icons/fa";
import { AiFillBank } from "react-icons/ai";
import { FaPaypal } from "react-icons/fa";
import type { PaymentType } from "../../types/course-types";

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
    <div className="p-6 border border-muted-foreground w-fit rounded-xl relative">
      <span className="absolute -top-3 left-3 bg-background text-foreground text-xs px-2 py-1 rounded-full tracking-wider">
        Zahlungsmethoden
      </span>
      <div className="flex items-center justify-between w-fit gap-2">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => toggleMethod(method.id as PaymentType)}
            className={`w-15 h-15 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${
              selected.includes(method.id as PaymentType)
                ? "bg-muted-foreground text-background"
                : "border-muted-foreground"
            }`}
            data-tooltip-id="tooltip"
            data-tooltip-content={method.name}
            data-tooltip-place="top"
          >
            {method.icon}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentPicker;
