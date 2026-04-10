import { FaPenNib, FaTrash } from "react-icons/fa6";
import { BsSignStopFill } from "react-icons/bs";
import type { Contract, PaymentType } from "../../types/course-types";
import { Switch } from "../ui/switch";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { PAYMENT } from "../../lib/constants/icon-constants";

type ContractItem = {
  contract: Contract;
  index: number;
  handleEdit: (index: number) => void;
  handleDelete: (index: number) => void;
  handleToggleActive: (index: number, isActive: boolean) => void;
};

const ContractItem = ({
  contract,
  handleEdit,
  index,
  handleDelete,
  handleToggleActive,
}: ContractItem) => {
  const [isActive, setIsActive] = useState(contract.isActive);
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between rounded-2xl border border-muted-foreground bg-background/40 p-5",
        !isActive && "opacity-70",
      )}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-lg">{contract.title}</span>
        <span className="text-md text-muted-foreground">
          {contract.amount} € x {contract.installments} Rate(n)
          {" = "}
          <span className="font-semibold">
            {(contract.amount * contract.installments).toFixed(2)} €
          </span>
        </span>
      </div>

      <div className="hidden lg:flex items-center text-sm text-muted-foreground">
        {contract.autoEnd && (
          <div
            className="mr-14"
            data-tooltip-id="tooltip"
            data-tooltip-content="Automatische Beendigung"
          >
            <BsSignStopFill className="text-xl" />
          </div>
        )}
        {PAYMENT.filter((method) => contract.paymentTypes.includes(method.id as PaymentType)).map(
          (method) => (
            <div
              key={method.id}
              className="mr-6"
              data-tooltip-id="tooltip"
              data-tooltip-content={method.name}
            >
              {method.icon}
            </div>
          ),
        )}
      </div>

      <div className="flex items-center gap-7 mr-4">
        {!isActive ? (
          <button type="button" className="cursor-pointer" onClick={() => handleDelete(index)}>
            <FaTrash className="text-xl" />
          </button>
        ) : (
          <button type="button" className="cursor-pointer" onClick={() => handleEdit(index)}>
            <FaPenNib className="text-xl" />
          </button>
        )}
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => {
            setIsActive(checked);
            handleToggleActive(index, checked);
          }}
          color="white"
          color2="black"
          className="border border-foreground"
        />
      </div>
    </div>
  );
};

export default ContractItem;
