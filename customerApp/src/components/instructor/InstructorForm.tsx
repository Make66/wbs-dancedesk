import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import type { Instructor } from "../../types/instructor-types";
import ProfileImageUploader from "../ui/image/ProfileImageUploader";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import SkillSection from "./SkillSection";
import InstructorCoursesSection from "./InstructorCoursesSection";
import { updateInstructor } from "../../data/instructor";
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
      if (!instructor) return;
      setIsSubmitting(true);

      const finalImageUrl = imageFile ? undefined : values.imageUrl;

      await updateInstructor(instructor.id, {
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
        className="mt-2 grid grid-cols-1 lg:grid-cols-2 3xl:grid-cols-3 gap-6"
      >
        <div className="col-span-1 items-start gap-6">
          <div className="flex flex-col gap-6 items-center">
            <ProfileImageUploader
              id={instructor?.id}
              className="h-80 w-80"
              imageUrl={instructor?.imageUrl}
              onChange={(file) => {
                setImageFile(file);
              }}
            />
            <Input type="text" label="Name" {...register("name")} className="w-full" />

            <Input
              type="text"
              label="Kurzbeschreibung"
              {...register("description")}
              className="w-full"
            />
            <SkillSection />
          </div>
          <Button type="submit" className="mt-8 w-full py-12 text-2xl" disabled={isSubmitting}>
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </div>
        <div className="col-span-1">
          {courses.length > 0 && <InstructorCoursesSection courses={courses} />}
        </div>
      </form>
    </FormProvider>
  );
};

export default InstructorForm;
