import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import type { Course } from "../../types/course-types";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation, useNavigate } from "react-router";

import ScheduleSection from "./ScheduleSection";
import ContractSection from "./ContractSection";
import DetailsSection from "./DetailsSection";
import SettingsSection from "./SettingsSection";
import { Button } from "../ui/button";
import { updateCourseDB, createCourseDB } from "../../data/course";
import { courseFormSchema, type CourseFormValues } from "./schemas/course-schema";
import ParticipantsSection from "./ParticipantsSection";

type CourseFormProps = {
  course?: Course;
};

const toColorTuple = (color?: string[]): [string, string] => [
  color?.[0] ?? "#ffffff",
  color?.[1] ?? "#000000",
];

const CourseForm = ({ course }: CourseFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const methods = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      categoryId: course?.categoryId || "",
      contracts: course?.contracts || [],
      startsAt: course?.startsAt ? new Date(course.startsAt) : undefined,
      endsAt: course?.endsAt ? new Date(course.endsAt) : undefined,
      frequency: course?.frequency || "weekly",
      isClub: course?.isClub || false,
      courseRepetition: course?.courseRepetition || 0,
      clubRepetition: course?.clubRepetition || 0,
      isIgnoreCalendar: course?.isIgnoreCalendar || false,
      dates: course?.dates || [],
      isTaxFree: course?.isTaxFree || false,
      isBookedOut: course?.isBookedOut || false,
      color: toColorTuple(course?.color),
      seatsMax: course?.seatsMax || 0,
      seatsCurrent: course?.seatsCurrent || 0,
      instructorId: course?.instructorId || "",
      roomId: course?.roomId || "",
    },
  });

  const { register, handleSubmit, watch, reset } = methods;

  useEffect(() => {
    if (!course) return;
    reset({
      name: course.name || "",
      description: course.description || "",
      categoryId: course.categoryId || "",
      contracts: course.contracts || [],
      startsAt: course.startsAt ? new Date(course.startsAt) : undefined,
      endsAt: course.endsAt ? new Date(course.endsAt) : undefined,
      frequency: course.frequency || "weekly",
      isClub: course.isClub || false,
      courseRepetition: course.courseRepetition || 0,
      clubRepetition: course.clubRepetition || 0,
      isIgnoreCalendar: course.isIgnoreCalendar || false,
      dates: course.dates || [],
      isTaxFree: course.isTaxFree || false,
      isBookedOut: course.isBookedOut || false,
      color: toColorTuple(course.color),
      seatsMax: course.seatsMax || 0,
      seatsCurrent: course.seatsCurrent || 0,
      instructorId: course.instructorId || "",
      roomId: course.roomId || "",
    });
  }, [course, reset]);

  const watchedValues = watch();
  console.log("WATCHED VALUES:", watchedValues);

  const onSubmit: SubmitHandler<CourseFormValues> = async (values) => {
    const payload = {
      ...values,
      ...(values.categoryId && { categoryId: values.categoryId }),
      startsAt: values.startsAt?.toISOString() ?? null,
      endsAt: values.endsAt?.toISOString() ?? null,
      dates:
        values.dates?.map((item) => ({
          ...item,
          date: new Date(item.date).toISOString(),
        })) ?? [],
    };

    try {
      const isEditMode = !!course?.id;

      const res = isEditMode
        ? await updateCourseDB(course.id, payload)
        : await createCourseDB(location.state.category.id, payload);

      const savedCourse = await res.json();
      console.log("SAVED COURSE:", savedCourse);

      navigate(-1);
    } catch (error) {
      console.error("Submit error:", error);
      throw error;
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-2 grid grid-cols-1 gap-5 xl:grid-cols-2 3xl:grid-cols-3"
      >
        <div className="col-span-3">
          <input
            type="text"
            placeholder="Kursname"
            {...register("name")}
            className="w-full text-2xl font-bold focus:outline-none focus:ring-0 focus:shadow-none md:text-3xl xl:text-4xl 2xl:text-5xl"
          />
          <input
            type="text"
            placeholder="Kursbeschreibung"
            {...register("description")}
            className="mt-1 mb-4 w-full text-lg focus:outline-none focus:ring-0 focus:shadow-none"
          />
        </div>

        <div className="col-span-3 lg:col-span-2">
          <DetailsSection />

          <div className="my-6" />
          <ScheduleSection />

          <div className="my-6" />
          <ContractSection />

          <div className="my-6" />
          <SettingsSection />

          <Button type="submit" className="col-span-3 md:col-span-1">
            Speichern
          </Button>
        </div>
        <div>
          <ParticipantsSection courseId={course?.id || ""} />
        </div>
      </form>
    </FormProvider>
  );
};

export default CourseForm;
