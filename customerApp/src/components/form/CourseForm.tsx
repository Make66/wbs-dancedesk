import { useForm, FormProvider } from "react-hook-form";
import type { Course } from "../../types/course-types";
import { useEffect } from "react";
import ScheduleSection from "./ScheduleSection";
import type { CourseFormValues } from "../../types/form";
import ContractSection from "./ContractSection";
import { Button } from "../ui/button";
import { updateCourseDB, createCourseDB } from "../../data/course";
import { useLocation, useNavigate } from "react-router";
import DetailsSection from "./DetailsSection";
import SettingsSection from "./SettingsSection";

type CourseFormProps = {
  course?: Course;
};

const toColorTuple = (color?: string[]): [string?, string?] => [
  color?.[0] ?? "#ffffff",
  color?.[1] ?? "#000000",
];

const CourseForm = ({ course }: CourseFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const methods = useForm<CourseFormValues>({
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
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
    },
  });

  const { register, handleSubmit, watch, reset } = methods;

  useEffect(() => {
    if (!course) return;

    reset({
      name: course.name || "",
      description: course.description || "",
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
    });
  }, [course, reset]);

  const watchedValues = watch();
  console.log("WATCHED VALUES:", watchedValues);

  const onSubmit = async (values: CourseFormValues) => {
    const payload = {
      ...values,
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

      // navigate(`/course/${savedCourse.id}`);
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
        className="mt-10 grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 gap-12"
      >
        <div className="col-span-3">
          <input
            type="text"
            placeholder="Kursname"
            {...register("name")}
            className="text-2xl md:text-3xl xl:text-4xl 2xl:text-5xl w-full font-bold focus:outline-none focus:ring-0 focus:shadow-none"
          />
          <input
            type="text"
            placeholder="Kursbeschreibung"
            {...register("description")}
            className="text-lg w-full mt-4 focus:outline-none focus:ring-0 focus:shadow-none"
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
      </form>
    </FormProvider>
  );
};

export default CourseForm;
