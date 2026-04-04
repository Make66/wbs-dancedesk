import type React from "react";
import { Button } from "./button";
import { IoIosClose } from "react-icons/io";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmText = "Bestätigen",
  cancelText = "Abbrechen",
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onCancel} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">{title}</h3>

          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="cursor-pointer disabled:opacity-50"
            aria-label="Modal schließen"
          >
            <IoIosClose size={30} />
          </button>
        </div>

        {description && <p className="mb-6 text-gray-600 dark:text-gray-400">{description}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={isDestructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Wird gelöscht..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
