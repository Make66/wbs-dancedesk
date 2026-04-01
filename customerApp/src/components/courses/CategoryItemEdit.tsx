import type React from "react";
import { Input } from "../ui/input";
import { ColorPicker } from "../ui/colorPicker";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { categoryStore } from "../../stores/categoryStore";
import { userStore } from "../../stores/userStore";
import { createCategoryDB, updateCategoryDB } from "../../data/category";
import type { Category } from "../../types/course-types";
import { ImFont } from "react-icons/im";

type CategoryFormDataType = {
  id: string;
  name: string;
  color: string;
  fontColor: string;
  icon: string;
};

type CategoryItemEditProps = {
  category: Category & { isNew?: boolean };
  formData: CategoryFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormDataType>>;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  targetId?: string;
};

const CategoryItemEdit = ({
  category,
  formData,
  setFormData,
  setIsEditable,
  targetId,
}: CategoryItemEditProps) => {
  const updateCategory = categoryStore((state) => state.updateCategory);
  const updateCategoryColor = categoryStore((state) => state.updateCategoryColor);
  const replaceTemporaryCategory = categoryStore((state) => state.replaceTemporaryCategory);
  const selectedLocationId = userStore((state) => state.selectedLocationId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Bitte gib der Kategorie einen Namen.");
      return;
    }

    if (category.isNew && !selectedLocationId) {
      toast.error("Bitte wähle zuerst einen Standort aus.");
      return;
    }

    try {
      if (category.isNew) {
        const createdCategory = await createCategoryDB({
          targetId: targetId! ?? "",
          name: formData.name.trim(),
          color: [formData.color, formData.fontColor],
          icon: formData.icon,
          active: true,
        });

        replaceTemporaryCategory(category.id, createdCategory);
        toast.success("Kategorie erfolgreich erstellt.");
      } else {
        const updatedCategory = await updateCategoryDB(category.id, {
          name: formData.name.trim(),
          color: [formData.color, formData.fontColor],
          icon: formData.icon,
        });

        updateCategory(category.id, updatedCategory);
        toast.success("Kategorie erfolgreich aktualisiert.");
      }

      setIsEditable(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  return (
    <div className="py-4">
      <form onSubmit={handleSubmit} className="flex items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <input type="hidden" value={formData.id} name="id" />

          <Input
            type="text"
            className="w-100"
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <ColorPicker
            color={formData.color}
            onChange={(newColor) => {
              setFormData((prev) => ({
                ...prev,
                color: newColor,
              }));
              updateCategoryColor(category.id, [newColor, formData.fontColor]);
            }}
          >
            <button
              type="button"
              className="h-10 w-10 cursor-pointer rounded-full border shadow"
              style={{ backgroundColor: formData.color }}
              aria-label="Farbe auswählen"
            />
          </ColorPicker>
          <ColorPicker
            color={formData.fontColor}
            onChange={(newColor) => {
              setFormData((prev) => ({ ...prev, fontColor: newColor }));
              updateCategoryColor(category.id, [formData.color, newColor]);
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
        </div>

        <Button type="submit" size="lg">
          Speichern
        </Button>
      </form>
    </div>
  );
};

export default CategoryItemEdit;
