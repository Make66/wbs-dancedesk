import { FormProvider, useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import ProfileImageUploader from "../ui/image/ImageUploader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createPostDB, updatePostDB } from "../../data/post";
import { getCoursesDB } from "../../data/course";
import { getEventsDB } from "../../data/event";
import type { Post } from "../../types/post-types";
import type { Course } from "../../types/course-types";
import type { Event } from "../../data/event";
import { toast } from "react-toastify";

type PostFormProps = {
  post?: Post;
};

type PostFormValues = {
  title: string;
  teaser: string;
  text: string;
  author: string;
  date: string;
  startsAt: string;
  endsAt: string;
  courseId: string;
  eventId: string;
  isActive: boolean;
  isArchived: boolean;
  isTopPost: boolean;
  imageUrl: string;
};

const toDatetimeLocal = (iso: string | null | undefined): string => {
  if (!iso) return "";
  try {
    return new Date(iso).toISOString().slice(0, 16);
  } catch {
    return "";
  }
};

const toISOString = (local: string): string => {
  if (!local) return "";
  try {
    return new Date(local).toISOString();
  } catch {
    return "";
  }
};

const PostForm = ({ post }: PostFormProps) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const navigate = useNavigate();

  const methods = useForm<PostFormValues>({
    defaultValues: {
      title: post?.title ?? "",
      teaser: post?.teaser ?? "",
      text: post?.text ?? "",
      author: post?.author ?? "",
      date: toDatetimeLocal(post?.date) || new Date().toISOString().slice(0, 16),
      startsAt: toDatetimeLocal(post?.startsAt),
      endsAt: toDatetimeLocal(post?.endsAt),
      courseId: post?.courseId ?? "",
      eventId: post?.eventId ?? "",
      isActive: post?.isActive ?? true,
      isArchived: post?.isArchived ?? false,
      isTopPost: post?.isTopPost ?? false,
      imageUrl: post?.imageUrl ?? "",
    },
  });

  const { register, reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (!post) return;
    reset({
      title: post.title ?? "",
      teaser: post.teaser ?? "",
      text: post.text ?? "",
      author: post.author ?? "",
      date: toDatetimeLocal(post.date),
      startsAt: toDatetimeLocal(post.startsAt),
      endsAt: toDatetimeLocal(post.endsAt),
      courseId: post.courseId ?? "",
      eventId: post.eventId ?? "",
      isActive: post.isActive,
      isArchived: post.isArchived,
      isTopPost: post.isTopPost,
      imageUrl: post.imageUrl ?? "",
    });
  }, [post, reset]);

  useEffect(() => {
    const loadRelations = async () => {
      try {
        const [coursesData, eventsData] = await Promise.all([getCoursesDB(), getEventsDB()]);
        setCourses(coursesData.filter((c) => !c.isDeleted && c.isActive));
        setEvents(eventsData.filter((e) => !e.isDeleted && e.isActive));
      } catch (error) {
        console.error("Error loading courses/events:", error);
      }
    };
    loadRelations();
  }, []);

  const onSubmit = async (values: PostFormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        title: values.title.trim(),
        teaser: values.teaser.trim(),
        text: values.text.trim(),
        author: values.author.trim(),
        date: toISOString(values.date),
        startsAt: toISOString(values.startsAt),
        endsAt: toISOString(values.endsAt),
        courseId: values.courseId || null,
        eventId: values.eventId || null,
        isActive: values.isActive,
        isArchived: values.isArchived,
        isTopPost: values.isTopPost,
        imageUrl: imageFile ? undefined : values.imageUrl,
        imageFile,
      };

      if (post) {
        await updatePostDB(post.id, payload);
        toast.success("Beitrag erfolgreich aktualisiert!");
      } else {
        await createPostDB(payload);
        toast.success("Beitrag erfolgreich erstellt!");
      }
      navigate("/posts");
    } catch (error) {
      console.error("Fehler beim Absenden des Formulars:", error);
      toast.error("Fehler beim Speichern des Beitrags. Bitte versuche es erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex flex-col gap-6 max-w-2xl">
        <div className="relative">
          <ProfileImageUploader
            id={post?.id}
            className="h-64 w-full"
            cropShape="rect"
            aspect={16 / 9}
            imageUrl={post?.imageUrl}
            fallbackSrc="/assets/images/no-post.jpg"
            onChange={(file) => setImageFile(file)}
          />
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-xl px-3 py-2 border border-border shadow-sm">
            <span className="text-xs font-medium">Top-Beitrag</span>
            <Controller
              name="isTopPost"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>

        <Input type="text" label="Titel *" {...register("title", { required: true })} className="w-full" />
        <Input type="text" label="Teaser" {...register("teaser")} className="w-full" />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Text *</label>
          <textarea
            {...register("text", { required: true })}
            rows={8}
            className="w-full rounded-xl border border-muted-foreground bg-background/40 px-5 py-4 text-sm resize-y outline-none focus:border-3 dark:focus:border-zinc-500"
            placeholder="Inhalt des Beitrags..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Datum</label>
          <Input type="datetime-local" {...register("date")} className="w-full" />
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-muted-foreground">Gültig von</label>
            <Input type="datetime-local" {...register("startsAt")} className="w-full" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-muted-foreground">Gültig bis</label>
            <Input type="datetime-local" {...register("endsAt")} className="w-full" />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center justify-between flex-1 rounded-xl border border-border px-4 py-3">
            <span className="text-sm">Aktiv</span>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
          <div className="flex items-center justify-between flex-1 rounded-xl border border-border px-4 py-3">
            <span className="text-sm">Archiviert</span>
            <Controller
              name="isArchived"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-muted-foreground">Kurs (optional)</label>
            <select
              {...register("courseId")}
              className="w-full rounded-xl border border-muted-foreground bg-background/40 px-5 py-3 text-sm outline-none focus:border-3 dark:focus:border-zinc-500"
            >
              <option value="">– kein Kurs –</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-sm text-muted-foreground">Event (optional)</label>
            <select
              {...register("eventId")}
              className="w-full rounded-xl border border-muted-foreground bg-background/40 px-5 py-3 text-sm outline-none focus:border-3 dark:focus:border-zinc-500"
            >
              <option value="">– kein Event –</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title ?? event.id}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button type="submit" className="w-full py-12 text-2xl" disabled={isSubmitting}>
          {isSubmitting ? "Speichern..." : "Speichern"}
        </Button>
      </form>
    </FormProvider>
  );
};

export default PostForm;
