import { IoIosClose } from "react-icons/io";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";

type SkillsModalProps = {
  onClose: () => void;
  open: boolean;
  onSave: (skill: string) => void;
  defaultValue?: string;
};

const SkillsModal = ({ onClose, open, onSave, defaultValue = "" }: SkillsModalProps) => {
  const [name, setName] = useState(defaultValue);

  const handleSubmit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    onSave(trimmedName);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-muted-foreground bg-background p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">
            {defaultValue ? "Skill bearbeiten" : "Skill hinzufügen"}
          </h3>

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
          <Input label="Skill" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Button type="button" size="lg" className="mt-5" onClick={handleSubmit}>
          Speichern
        </Button>
      </div>
    </div>
  );
};

export default SkillsModal;
