import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import type { Room } from "../../types/room-types";
import ProfileImageUploader from "../ui/image/ProfileImageUploader";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import RoomCoursesSection from "./RoomCoursesSection";
import { updateRoom } from "../../data/rooms";
import { toast } from "react-toastify";
import type { Course } from "../../types/course-types";
import { FaRegAddressCard } from "react-icons/fa6";

type RoomFormProps = {
  room?: Room;
};

type RoomFormValues = {
  name: string;
  description: string;
  imageUrl: string;
  capacity: number;
  street: string;
  city: string;
  zipCode: string;
  longitude: number;
  latitude: number;
};

const RoomForm = ({ room }: RoomFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);

  const methods = useForm<RoomFormValues>({
    defaultValues: {
      imageUrl: room?.imageUrl || "",
      name: room?.name || "",
      description: room?.description || "",
      capacity: room?.capacity ?? 20,
      street: room?.street || "",
      city: room?.city || "",
      zipCode: room?.zipCode || "",
      longitude: room?.longitude ?? 0,
      latitude: room?.latitude ?? 0,
    },
  });

  const { register, reset, handleSubmit } = methods;

  useEffect(() => {
    if (!room) return;
    reset({
      imageUrl: room.imageUrl || "",
      name: room.name || "",
      description: room.description || "",
      capacity: room.capacity ?? 20,
      street: room.street || "",
      city: room.city || "",
      zipCode: room.zipCode || "",
      longitude: room.longitude ?? 0,
      latitude: room.latitude ?? 0,
    });
  }, [room, reset]);

  useEffect(() => {
    if (!room) return;
    setCourses([]);
  }, [room]);

  const onSubmit = async (values: RoomFormValues) => {
    try {
      if (!room) return;
      setIsSubmitting(true);
      const finalImageUrl = imageFile ? undefined : values.imageUrl;
      await updateRoom(room.id, {
        name: values.name.trim(),
        description: values.description.trim(),
        capacity: values.capacity,
        street: values.street.trim(),
        city: values.city.trim(),
        zipCode: values.zipCode.trim(),
        longitude: values.longitude,
        latitude: values.latitude,
        imageUrl: finalImageUrl,
        imageFile,
      });
      toast.success("Raum erfolgreich aktualisiert!");
    } catch (error) {
      console.error("Fehler beim Absenden des Formulars:", error);
      toast.error("Fehler beim Aktualisieren des Raums. Bitte versuche es erneut.");
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
              id={room?.id}
              className="h-60 w-80"
              aspect={4 / 3}
              cropShape="rect"
              imageUrl={room?.imageUrl}
              onChange={(file) => setImageFile(file)}
            />
            <Input type="text" label="Name" {...register("name")} className="w-full" />
            <Input
              type="text"
              label="Beschreibung"
              {...register("description")}
              className="w-full"
            />
            <div className="p-4 w-full rounded-2xl bg-blue-400/40 shadow-xl flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-3">
                <FaRegAddressCard className="inline-block text-2xl ml-2 mr-2" />
                <span className="text-lg font-semibold">Adresse</span>
              </div>
              <Input
                type="text"
                label="Straße"
                {...register("street")}
                className="w-full bg-background/50"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input type="text" label="PLZ" {...register("zipCode")} className="w-full" />
                <Input type="text" label="Stadt" {...register("city")} className="w-full" />
              </div>
              <Input
                type="number"
                label="Kapazität"
                {...register("capacity", { valueAsNumber: true })}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Längengrad"
                  {...register("longitude", { valueAsNumber: true })}
                  className="w-full"
                />
                <Input
                  type="number"
                  label="Breitengrad"
                  {...register("latitude", { valueAsNumber: true })}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-8 w-full py-12 text-2xl" disabled={isSubmitting}>
            {isSubmitting ? "Speichern..." : "Speichern"}
          </Button>
        </div>
        <div className="col-span-1">
          {courses.length > 0 && <RoomCoursesSection courses={courses} />}
        </div>
      </form>
    </FormProvider>
  );
};

export default RoomForm;
