import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import type { Course } from "../../types/course-types";
import { useEffect, useState } from "react";
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
import type { Participant } from "../../types/participants-type";
import { getParticipantsByCourseId } from "../../data/participants";
import { getRooms } from "../../data/rooms";
import type { Room } from "../../types/room-types";
import { userStore } from "../../stores/userStore";

type CourseFormProps = {
  course?: Course;
};

const toColorTuple = (color?: string[]): [string, string] => [
  color?.[0] ?? "#ffffff",
  color?.[1] ?? "#000000",
];

const CourseForm = ({ course }: CourseFormProps) => {
  const locationId = userStore((state) => state.selectedLocationId);
  const location = useLocation();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    if (!course?.id) return;

    const fetchParticipants = async () => {
      try {
        setParticipantsLoading(true);
        const data = await getParticipantsByCourseId(course.id);
        setParticipants(data);
      } catch (error) {
        console.error("Error fetching participants:", error);
        setParticipants([]);
      } finally {
        setParticipantsLoading(false);
      }
    };
    fetchParticipants();
  }, [course?.id]);

  useEffect(() => {
    if (!locationId) return;

    const fetchRooms = async () => {
      try {
        setRoomsLoading(true);
        const data = await getRooms(locationId);
        setRooms(data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    };
    fetchRooms();
  }, [locationId]);

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
          <DetailsSection
            rooms={rooms}
            roomsLoading={roomsLoading}
            participants={participants}
            course={course as Course}
          />

          <div className="my-6" />
          <ScheduleSection />

          <div className="my-6" />
          <ContractSection />

          <div className="my-6" />
          <SettingsSection />

          <Button type="submit" className="w-full py-12 text-2xl mt-8">
            Speichern
          </Button>
        </div>
        <div className="col-span-3 lg:col-span-1">
          <ParticipantsSection participants={participants} isLoading={participantsLoading} />
        </div>
      </form>
    </FormProvider>
  );
};

export default CourseForm;
