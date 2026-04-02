import { Input } from "../ui/input";
import { ColorPicker } from "../ui/colorPicker";
import { ImFont } from "react-icons/im";
import { IconPicker } from "../ui/iconPicker";
import { toast } from "react-toastify";
import { targetStore } from "../../stores/targetStore";
import { userStore } from "../../stores/userStore";
import { createTargetDB, updateTargetDB } from "../../data/target";
import type { Target } from "../../types/course-types";
import { MdInsertEmoticon } from "react-icons/md";
import { Button } from "../ui/button";

type TargetFormDataType = {
  id: string;
  name: string;
  color: string;
  fontColor: string;
  icon: string;
};

type TargetItemEditProps = {
  target: Target & { isNew?: boolean };
  formData: TargetFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<TargetFormDataType>>;
};

const TargetItemEdit = ({ target, formData, setFormData }: TargetItemEditProps) => {
  const updateTarget = targetStore((state) => state.updateTarget);
  const updateColor = targetStore((state) => state.updateColor);
  const updateIcon = targetStore((state) => state.updateIcon);
  const setEditingTargetId = targetStore((state) => state.setEditingTargetId);
  const replaceTemporaryTarget = targetStore((state) => state.replaceTemporaryTarget);
  const selectedLocationId = userStore((state) => state.selectedLocationId);

  const handleSubmit = async (e: React.FormEvent) => {
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
          name: formData.name,
          color: [formData.color, formData.fontColor],
          icon: formData.icon,
          active: true,
          locationId: locationId,
          setSeqCategory: [],
        });
        replaceTemporaryTarget(target.id, createdTarget);
        toast.success("Kursziel erfolgreich erstellt!");
      } else {
        const updatedTarget = await updateTargetDB(target.id, {
          name: formData.name,
          color: [formData.color, formData.fontColor],
          icon: formData.icon,
        });

        updateTarget(target.id, updatedTarget);
        toast.success("Kursziel erfolgreich aktualisiert!");
      }

      setEditingTargetId(null);
    } catch (error) {
      console.error(error);
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  return (
    <div className="h-28">
      <form onSubmit={handleSubmit} className="flex items-center justify-between px-5 py-7">
        <div className="flex items-center gap-6">
          <input type="hidden" value={formData.id} name="id" />
          <Input
            type="text"
            className="w-100"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
          <ColorPicker
            color={formData.color}
            onChange={(newColor) => {
              setFormData((prev) => ({ ...prev, color: newColor }));
              updateColor(target.id, [newColor, formData.fontColor]);
            }}
          >
            <button
              type="button"
              className="w-10 h-10 rounded-full border shadow cursor-pointer"
              style={{ backgroundColor: formData.color }}
            />
          </ColorPicker>
          <ColorPicker
            color={formData.fontColor}
            onChange={(newColor) => {
              setFormData((prev) => ({ ...prev, fontColor: newColor }));
              updateColor(target.id, [formData.color, newColor]);
            }}
          >
            <button
              type="button"
              className="w-10 h-10 cursor-pointer flex items-center justify-center"
            >
              <ImFont
                className="text-2xl"
                style={{ color: formData.fontColor, stroke: "#000", strokeWidth: "1px" }}
              />
            </button>
          </ColorPicker>
          <IconPicker
            icon={formData.icon}
            onChange={(newIcon) => {
              setFormData((prev) => ({ ...prev, icon: newIcon }));
              updateIcon(target.id, newIcon);
            }}
          >
            <MdInsertEmoticon className="cursor-pointer text-5xl text-gray-600" />
          </IconPicker>
        </div>
        <Button type="submit" size="lg">
          Speichern
        </Button>
      </form>
    </div>
  );
};

export default TargetItemEdit;
