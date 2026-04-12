import { IoIosClose } from "react-icons/io";
import { useEffect, useState } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ScheduleDatePicker from "../form/ScheduleDatePicker";
import RoomPicker from "../form/RoomPicker";
import ColorFormPicker from "../form/ColorFormPicker";

import { eventFormSchema, type EventFormValues } from "../form/schemas/event-schema";
import { userStore } from "../../stores/userStore";
import { getRooms } from "../../data/rooms";
import type { Room } from "../../types/room-types";
import { createEventDB, deleteEventDB, updateEventDB } from "../../data/event";

type EventModalProps = {
  onClose: () => void;
  onSaved?: () => void | Promise<void>;
  event?: Event;
};

type Event = {
  id: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  color?: string[];
  type?: string;
  street?: string;
  city?: string;
  zipCode?: string;
  longitude?: number;
  latitude?: number;
  startsAt: Date;
  endsAt: Date;
  roomId?: string;
};

const DEFAULT_COLORS: [string, string] = ["#ffffff", "#000000"];

const toColorTuple = (color?: string[]): [string, string] => [
  color?.[0] ?? DEFAULT_COLORS[0],
  color?.[1] ?? DEFAULT_COLORS[1],
];

const EventModal = ({ onClose, onSaved, event }: EventModalProps) => {
  const locationId = userStore((state) => state.selectedLocationId);

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const isEditMode = !!event;

  useEffect(() => {
    if (!locationId) {
      setRooms([]);
      setRoomsLoading(false);
      return;
    }

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

  const methods = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      imageUrl: event?.imageUrl ?? "",
      color: toColorTuple(event?.color),
      type: event?.type ?? "",
      street: event?.street ?? "",
      city: event?.city ?? "",
      zipCode: event?.zipCode ?? "",
      longitude: event?.longitude ?? undefined,
      latitude: event?.latitude ?? undefined,
      startsAt: event?.startsAt ? new Date(event.startsAt) : undefined,
      endsAt: event?.endsAt ? new Date(event.endsAt) : undefined,
      roomId: event?.roomId ?? undefined,
    },
  });

  const {
    reset,
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if (!event) return;

    reset({
      title: event.title ?? "",
      description: event.description ?? "",
      imageUrl: event.imageUrl ?? "",
      color: toColorTuple(event.color),
      type: event.type ?? "",
      street: event.street ?? "",
      city: event.city ?? "",
      zipCode: event.zipCode ?? "",
      longitude: event.longitude ?? undefined,
      latitude: event.latitude ?? undefined,
      startsAt: event.startsAt ? new Date(event.startsAt) : undefined,
      endsAt: event.endsAt ? new Date(event.endsAt) : undefined,
      roomId: event.roomId ?? undefined,
    });
  }, [event, reset]);

  const onSubmit: SubmitHandler<EventFormValues> = async (data) => {
    if (!data.startsAt || !data.endsAt) {
      console.error("Start- oder Enddatum fehlt.");
      return;
    }

    const payload = {
      ...data,
      color: data.color,
      startsAt: data.startsAt.toISOString(),
      endsAt: data.endsAt.toISOString(),
    };

    try {
      const response = isEditMode
        ? await updateEventDB(event.id, payload)
        : await createEventDB(payload);

      const savedEvent = await response.json();
      console.log("Saved event:", savedEvent);

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    try {
      await deleteEventDB(event.id);

      if (onSaved) {
        await onSaved();
      }

      onClose();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-muted-foreground bg-background p-6 shadow-2xl overflow-visible">
        <div className="mb-6 flex items-start justify-between">
          <h3 className="text-2xl font-semibold">
            {isEditMode ? "Event bearbeiten" : "Event erstellen"}
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer"
            aria-label="Modal schließen"
          >
            <IoIosClose size={30} />
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit((data) => {
              console.log("SUBMIT läuft", data);
              onSubmit(data);
            })}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-col gap-2">
              <Input label="Titel" {...register("title")} />
              {errors.title && (
                <p className="ml-1 text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Input label="Beschreibung" {...register("description")} />
              {errors.description && (
                <p className="ml-1 text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <ScheduleDatePicker
                startsAt={watch("startsAt")}
                endsAt={watch("endsAt")}
                onChange={({ startsAt, endsAt }) => {
                  setValue("startsAt", startsAt, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });

                  setValue("endsAt", endsAt, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                className="w-full overflow-hidden rounded-2xl border border-muted-foreground bg-background/40 cursor-pointer"
              />

              {errors.startsAt && (
                <p className="ml-1 text-sm text-destructive">{errors.startsAt.message}</p>
              )}

              {errors.endsAt && (
                <p className="ml-1 text-sm text-destructive">{errors.endsAt.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <RoomPicker
                rooms={rooms}
                isLoading={roomsLoading}
                value={watch("roomId")}
                onChange={(roomId) => {
                  setValue("roomId", roomId, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />

              {errors.roomId && (
                <p className="ml-1 text-sm text-destructive">{errors.roomId.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <ColorFormPicker
                color={watch("color") ?? DEFAULT_COLORS}
                onChange={(colors) => {
                  setValue("color", colors, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
              />

              {errors.color && (
                <p className="ml-1 text-sm text-destructive">{errors.color.message}</p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-end gap-3">
              {isEditMode && (
                <Button type="button" variant="outline" onClick={handleDelete}>
                  Löschen
                </Button>
              )}

              <Button type="submit" size="lg" disabled={isSubmitting}>
                Speichern
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default EventModal;
