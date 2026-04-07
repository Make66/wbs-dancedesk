import { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import PaymentPicker from "./PaymentPicker";
import { BsSignStopFill, BsSignStop } from "react-icons/bs";
import { cn } from "../../lib/utils";
import type { Contract, PaymentType } from "../../types/course-types";
import { Check } from "lucide-react";

type ContractModalProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues: Contract;
  onSave: (contract: Contract) => void;
};

type ContractDraft = Omit<Contract, "amount" | "installments"> & {
  amount: string;
  installments: string;
};

const toDraft = (contract: Contract): ContractDraft => ({
  ...contract,
  amount: contract.amount?.toString() ?? "",
  installments: contract.installments?.toString() ?? "",
});

const toNumber = (value: string) => {
  const normalized = value.replace(",", ".").trim();
  return normalized === "" ? 0 : Number(normalized);
};

const ContractModal = ({ onClose, initialValues, onSave }: ContractModalProps) => {
  const [draft, setDraft] = useState<ContractDraft>(toDraft(initialValues));

  useEffect(() => {
    setDraft(toDraft(initialValues));
  }, [initialValues]);

  const handleChange = <K extends keyof ContractDraft>(key: K, value: ContractDraft[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    onSave({
      ...draft,
      amount: toNumber(draft.amount),
      installments: toNumber(draft.installments),
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background border border-muted-foreground p-6 shadow-2xl overflow-visible">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">Vertragsdaten hinzufügen</h3>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer"
            aria-label="Modal schließen"
          >
            <IoIosClose size={30} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <Input
            type="text"
            placeholder="Vertragstitel"
            label="Vertragstitel"
            className="w-full"
            value={draft.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />

          <div className="flex gap-5">
            <Input
              type="text"
              placeholder="Betrag"
              label="Betrag"
              className="w-full"
              value={draft.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />

            <Input
              type="text"
              placeholder="Anzahl Raten"
              label="Anzahl Raten"
              className="w-full"
              value={draft.installments}
              onChange={(e) => handleChange("installments", e.target.value)}
            />

            <button
              type="button"
              onClick={() => handleChange("autoEnd", !draft.autoEnd)}
              className={cn(
                "w-full h-22 relative cursor-pointer rounded-2xl border border-muted-foreground flex items-center justify-center transition-colors",
                draft.autoEnd ? "bg-muted-foreground text-background" : "hover:bg-blue-400",
              )}
              title="Vertrag endet automatisch"
            >
              <div className="flex flex-col items-center gap-1">
                {draft.autoEnd ? (
                  <BsSignStopFill className="text-4xl" />
                ) : (
                  <BsSignStop className="text-4xl" />
                )}
                <span className="text-[12px]">
                  {draft.autoEnd ? "endet automatisch" : "fortlaufend"}
                </span>
              </div>

              {draft.autoEnd && (
                <Check className="h-4 w-4 absolute top-2 right-5 text-background" />
              )}
            </button>
          </div>

          <PaymentPicker
            selected={draft.paymentTypes}
            onChange={(types: PaymentType[]) => handleChange("paymentTypes", types)}
          />
        </div>

        <Button type="button" size="lg" className="mt-5" onClick={handleSubmit}>
          Speichern
        </Button>
      </div>
    </div>
  );
};

export default ContractModal;
