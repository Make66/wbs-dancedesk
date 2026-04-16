import type React from "react";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/colorPicker";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { targetStore } from "../../stores/targetStore";
import { userStore } from "../../stores/userStore";
import { createTargetDB, updateTargetDB } from "../../data/target";
import type { Target } from "../../types/course-types";
import { ImFont } from "react-icons/im";
import { IoIosClose } from "react-icons/io";
import { IconPicker } from "../ui/iconPicker";

type TargetFormDataType = {
  name: string;
  description: string;
  color: string[];
  icon: string;
};

type TargetItemEditProps = {
  target: Target & { isNew?: boolean };
  formData: TargetFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<TargetFormDataType>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TargetItemEdit = ({ target, formData, setFormData, setIsModalOpen }: TargetItemEditProps) => {
  const updateTarget = targetStore((state) => state.updateTarget);
  const updateColor = targetStore((state) => state.updateColor);
  const replaceTemporaryTarget = targetStore((state) => state.replaceTemporaryTarget);
  const selectedLocationId = userStore((state) => state.selectedLocationId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Bitte gib der Zielgruppe einen Namen.");
      return;
    }

    const locationId = selectedLocationId ?? target.locationId;

    if (target.isNew && !locationId) {
      toast.error("Bitte wähle zuerst einen Standort aus.");
      return;
    }

    try {
      if (target.isNew) {
        const createdTarget = await createTargetDB({
          name: formData.name.trim(),
          description: formData.description.trim(),
          color: [formData.color[0], formData.color[1]],
          icon: formData.icon,
          isActive: true,
          locationId: locationId,
          setSeqCategory: [],
        });

        replaceTemporaryTarget(target.id, createdTarget);
        toast.success("Kursziel erfolgreich erstellt.");
      } else {
        const updatedTarget = await updateTargetDB(target.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          color: [formData.color[0], formData.color[1]],
          icon: formData.icon,
        });

        updateTarget(target.id, updatedTarget);
        toast.success("Kursziel erfolgreich aktualisiert.");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving target:", error);
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-background p-6 shadow-2xl overflow-visible border border-muted-foreground z-90">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">
            {target.isNew ? "Neue Zielgruppe" : "Zielgruppe bearbeiten"}
          </h3>

          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer"
            aria-label="Modal schließen"
          >
            <IoIosClose size={30} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex w-full flex-col gap-6">
            <Input
              type="text"
              className="w-full"
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
            <Input
              type="text"
              className="w-full"
              label="Beschreibung"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />

            <div className="flex w-full items-center justify-between gap-4">
              <div className="relative flex items-center gap-7 overflow-visible">
                <div className="flex">
                  <ColorPicker
                    color={formData.color[0]}
                    onChange={(newColor) => {
                      setFormData((prev) => ({ ...prev, color: [newColor, formData.color[1]] }));
                      updateColor(target.id, [newColor, formData.color[1]]);
                    }}
                  >
                    <button
                      type="button"
                      className="h-22 w-22 cursor-pointer rounded-l-2xl border shadow-sm"
                      style={{ backgroundColor: formData.color[0] }}
                      aria-label="Hintergrundfarbe auswählen"
                    />
                  </ColorPicker>

                  <ColorPicker
                    color={formData.color[1]}
                    onChange={(newColor) => {
                      setFormData((prev) => ({ ...prev, color: [prev.color[0], newColor] }));
                      updateColor(target.id, [formData.color[0], newColor]);
                    }}
                  >
                    <button
                      type="button"
                      className="flex h-22 w-22 cursor-pointer items-center justify-center rounded-r-2xl border bg-white shadow-sm"
                      aria-label="Textfarbe auswählen"
                    >
                      <ImFont
                        className="text-2xl"
                        style={{ color: formData.color[1], stroke: "#000", strokeWidth: "1px" }}
                      />
                    </button>
                  </ColorPicker>
                </div>

                <IconPicker
                  value={formData.icon}
                  onChange={(newIcon) => {
                    setFormData((prev) => ({ ...prev, icon: newIcon }));
                  }}
                />
              </div>

              <Button type="submit" size="lg">
                Speichern
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetItemEdit;
