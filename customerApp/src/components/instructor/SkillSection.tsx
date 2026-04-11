import { useState } from "react";
import { useFormContext } from "react-hook-form";
import SkillsModal from "./SklillsModal";
import { FaLightbulb } from "react-icons/fa6";
import EditButton from "../ui/EditButton";
import AddButton from "../ui/AddButton";
import DeleteButton from "../ui/DeleteButton";

type InstructorFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  skills: string[];
};

const SkillSection = () => {
  const { watch, setValue } = useFormContext<InstructorFormValues>();

  const skills = watch("skills") || [];

  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [editingSkillIndex, setEditingSkillIndex] = useState<number | null>(null);

  const handleOpenNewSkillModal = () => {
    setEditingSkillIndex(null);
    setIsSkillsModalOpen(true);
  };

  const handleEditSkill = (index: number) => {
    setEditingSkillIndex(index);
    setIsSkillsModalOpen(true);
  };

  const handleCloseSkillModal = () => {
    setIsSkillsModalOpen(false);
    setEditingSkillIndex(null);
  };

  const handleSaveSkill = (skillName: string) => {
    const trimmedName = skillName.trim();
    if (!trimmedName) return;

    const currentSkills = [...skills];

    if (editingSkillIndex !== null) {
      currentSkills[editingSkillIndex] = trimmedName;
    } else {
      currentSkills.push(trimmedName);
    }

    setValue("skills", currentSkills, {
      shouldDirty: true,
      shouldValidate: true,
    });

    handleCloseSkillModal();
  };

  const handleRemoveSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);

    setValue("skills", updatedSkills, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <>
      <div className="w-full p-2 rounded-2xl bg-orange-400/40 shadow-xl">
        <div className="pt-2 pl-3 flex items-center justify-between col-span-1 md:col-span-2">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaLightbulb className="text-xl" />
              <span className="text-2xl font-semibold">Skills</span>
            </div>
          </div>
          <AddButton size="medium" onClick={handleOpenNewSkillModal} className="mr-3" />
        </div>

        <div className="w-full mt-4">
          {skills.length === 0 ? (
            <div
              onClick={handleOpenNewSkillModal}
              className="w-full text-sm p-4 rounded-xl text-muted-foreground border border-dashed border-muted-foreground cursor-pointer"
            >
              Noch keine Skills vorhanden.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <div
                  key={`${skill}-${index}`}
                  className="w-full flex items-center justify-between rounded-2xl bg-background/40 border border-muted-foreground p-4"
                >
                  <span className="mr-4">{skill}</span>

                  <div className="flex items-center gap-7 mr-3">
                    <button type="button" onClick={() => handleEditSkill(index)} className="mt-1">
                      <EditButton size="small" />
                    </button>

                    <button type="button" onClick={() => handleRemoveSkill(index)}>
                      <DeleteButton size="medium" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <SkillsModal
        key={editingSkillIndex !== null ? `edit-${editingSkillIndex}` : "new-skill"}
        open={isSkillsModalOpen}
        onClose={handleCloseSkillModal}
        onSave={handleSaveSkill}
        defaultValue={editingSkillIndex !== null ? skills[editingSkillIndex] : ""}
      />
    </>
  );
};

export default SkillSection;
