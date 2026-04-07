import { IoIosClose } from "react-icons/io";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import PaymentPicker from "./PaymentPicker";
import { LiaHourglassEndSolid } from "react-icons/lia";

type ContractModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContractModal = ({ onClose }: ContractModalProps) => {
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => onClose()} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background border border-muted-foreground p-6 shadow-2xl overflow-visible">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">Vertragsdaten hinzufügen</h3>

          <button
            type="button"
            onClick={() => onClose()}
            className="cursor-pointer"
            aria-label="Modal schließen"
          >
            <IoIosClose size={30} />
          </button>
        </div>
        <div className="flex flex-col gap-5">
          <Input type="text" placeholder="Vertragstitel" label="Vertragstitel" className="w-full" />
          <div className="flex gap-5">
            <Input
              type="number"
              placeholder="Betrag"
              label="Betrag"
              className="w-full"
              min={0}
              step={0.01}
            />
            <Input
              type="number"
              placeholder="Anzahl Raten"
              label="Anzahl Raten"
              className="w-full"
              min={1}
              step={1}
            />
            <button
              type="button"
              className="w-full h-22 cursor-pointer hover:bg-blue-400 rounded-2xl border border-muted-foreground flex items-center justify-center"
              title="Vertrag endet automatisch"
            >
              <div className="flex flex-col items-center gap-1">
                <LiaHourglassEndSolid className="text-4xl" />
                <span className="text-[12px]">endet automatisch</span>
              </div>
            </button>
          </div>
          <PaymentPicker />
        </div>

        <Button type="submit" size="lg" className="mt-5">
          Speichern
        </Button>
      </div>
    </div>
  );
};

export default ContractModal;
