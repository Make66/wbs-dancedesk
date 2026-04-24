import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Check, Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { getCustomerById, createCustomerDB, updateCustomerDB, deleteCustomerDB } from "../../data/customer";
import type { AdminPanelControls } from "../../layouts/AdminLayout";

type Props = { id: string | null; controls: AdminPanelControls };

type FormValues = {
  name: string;
  email: string;
  website: string;
  logoUrl: string;
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  street: string;
  city: string;
  zipCode: string;
  tenantId: string;
  isActive: boolean;
};

const inputClass =
  "h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm focus:outline-none";

const CustomerForm = ({ id, controls }: Props) => {
  const { closePanel, triggerRefresh } = controls;
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { register, reset, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      name: "", email: "", website: "", logoUrl: "",
      primary: "#000000", secondary: "#000000", tertiary: "#000000", quaternary: "#000000",
      street: "", city: "", zipCode: "", tenantId: "", isActive: true,
    },
  });

  useEffect(() => {
    if (!id) return;
    getCustomerById(id).then((c) => reset({
      name: c.name ?? "", email: c.email ?? "", website: c.website ?? "", logoUrl: c.logoUrl ?? "",
      primary: c.primary ?? "#000000", secondary: c.secondary ?? "#000000",
      tertiary: c.tertiary ?? "#000000", quaternary: c.quaternary ?? "#000000",
      street: c.street ?? "", city: c.city ?? "", zipCode: c.zipCode ?? "",
      tenantId: c.tenantId ?? "", isActive: c.isActive ?? true,
    })).catch(console.error);
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true); setSaveError(null); setSaved(false);
    try {
      if (id) {
        await updateCustomerDB(id, values);
      } else {
        await createCustomerDB(values);
      }
      setSaved(true);
      triggerRefresh();
      setTimeout(() => { setSaved(false); closePanel(); }, 1000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Fehler beim Speichern.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setIsDeleting(true);
    try {
      await deleteCustomerDB(id);
      triggerRefresh();
      closePanel();
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Fehler beim Löschen.");
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 p-4 overflow-y-auto flex-1">
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Name *</label>
          <input {...register("name", { required: true })} placeholder="Kundenname" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">E-Mail</label>
          <input {...register("email")} type="email" placeholder="info@schule.de" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Website</label>
          <input {...register("website")} placeholder="https://…" className={inputClass} />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Logo-URL</label>
          <input {...register("logoUrl")} placeholder="https://…/logo.png" className={inputClass} />
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground pl-1 mb-1">Farben</p>
          <div className="grid grid-cols-4 gap-2">
            {(["primary", "secondary", "tertiary", "quaternary"] as const).map((key) => (
              <div key={key} className="flex flex-col items-center gap-1">
                <input {...register(key)} type="color" className="h-9 w-full rounded-xl border border-muted-foreground cursor-pointer" />
                <span className="text-xs text-muted-foreground capitalize">{key.slice(0, 3)}.</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Straße</label>
          <input {...register("street")} placeholder="Musterstr. 1" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">PLZ</label>
          <input {...register("zipCode")} placeholder="12345" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Stadt</label>
          <input {...register("city")} placeholder="Musterstadt" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Tenant-ID</label>
          <input {...register("tenantId")} placeholder="UUID" className={inputClass} />
        </div>
        <div className="col-span-2 grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-xl border border-muted-foreground px-4 py-3">
          <span className="text-sm">Aktiv</span>
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="h-9 flex items-center gap-2 px-3 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-colors disabled:opacity-50 text-sm"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Speichern…" : saved ? "Gespeichert" : "Speichern"}
        </button>
        {id && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="h-9 flex items-center gap-2 px-3 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50 text-sm text-muted-foreground"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Löschen…" : "Löschen"}
          </button>
        )}
        {saveError && <span className="text-xs text-red-500">{saveError}</span>}
      </div>
    </form>
  );
};

export default CustomerForm;
