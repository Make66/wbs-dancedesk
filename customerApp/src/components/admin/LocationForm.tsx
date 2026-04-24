import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Check, Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { getLocationById, createLocationDB, updateLocationDB, deleteLocationDB } from "../../data/location";
import { getCustomers } from "../../data/customer";
import type { CustomerItem } from "../../types/customer-types";
import type { AdminPanelContext, AdminPanelControls } from "../../layouts/AdminLayout";

type Props = { id: string | null; ctx?: AdminPanelContext; controls: AdminPanelControls };

type FormValues = {
  name: string;
  description: string;
  street: string;
  city: string;
  zipCode: string;
  state: string;
  customerId: string;
  tenantId: string;
  isActive: boolean;
};

const inputClass =
  "h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm focus:outline-none";

const LocationForm = ({ id, ctx, controls }: Props) => {
  const { closePanel, triggerRefresh } = controls;
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);

  const { register, reset, handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      name: "", description: "", street: "", city: "", zipCode: "",
      state: "", customerId: ctx?.customerId ?? "", tenantId: ctx?.tenantId ?? "", isActive: true,
    },
  });

  useEffect(() => {
    if (!ctx) getCustomers().then(setCustomers).catch(console.error);
  }, [ctx]);

  useEffect(() => {
    if (!id) return;
    getLocationById(id).then((l) => reset({
      name: l.name ?? "", description: l.description ?? "",
      street: l.street ?? "", city: l.city ?? "", zipCode: l.zipCode ?? "",
      state: l.state ?? "", customerId: l.customerId ?? "",
      tenantId: l.tenantId ?? "", isActive: l.isActive ?? true,
    })).catch(console.error);
  }, [id, reset]);

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true); setSaveError(null); setSaved(false);
    try {
      const payload = {
        ...values,
        ...(ctx?.tenantId && { tenantId: ctx.tenantId }),
        ...(ctx?.customerId && { customerId: ctx.customerId }),
      };
      if (id) {
        await updateLocationDB(id, payload);
      } else {
        await createLocationDB(payload);
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
      await deleteLocationDB(id);
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
          <input {...register("name", { required: true })} placeholder="Standortname" className={inputClass} />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Beschreibung</label>
          <input {...register("description")} placeholder="Kurze Beschreibung" className={inputClass} />
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
          <label className="text-xs text-muted-foreground pl-1">Bundesland</label>
          <input {...register("state")} placeholder="Bayern" className={inputClass} />
        </div>

        {/* Kunde + Tenant only shown when no parent context */}
        {!ctx && (
          <>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-muted-foreground pl-1">Kunde</label>
              <select {...register("customerId")} className="h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm focus:outline-none">
                <option value="">– kein Kunde –</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-xs text-muted-foreground pl-1">Tenant-ID</label>
              <input {...register("tenantId")} placeholder="UUID" className={inputClass} />
            </div>
          </>
        )}

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
          className="h-9 flex items-center gap-2 px-3 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-violet-500 hover:text-white hover:border-violet-500 transition-colors disabled:opacity-50 text-sm"
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

export default LocationForm;
