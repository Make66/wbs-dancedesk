import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Check, Trash2 } from "lucide-react";
import { RichTextEditor } from "../components/ui/RichTextEditor";
import { getTextById, createTextDB, updateTextDB, deleteTextDB } from "../data/text";
import type { TextItem } from "../types/text-types";

type TextFormValues = {
  name: string;
  description: string;
  type: number;
  text: string;
};

const inputClass =
  "h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-sm focus:outline-none focus:ring-0";

const TextDetailPage = () => {
  const { textId } = useParams<{ textId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, reset, handleSubmit, control, watch, setValue } = useForm<TextFormValues>({
    defaultValues: {
      name: "",
      description: "",
      type: 0,
      text: "",
    },
  });

  const currentType = watch("type");

  useEffect(() => {
    const stateText = (location.state as { text?: TextItem } | null)?.text;

    if (stateText) {
      reset({
        name: stateText.name ?? "",
        description: stateText.description ?? "",
        type: stateText.type ?? 0,
        text: stateText.text ?? "",
      });
      return;
    }

    if (!textId) return;

    getTextById(textId)
      .then((t) =>
        reset({
          name: t.name ?? "",
          description: t.description ?? "",
          type: t.type ?? 0,
          text: t.text ?? "",
        }),
      )
      .catch(console.error);
  }, [textId, location.state, reset]);

  const onSubmit = async (values: TextFormValues) => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const payload = {
        name: values.name.trim(),
        description: values.description.trim(),
        type: values.type,
        text: values.text,
      };

      if (textId) {
        await updateTextDB(textId, payload);
      } else {
        await createTextDB({ ...payload, name: payload.name || "Neuer Text" });
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/settings");
      }, 1000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!textId) return;
    setIsDeleting(true);
    try {
      await deleteTextDB(textId);
      navigate("/settings");
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Fehler beim Löschen.");
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-background">
      <div className="sticky top-0 flex h-20 items-center gap-9 border-b bg-background border-muted-foreground pl-6 z-20">
        <h1 className="text-3xl font-semibold line-clamp-1">
          {textId ? "Text bearbeiten" : "Neuer Text"}
        </h1>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Name *</label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="z. B. Allgemeine Geschäftsbedingungen"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Beschreibung</label>
            <input
              type="text"
              {...register("description")}
              placeholder="Kurze Beschreibung"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Typ</label>
            <Controller
              name="type"
              control={control}
              render={() => (
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { value: 0, label: "AGB" },
                      { value: 1, label: "Info" },
                    ] as const
                  ).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setValue("type", value)}
                      className={`h-12 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                        currentType === value
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-background/40 text-muted-foreground border-muted-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Text</label>
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Textinhalt..."
                />
              )}
            />
          </div>

          <div className="flex items-center gap-3 mt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
            </button>

            {textId && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm text-muted-foreground"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Löschen…" : "Löschen"}
              </button>
            )}

            {saveError && <span className="text-sm text-red-500">{saveError}</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TextDetailPage;
