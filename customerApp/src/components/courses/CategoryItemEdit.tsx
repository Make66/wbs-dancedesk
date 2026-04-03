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
import { IconPicker } from "../ui/iconPicker";

type CategoryFormDataType = {
  name: string;
  color: string[];
  icon: string;
  description: string;
};

type CategoryItemEditProps = {
  category: Category & { isNew?: boolean };
  formData: CategoryFormDataType;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormDataType>>;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  targetId?: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CategoryItemEdit = ({
  category,
  formData,
  setFormData,
  setIsEditable,
  targetId,
  setIsModalOpen,
}: CategoryItemEditProps) => {
  const updateCategory = categoryStore((state) => state.updateCategory);
  const updateCategoryIcon = categoryStore((state) => state.updateCategoryIcon);
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
          targetId: targetId ?? "",
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
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Speichern fehlgeschlagen.");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={() => setIsModalOpen(false)} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-2xl overflow-visible">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">
            {category.isNew ? "Neue Kategorie" : "Kategorie bearbeiten"}
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
              <div className="relative flex items-center gap-4 overflow-visible">
                <ColorPicker
                  color={formData.color[0]}
                  onChange={(newColor) => {
                    setFormData((prev) => ({ ...prev, color: [newColor, formData.color[1]] }));
                    updateCategoryColor(category.id, [newColor, formData.color[1]]);
                  }}
                >
                  <button
                    type="button"
                    className="h-10 w-10 cursor-pointer rounded-md border shadow-sm"
                    style={{ backgroundColor: formData.color[0] }}
                    aria-label="Hintergrundfarbe auswählen"
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
                    className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border bg-white shadow-sm"
                    aria-label="Textfarbe auswählen"
                  >
                    <ImFont
                      className="text-2xl"
                      style={{ color: formData.color[1], stroke: "#000", strokeWidth: "1px" }}
                    />
                  </button>
                </ColorPicker>

                <IconPicker
                  value={formData.icon}
                  onChange={(newIcon) => {
                    setFormData((prev) => ({ ...prev, icon: newIcon }));
                    updateCategoryIcon(category.id, newIcon);
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

export default CategoryItemEdit;
