import { useForm, FormProvider } from "react-hook-form";
import type { Course } from "../../types/course-types";
import { useEffect } from "react";
import ScheduleSection from "./ScheduleSection";
import type { CourseFormValues } from "../../types/form";
import SeatChart from "../charts/SeatChart";
import ContractSection from "./ContractSection";
import { Button } from "../ui/button";
import { updateCourseDB } from "../../data/course";

type CourseFormProps = {
  course?: Course;
};

const CourseForm = ({ course }: CourseFormProps) => {
  const methods = useForm<CourseFormValues>({
    defaultValues: {
      name: course?.name || "",
      description: course?.description || "",
      paymentTypes: course?.paymentTypes || [],
      contractTypes: course?.contractTypes || [],
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
    },
  });

  const { register, handleSubmit, watch, reset } = methods;

  useEffect(() => {
    if (!course) return;

    reset({
      name: course.name || "",
      description: course.description || "",
      paymentTypes: course.paymentTypes || [],
      contractTypes: course.contractTypes || [],
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

    console.log("SAVE PAYLOAD:", payload);

    // const isEditMode = !!course?.id;

    const res = await updateCourseDB(course!.id, payload);

    if (!res.ok) {
      throw new Error("Kurs konnte nicht gespeichert werden.");
    }

    const savedCourse = await res.json();
    console.log("SAVED COURSE:", savedCourse);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-12"
      >
        <div className="col-span-3">
          <input
            type="text"
            placeholder="Kursname"
            {...register("name")}
            className="text-3xl w-full font-bold focus:outline-none focus:ring-0 focus:shadow-none"
          />
          <input
            type="text"
            placeholder="Kursbeschreibung"
            {...register("description")}
            className="text-lg w-full mt-4 mb-12 focus:outline-none focus:ring-0 focus:shadow-none"
          />
        </div>

        <div className="col-span-3 md:col-span-2">
          <ScheduleSection />

          <div className="my-6" />
          <ContractSection />

          <button type="submit"></button>

          <div className="my-12 border-t" />
        </div>

        <div>
          <SeatChart
            seatsCurrent={course?.seatsCurrent || 0}
            maxSeats={course?.seatsMax || 0}
          />
        </div>
         <Button type="submit" className="col-span-3 md:col-span-1">
          Speichern
        </Button>
      </form>
    </FormProvider>
  );
};

export default CourseForm;
