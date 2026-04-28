import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Save, Check, Trash2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { getCustomerById, createCustomerDB, updateCustomerDB, deleteCustomerDB } from "../../data/customer";
import type { AdminPanelControls } from "../../layouts/AdminLayout";
import QRCode from "qrcode";
import APIKeyCardItem from "../settings/APIKeyCardItem";
import ConfirmationModal from "../ui/confirmationModal";

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

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const [signInKey, setSignInKey] = useState<string | null>(null);
  const [signInKeyUrl, setSignInKeyUrl] = useState<string | null>(null);
  const [isGeneratingSignInKey, setIsGeneratingSignInKey] = useState(false);
  const [signInKeyError, setSignInKeyError] = useState<string | null>(null);
  const [signInKeyCopied, setSignInKeyCopied] = useState(false);
  const [pendingRotate, setPendingRotate] = useState<"api" | "signIn" | null>(null);

  const { register, reset, handleSubmit, watch, control } = useForm<FormValues>({
    defaultValues: {
      name: "", email: "", website: "", logoUrl: "",
      primary: "#000000", secondary: "#000000", tertiary: "#000000", quaternary: "#000000",
      street: "", city: "", zipCode: "", tenantId: "", isActive: true,
    },
  });

  useEffect(() => {
    if (!id) return;
    getCustomerById(id).then((c) => {
      reset({
        name: c.name ?? "", email: c.email ?? "", website: c.website ?? "", logoUrl: c.logoUrl ?? "",
        primary: c.primary ?? "#000000", secondary: c.secondary ?? "#000000",
        tertiary: c.tertiary ?? "#000000", quaternary: c.quaternary ?? "#000000",
        street: c.street ?? "", city: c.city ?? "", zipCode: c.zipCode ?? "",
        tenantId: c.tenantId ?? "", isActive: c.isActive ?? true,
      });
      if (c.apiKey) setApiKey(c.apiKey);
      if (c.signInKey) setSignInKey(c.signInKey);
      if (c.signInKeyUrl) setSignInKeyUrl(c.signInKeyUrl);
    }).catch(console.error);
  }, [id, reset]);

  const rotateApiKey = async () => {
    if (!id) return;
    setIsGeneratingApiKey(true);
    setApiKeyError(null);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers/${id}/rotate-api-key`,
        { method: "POST", credentials: "include" },
      );
      if (!res.ok) throw new Error(`Fehler beim Generieren (${res.status}).`);
      const data = await res.json();
      setApiKey(data.apiKey);
    } catch (e) {
      setApiKeyError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setIsGeneratingApiKey(false);
    }
  };

  const rotateSignInKey = async () => {
    if (!id) return;
    setIsGeneratingSignInKey(true);
    setSignInKeyError(null);
    try {
      const rotateRes = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers/${id}/rotate-signin-key`,
        { method: "POST", credentials: "include" },
      );
      if (!rotateRes.ok) throw new Error(`Fehler beim Generieren (${rotateRes.status}).`);
      const { signInKey: newKey } = await rotateRes.json();
      setSignInKey(newKey);

      const customerName = watch("name");
      const qrSize = 450;
      const fontSize = 33;
      const padding = 12;
      const labelHeight = fontSize + padding * 2;
      const dataUrl = await QRCode.toDataURL(newKey, { type: "image/png", width: qrSize, margin: 0.5 });
      const qrImg = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = dataUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = qrSize;
      canvas.height = qrSize + labelHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
      ctx.fillStyle = "#000000";
      ctx.font = `${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(customerName ?? "", qrSize / 2, qrSize + labelHeight / 2, qrSize - padding * 2);
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))), "image/png"),
      );
      const formData = new FormData();
      formData.append("image", new File([blob], "signin-key-qr.png", { type: "image/png" }));
      const uploadRes = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings/upload-signin-qr`,
        { method: "POST", credentials: "include", body: formData },
      );
      if (!uploadRes.ok) throw new Error(`Upload fehlgeschlagen (${uploadRes.status}).`);
      const { signInKeyUrl: newUrl } = await uploadRes.json();
      setSignInKeyUrl(newUrl);
    } catch (e) {
      setSignInKeyError(e instanceof Error ? e.message : "Unbekannter Fehler.");
    } finally {
      setIsGeneratingSignInKey(false);
    }
  };

  const copyToClipboard = async (value: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-3 p-4 overflow-y-auto flex-1"
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Name *</label>
          <input
            {...register("name", { required: true })}
            placeholder="Kundenname"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">E-Mail</label>
          <input
            {...register("email")}
            type="email"
            placeholder="info@schule.de"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Website</label>
          <input
            {...register("website")}
            placeholder="https://…"
            className={inputClass}
          />
        </div>
        <div className="col-span-2 flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Logo-URL</label>
          <input
            {...register("logoUrl")}
            placeholder="https://…/logo.png"
            className={inputClass}
          />
        </div>
        <div className="col-span-2">
          <p className="text-xs text-muted-foreground pl-1 mb-1">Farben</p>
          <div className="grid grid-cols-4 gap-2">
            {(["primary", "secondary", "tertiary", "quaternary"] as const).map(
              (key) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <input
                    {...register(key)}
                    type="color"
                    className="h-9 w-full rounded-xl border border-muted-foreground cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground capitalize">
                    {key.slice(0, 3)}.
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Straße</label>
          <input
            {...register("street")}
            placeholder="Musterstr. 1"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">PLZ</label>
          <input
            {...register("zipCode")}
            placeholder="12345"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">Stadt</label>
          <input
            {...register("city")}
            placeholder="Musterstadt"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-muted-foreground pl-1">
            Tenant-ID
          </label>
          <input
            {...register("tenantId")}
            placeholder="UUID"
            className={inputClass}
          />
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

      {id && (
        <>
          <APIKeyCardItem
            label="API-Key"
            value={apiKey}
            isGenerating={isGeneratingApiKey}
            error={apiKeyError}
            disabled={false}
            copied={apiKeyCopied}
            placeholder='Klicke auf „Generieren" um einen neuen API-Key zu erstellen.'
            onRotate={() => setPendingRotate("api")}
            onCopy={() => apiKey && copyToClipboard(apiKey, setApiKeyCopied)}
          />
          <APIKeyCardItem
            label="SignIn-Key"
            value={signInKey}
            qrImageUrl={signInKeyUrl}
            isGenerating={isGeneratingSignInKey}
            error={signInKeyError}
            disabled={false}
            copied={signInKeyCopied}
            placeholder='Klicke auf „Generieren" um einen neuen SignIn-Key zu erstellen.'
            onRotate={() => setPendingRotate("signIn")}
            onCopy={() => signInKey && copyToClipboard(signInKey, setSignInKeyCopied)}
          />
        </>
      )}

      <ConfirmationModal
        isOpen={pendingRotate !== null}
        title={`${pendingRotate === "api" ? "API-Key" : "SignIn-Key"} neu generieren?`}
        description="Der bisherige Schlüssel wird sofort ungültig. Alle Integrationen müssen aktualisiert werden."
        confirmText="Generieren"
        isDestructive
        onConfirm={async () => {
          if (pendingRotate === "api") await rotateApiKey();
          else if (pendingRotate === "signIn") await rotateSignInKey();
          setPendingRotate(null);
        }}
        onCancel={() => setPendingRotate(null)}
      />

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
