import { FormProvider, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCircleInfo } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";
import { FaPhoneFlip } from "react-icons/fa6";
import { FaBirthdayCake } from "react-icons/fa";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { IoMaleFemaleOutline } from "react-icons/io5";
import { FaCity } from "react-icons/fa";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { DatePicker } from "../ui/DatePicker";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import ProfileImageUploader from "../ui/image/ImageUploader";
import type { Participant } from "../../types/participants-type";
import type { Course } from "../../types/course-types";
import { updateParticipantDB, getCoursesByParticipantId } from "../../data/participants";
import ParticipantCoursesSection from "./ParticipantCoursesSection";

type ParticipantFormProps = {
  participant?: Participant;
};

type ParticipantFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: "male" | "female" | "other";
  street: string;
  zipCode: string;
  city: string;
};

const GENDER_OPTIONS = [
  { id: "male" as const, label: "Männlich", icon: <IoMdMale className="text-2xl text-blue-500" /> },
  {
    id: "female" as const,
    label: "Weiblich",
    icon: <IoMdFemale className="text-2xl text-pink-500" />,
  },
  {
    id: "other" as const,
    label: "Divers",
    icon: <IoMaleFemaleOutline className="text-2xl text-green-500" />,
  },
];

const ParticipantForm = ({ participant }: ParticipantFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  const methods = useForm<ParticipantFormValues>({
    defaultValues: {
      firstName: participant?.firstName || "",
      lastName: participant?.lastName || "",
      email: participant?.email || "",
      phone: participant?.phone || "",
      birthDate: participant?.birthDate ? participant.birthDate.slice(0, 10) : "",
      gender: (participant?.gender as "male" | "female" | "other") || "other",
      street: participant?.street || "",
      zipCode: participant?.zipCode || "",
      city: participant?.city || "",
    },
  });

  const { register, reset, handleSubmit, watch, setValue } = methods;
  const selectedGender = watch("gender");

  useEffect(() => {
    if (!participant) return;
    reset({
      firstName: participant.firstName || "",
      lastName: participant.lastName || "",
      email: participant.email || "",
      phone: participant.phone || "",
      birthDate: participant.birthDate ? participant.birthDate.slice(0, 10) : "",
      gender: (participant.gender as "male" | "female" | "other") || "other",
      street: participant.street || "",
      zipCode: participant.zipCode || "",
      city: participant.city || "",
    });
  }, [participant, reset]);

  useEffect(() => {
    if (!participant?.id) return;
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true);
        const data = await getCoursesByParticipantId(String(participant.id));
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses for participant:", error);
        setCourses([]);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, [participant?.id]);

  const onSubmit = async (values: ParticipantFormValues) => {
    if (!participant?.id) return;
    try {
      setIsSubmitting(true);
      await updateParticipantDB(String(participant.id), values);
      toast.success("Teilnehmer erfolgreich aktualisiert!");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      toast.error("Fehler beim Speichern des Teilnehmers.");
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
        <div className="col-span-1 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <ProfileImageUploader
              id={String(participant?.id)}
              className="h-64 w-64"
              imageUrl={participant?.imageUrl}
              onChange={() => {}}
            />
          </div>

          <div className="p-4 rounded-2xl bg-purple-400/40 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-1 ml-2">
              <FaCircleInfo className="text-2xl" />
              <span className="text-2xl font-semibold">Persönliche Daten</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input {...register("firstName")} />
              <Input {...register("lastName")} />
            </div>

            <div className="relative">
              <Input type="email" {...register("email")} className="pl-14" />
              <MdAlternateEmail className="text-xl text-muted-foreground absolute left-5 top-9" />
            </div>
            <div className="relative">
              <Input type="tel" {...register("phone")} className="pl-14" />
              <FaPhoneFlip className="text-xl text-muted-foreground absolute left-5 top-9" />
            </div>
            <DatePicker
              value={watch("birthDate") ? new Date(watch("birthDate")) : undefined}
              onChange={(date) =>
                setValue("birthDate", date ? date.toISOString().slice(0, 10) : "")
              }
            >
              <button
                type="button"
                className="h-22 w-full rounded-xl border border-muted-foreground px-5 flex items-center gap-4 bg-background/40 hover:bg-purple-400 transition-colors cursor-pointer"
              >
                <FaBirthdayCake className="text-xl text-muted-foreground shrink-0" />
                <span
                  className={cn(
                    "text-xl",
                    watch("birthDate") ? "text-foreground" : "text-zinc-400",
                  )}
                >
                  {watch("birthDate")
                    ? new Date(watch("birthDate")).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Geburtsdatum wählen"}
                </span>
              </button>
            </DatePicker>

            <div className="w-full flex flex-col gap-1">
              <div className="flex w-full rounded-xl">
                {GENDER_OPTIONS.map((option, index) => (
                  <div key={option.id} className="relative">
                    <button
                      type="button"
                      onClick={() => setValue("gender", option.id)}
                      className={cn(
                        index === 0 && "rounded-l-2xl",
                        index === GENDER_OPTIONS.length - 1 && "rounded-r-2xl",
                        "w-36 h-22 border flex items-center bg-background/40 justify-center cursor-pointer transition-all hover:bg-purple-400",
                        selectedGender === option.id
                          ? "bg-purple-500 text-white border-purple-500"
                          : "border-muted-foreground",
                      )}
                    >
                      <div className="flex flex-col gap-1 items-center justify-center">
                        <span>{option.icon}</span>
                        <span className="text-[13px]">{option.label}</span>
                      </div>
                    </button>
                    {selectedGender === option.id && (
                      <Check className="h-4 w-4 absolute top-2 right-5 text-white" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-400/40 shadow-xl flex flex-col gap-4">
            <div className="flex items-center gap-3 pb-1">
              <FaCity className="text-2xl ml-2" />
              <span className="text-xl font-semibold">Adresse</span>
            </div>
            <Input {...register("street")} />
            <div className="grid grid-cols-2 gap-3">
              <Input {...register("zipCode")} />
              <Input {...register("city")} />
            </div>
          </div>

          <Button type="submit" className="w-full py-12 text-2xl mt-2" disabled={isSubmitting}>
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </div>

        <div className="col-span-1">
          <ParticipantCoursesSection courses={courses} isLoading={coursesLoading} />
        </div>
      </form>
    </FormProvider>
  );
};

export default ParticipantForm;
