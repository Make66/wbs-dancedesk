import { useState } from "react";
import { IoIosClose } from "react-icons/io";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import PaymentPicker from "./PaymentPicker";
import { BsSignStopFill, BsSignStop } from "react-icons/bs";
import { cn } from "../../lib/utils";
import type { Contract, PaymentType } from "../../types/course-types";
import { Check } from "lucide-react";
import { contractDraftSchema } from "./schemas/contract-schema";

type ContractModalProps = {
  onClose: () => void;
  initialValues: Contract;
  onSave: (contract: Contract) => void;
};

type ContractDraft = Omit<Contract, "amount" | "installments"> & {
  amount: string;
  installments: string;
};

type ContractDraftErrors = Partial<Record<keyof ContractDraft, string>>;

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
  const [draft, setDraft] = useState<ContractDraft>(() => toDraft(initialValues));
  const [errors, setErrors] = useState<ContractDraftErrors>({});

  const handleChange = <K extends keyof ContractDraft>(key: K, value: ContractDraft[K]) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: undefined,
    }));
  };

  const handleSubmit = () => {
    const result = contractDraftSchema.safeParse(draft);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        title: fieldErrors.title?.[0],
        amount: fieldErrors.amount?.[0],
        installments: fieldErrors.installments?.[0],
        paymentTypes: fieldErrors.paymentTypes?.[0],
      });

      return;
    }

    setErrors({});

    onSave({
      ...result.data,
      amount: toNumber(result.data.amount),
      installments: toNumber(result.data.installments),
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
          <div>
            <Input
              type="text"
              placeholder="Vertragstitel"
              label="Vertragstitel"
              className="w-full"
              value={draft.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="flex gap-5">
            <div className="w-full">
              <Input
                type="text"
                placeholder="Betrag"
                label="Betrag"
                className="w-full"
                value={draft.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
              />
              {errors.amount && <p className="mt-1 text-sm text-red-500">{errors.amount}</p>}
            </div>

            <div className="w-full">
              <Input
                type="text"
                placeholder="Anzahl Raten"
                label="Anzahl Raten"
                className="w-full"
                value={draft.installments}
                onChange={(e) => handleChange("installments", e.target.value)}
              />
              {errors.installments && (
                <p className="mt-1 text-sm text-red-500">{errors.installments}</p>
              )}
            </div>

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

          <div>
            <PaymentPicker
              selected={draft.paymentTypes}
              onChange={(types: PaymentType[]) => handleChange("paymentTypes", types)}
            />
            {errors.paymentTypes && (
              <p className="mt-1 text-sm text-red-500">{errors.paymentTypes}</p>
            )}
          </div>
        </div>

        <Button type="button" size="lg" className="mt-5" onClick={handleSubmit}>
          Speichern
        </Button>
      </div>
    </div>
  );
};

export default ContractModal;
