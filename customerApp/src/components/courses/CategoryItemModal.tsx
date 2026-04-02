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
import { IoIosClose } from "react-icons/io";

type CategoryFormDataType = {
  name: string;
  color: string[];
  icon: string;
  description: string;
};

type CategoryItemEditModalProps = {
  category: Category & { isNew?: boolean };
  formData: CategoryFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormDataType>>;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  targetId?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoryItemEditModal = ({
  category,
  formData,
  setFormData,
  setIsEditable,
  targetId,
  setIsModalOpen,
}: CategoryItemEditModalProps) => {
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
          color: [formData.color[0], formData.color[1]],
          icon: formData.icon,
          isActive: true,
        });

        replaceTemporaryCategory(category.id, createdCategory);
        toast.success("Kategorie erfolgreich erstellt.");
      } else {
        const updatedCategory = await updateCategoryDB({
          id: category.id,
          data: {
            name: formData.name.trim(),
            color: [formData.color[0], formData.color[1]],
            icon: formData.icon,
          },
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
    <div
      className="w-full h-screen fixed top-0 left-0 bg-black/40 z-50"
      onClick={() => setIsModalOpen(false)}
    >
      <div className="absolute rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg z-50 w-full max-w-md">
        <div className="flex items-start justify-between mb-6">
          <h3 className="mb-8 font-semibold text-2xl">
            {category.isNew ? "Neue Kategorie" : `Kategorie bearbeiten`}
          </h3>
          <IoIosClose className="cursor-pointer" size={30} onClick={() => setIsEditable(false)} />
        </div>
        <form onSubmit={handleSubmit} className="flex items-center justify-between gap-6">
          <div className="flex flex-col items-center gap-6">
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
            <Input
              type="text"
              className="w-100"
              label="Beschreibung"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
            <div className="w-full flex items-center justify-between">
              <div className="flex gap-6">
                <ColorPicker
                  color={formData.color[0]}
                  onChange={(newColor) => {
                    setFormData((prev) => ({ ...prev, color: [newColor, formData.color[1]] }));
                    updateCategoryColor(category.id, [newColor, formData.color[1]]);
                  }}
                >
                  <button
                    type="button"
                    className="h-10 w-10 cursor-pointer rounded-full border shadow"
                    style={{ backgroundColor: formData.color[0] }}
                    aria-label="Farbe auswählen"
                  />
                </ColorPicker>
                <ColorPicker
                  color={formData.color[1]}
                  onChange={(newColor) => {
                    setFormData((prev) => ({ ...prev, color: [prev.color[0], newColor] }));
                    updateCategoryColor(category.id, [formData.color[0], newColor]);
                  }}
                >
                  <button
                    type="button"
                    className="w-10 h-10 cursor-pointer flex items-center justify-center"
                  >
                    <ImFont
                      className="text-2xl"
                      style={{ color: formData.color[1], stroke: "#000", strokeWidth: "1px" }}
                    />
                  </button>
                </ColorPicker>
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

export default CategoryItemEditModal;
