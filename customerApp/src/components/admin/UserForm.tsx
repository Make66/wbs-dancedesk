import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Check, Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { getUserById, createUserDB, updateUserDB, deleteUserDB } from "../../data/user";
import { getCustomers } from "../../data/customer";
import { getModules } from "../../data/module";
import type { ModuleItem } from "../../data/module";
import { getLocations } from "../../data/location";
import type { LocationItem } from "../../types/location-types";
import type { CustomerItem } from "../../types/customer-types";
import type { AdminPanelContext, AdminPanelControls } from "../../layouts/AdminLayout";
import { useAuth } from "../../context";

type Props = { id: string | null; ctx?: AdminPanelContext; controls: AdminPanelControls };

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  tenantId: string;
  isActive: boolean;
  modules: string[];
  locations: string[];
};

const inputClass =
  "h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm focus:outline-none";

const UserForm = ({ id, ctx, controls }: Props) => {
  const { user } = useAuth();
  const { closePanel, triggerRefresh } = controls;
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [customers, setCustomers] = useState<CustomerItem[]>([]);
  const [availableModules, setAvailableModules] = useState<ModuleItem[]>([]);
  const [availableLocations, setAvailableLocations] = useState<LocationItem[]>([]);
  const [lastLogin, setLastLogin] = useState<string | null>(null);

  const { register, reset, handleSubmit, watch, setValue, control } = useForm<FormValues>({
    defaultValues: {
      firstName: "", lastName: "", email: "", password: "",
      role: "user", tenantId: ctx?.tenantId ?? user?.tenantId ?? "", isActive: true, modules: [], locations: [],
    },
  });

  const role = watch("role");
  const selectedModules = watch("modules");

  useEffect(() => {
    if (!ctx) getCustomers().then(setCustomers).catch(console.error);
    getModules().then(setAvailableModules).catch(console.error);
    getLocations().then(setAvailableLocations).catch(console.error);
  }, [ctx]);

  useEffect(() => {
    if (!id) return;
    getUserById(id).then((u) => {
      reset({
        firstName: u.firstName ?? "", lastName: u.lastName ?? "",
        email: u.email ?? "", password: "",
        role: u.role ?? "user", tenantId: u.tenantId ?? "",
        isActive: u.isActive ?? true,
        modules: u.modules?.map((m) => m.id) ?? [],
        locations: u.locations?.map((l) => l.id) ?? [],
      });
      setLastLogin(u.lastLogin ?? null);
    }).catch(console.error);
  }, [id, reset]);

  const selectedLocations = watch("locations");

  const toggleModule = (moduleId: string) => {
    const next = selectedModules.includes(moduleId)
      ? selectedModules.filter((m) => m !== moduleId)
      : [...selectedModules, moduleId];
    setValue("modules", next);
  };

  const toggleLocation = (locationId: string) => {
    const next = selectedLocations.includes(locationId)
      ? selectedLocations.filter((l) => l !== locationId)
      : [...selectedLocations, locationId];
    setValue("locations", next);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSaving(true); setSaveError(null); setSaved(false);
    try {
      const payload: Partial<FormValues> = { ...values };
      if (!payload.password) delete payload.password;
      if (ctx?.tenantId) payload.tenantId = ctx.tenantId;
      // locations sent as array of IDs; server uses set: to replace

      if (id) {
        await updateUserDB(id, payload);
      } else {
        await createUserDB(payload);
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
      await deleteUserDB(id);
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
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Vorname *</label>
          <input {...register("firstName", { required: true })} placeholder="Max" className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Nachname *</label>
          <input {...register("lastName", { required: true })} placeholder="Mustermann" className={inputClass} />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">E-Mail *</label>
          <input {...register("email", { required: true })} type="email" placeholder="max@schule.de" className={inputClass} />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">
            {id ? "Neues Passwort (leer lassen = unverändert)" : "Passwort *"}
          </label>
          <input
            {...register("password", { required: !id })}
            type="password"
            placeholder={id ? "••••••••" : "Passwort"}
            className={inputClass}
          />
        </div>

        {/* Module chips */}
        {availableModules.length > 0 && (
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Module</label>
            <div className="flex flex-wrap gap-2">
              {availableModules.map((m) => {
                const active = selectedModules.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleModule(m.id)}
                    style={active ? { backgroundColor: m.color, borderColor: m.color } : undefined}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? "text-white"
                        : "bg-background/40 text-muted-foreground border-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Location chips */}
        {availableLocations.length > 0 && (
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Standorte</label>
            <div className="flex flex-wrap gap-2">
              {availableLocations.map((l) => {
                const active = selectedLocations.includes(l.id);
                return (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => toggleLocation(l.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? "bg-violet-500 text-white border-violet-500"
                        : "bg-background/40 text-muted-foreground border-muted-foreground hover:border-foreground"
                    }`}
                  >
                    {l.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="col-span-2 grid grid-cols-[1fr_auto] items-center gap-x-4 rounded-xl border border-muted-foreground px-4 py-3">
          <span className="text-sm">Admin (!)</span>
          <Switch
            checked={role === "admin"}
            onCheckedChange={(checked) => setValue("role", checked ? "admin" : "user")}
          />
        </div>

        {/* Tenant select only shown when no parent context */}
        {!ctx && (
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs text-muted-foreground pl-1">Kunde / Tenant</label>
            <select
              {...register("tenantId")}
              disabled={!!id}
              className={`h-10 w-full rounded-xl border border-muted-foreground bg-background/40 px-3 text-sm focus:outline-none ${id ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <option value="">– Kunde wählen –</option>
              {customers.map((c) => (
                <option key={c.id} value={c.tenantId}>{c.name}</option>
              ))}
            </select>
          </div>
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

      {id && (
        <p className="text-xs text-muted-foreground pl-1">
          Letzter Login:{" "}
          {lastLogin
            ? new Intl.DateTimeFormat("de-DE", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              }).format(new Date(lastLogin))
            : "–"}
        </p>
      )}

      <div className="flex items-center gap-2 pt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="h-9 flex items-center gap-2 px-3 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-colors disabled:opacity-50 text-sm"
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

export default UserForm;
