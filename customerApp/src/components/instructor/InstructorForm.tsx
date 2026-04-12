import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import type { Instructor } from "../../types/instructor-types";
import ProfileImageUploader from "../ui/image/ProfileImageUploader";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import SkillSection from "./SkillSection";
import InstructorCoursesSection from "./InstructorCoursesSection";
import { createInstructor } from "../../data/instructor";
import { getCoursesByInstructorIdDB } from "../../data/course";

type InstructorFormProps = {
  instructor?: Instructor;
};

type InstructorFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  skills: string[];
};

const InstructorForm = ({ instructor }: InstructorFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);

  const methods = useForm<InstructorFormValues>({
    defaultValues: {
      imageUrl: instructor?.imageUrl || "",
      name: instructor?.name || "",
      description: instructor?.description || "",
      skills: instructor?.skills || [],
    },
  });

  const { register, reset, handleSubmit } = methods;

  useEffect(() => {
    if (!instructor) return;

    reset({
      imageUrl: instructor.imageUrl || "",
      name: instructor.name || "",
      description: instructor.description || "",
      skills: instructor.skills || [],
    });
  }, [instructor, reset]);

  useEffect(() => {
    if (!instructor) return;
    const fetchCourses = async () => {
      try {
        const data = await getCoursesByInstructorIdDB(instructor.id);
        console.log("Courses for instructor:", data);
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses for instructor:", error);
      }
    };
    fetchCourses();
  }, [instructor]);

  const onSubmit = async (values: InstructorFormValues) => {
    try {
      setIsSubmitting(true);

      const finalImageUrl = imageFile ? undefined : values.imageUrl;

      await createInstructor({
        name: values.name.trim(),
        description: values.description.trim(),
        skills: values.skills.map((skill) => skill.trim()).filter(Boolean),
        imageUrl: finalImageUrl,
        imageFile,
      });
    } catch (error) {
      console.error("Fehler beim Absenden des Formulars:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 grid grid-cols-1 gap-6 xl:grid-cols-2 3xl:grid-cols-3"
      >
        <div className="col-span-1 flex items-start gap-6">
          <div className="flex flex-col">
            <div className="flex">
              <ProfileImageUploader
                id={instructor?.id}
                className="h-60 w-60"
                imageUrl={instructor?.imageUrl}
                onChange={(file) => {
                  setImageFile(file);
                }}
              />
              <div className="flex w-full flex-col gap-5">
                <Input type="text" label="Name" {...register("name")} className="w-full" />

                <Input
                  type="text"
                  label="Kurzbeschreibung"
                  {...register("description")}
                  className="w-full"
                />
              </div>
            </div>
            <SkillSection />
          </div>
        </div>
        <div className="col-span-1">
          <InstructorCoursesSection courses={courses} />
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>

        <div className="col-span-3 lg:col-span-2">
          <Button type="submit" className="mt-8 w-full py-12 text-2xl" disabled={isSubmitting}>
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InstructorForm;
