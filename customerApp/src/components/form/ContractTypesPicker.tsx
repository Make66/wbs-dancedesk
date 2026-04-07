import { PiStandardDefinitionFill } from "react-icons/pi";
import { Bird } from "lucide-react";
import { FaBell } from "react-icons/fa";
import { FaSubscript } from "react-icons/fa";
import type { ContractType } from "../../types/course-types";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

type ContractTypesPickerProps = {
  selected?: ContractType[];
  onChange?: (types: ContractType[]) => void;
};

const ContractTypesPicker = ({ selected = [], onChange }: ContractTypesPickerProps) => {
  const contractMethods = [
    { id: "standard", name: "Standard", icon: <PiStandardDefinitionFill className="text-2xl" /> },
    { id: "trial", name: "Trial", icon: <Bird className="text-2xl" /> },
    {
      id: "subscription",
      name: "Subscription",
      icon: <FaBell className="text-2xl" />,
    },
    { id: "one-time", name: "einmalig", icon: <FaSubscript className="text-2xl" /> },
  ] as const;

  const toggleMethod = (method: ContractType) => {
    const newMethods = selected.includes(method)
      ? selected.filter((m) => m !== method)
      : [...selected, method];
    onChange?.(newMethods);
  };

  return (
    <div className="w-fit relative">
      <div className="flex items-center justify-between w-fit">
        {contractMethods.map((method, index) => (
          <div key={method.id} className="relative">
            <button
              type="button"
              onClick={() => toggleMethod(method.id as ContractType)}
              className={cn(
                index === 0 && "rounded-l-2xl",
                index === contractMethods.length - 1 && "rounded-r-2xl",
                `w-30 h-22 border flex items-center justify-center cursor-pointer transition-all hover:bg-blue-400 ${
                  selected.includes(method.id as ContractType)
                    ? "bg-muted-foreground text-background"
                    : "border-muted-foreground"
                }`,
              )}
            >
              <div flex-col className="mt-2 flex flex-col gap-1 items-center justify-center">
                <span>{method.icon}</span>
                <span className="text-[13px]">{method.name}</span>
              </div>
            </button>
            {selected.includes(method.id as ContractType) && (
              <Check className="h-4 w-4 absolute top-2 right-5 text-background" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContractTypesPicker;
