import { useState, useEffect } from "react";
import { Settings, Save, Check } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import QRCode from "qrcode";
import APIKeyCardItem from "./APIKeyCardItem";
import { settingsStore } from "../../stores/settingsStore";

const FEDERAL_STATES: { value: string; label: string }[] = [
  { value: "BW", label: "Baden-Württemberg" },
  { value: "BY", label: "Bayern" },
  { value: "BE", label: "Berlin" },
  { value: "BB", label: "Brandenburg" },
  { value: "HB", label: "Bremen" },
  { value: "HH", label: "Hamburg" },
  { value: "HE", label: "Hessen" },
  { value: "MV", label: "Mecklenburg-Vorpommern" },
  { value: "NI", label: "Niedersachsen" },
  { value: "NW", label: "Nordrhein-Westfalen" },
  { value: "RP", label: "Rheinland-Pfalz" },
  { value: "SL", label: "Saarland" },
  { value: "SN", label: "Sachsen" },
  { value: "ST", label: "Sachsen-Anhalt" },
  { value: "SH", label: "Schleswig-Holstein" },
  { value: "TH", label: "Thüringen" },
];

const OtherSettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const [signInKey, setSignInKey] = useState<string | null>(null);
  const [isGeneratingSignInKey, setIsGeneratingSignInKey] = useState(false);
  const [signInKeyError, setSignInKeyError] = useState<string | null>(null);
  const [signInKeyCopied, setSignInKeyCopied] = useState(false);

  const [isSavingBasic, setIsSavingBasic] = useState(false);
  const [basicSaved, setBasicSaved] = useState(false);
  const [basicError, setBasicError] = useState<string | null>(null);

  const signInKeyUrl = settingsStore(
    (s) =>
      (s.settings.other as Record<string, unknown> | undefined)?.signInKeyUrl as string | undefined,
  );
  const basic = settingsStore((s) => s.settings.basic);
  const setSettings = settingsStore((s) => s.setSettings);

  const [localBasic, setLocalBasic] = useState({
    domain: "",
    federalState: "",
    termsUri: "",
    privacyUri: "",
    cancellationUri: "",
    cancellationSampleUri: "",
  });

  useEffect(() => {
    setLocalBasic({
      domain: basic.domain ?? "",
      federalState: basic.federalState ?? "",
      termsUri: basic.termsUri ?? "",
      privacyUri: basic.privacyUri ?? "",
      cancellationUri: basic.cancellationUri ?? "",
      cancellationSampleUri: basic.cancellationSampleUri ?? "",
    });
  }, [basic]);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers`, {
          credentials: "include",
        });
        if (!response.ok) {
          setLoadError(`Fehler beim Laden (${response.status})`);
          return;
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomerId(data[0].id);
          setCustomerName(data[0].name ?? null);
          if (data[0].apiKey) setApiKey(data[0].apiKey);
          if (data[0].signInKey) setSignInKey(data[0].signInKey);
        } else {
          setLoadError("Kein Customer-Eintrag gefunden.");
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Netzwerkfehler.");
      }
    };
    fetchCustomer();
  }, []);

  const rotateApiKey = async () => {
    if (!customerId) return;
    setIsGeneratingApiKey(true);
    setApiKeyError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers/${customerId}/rotate-api-key`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) throw new Error(`Fehler beim Generieren (${response.status}).`);
      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      setApiKeyError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsGeneratingApiKey(false);
    }
  };

  const rotateSignInKey = async () => {
    if (!customerId) return;
    setIsGeneratingSignInKey(true);
    setSignInKeyError(null);
    try {
      // 1. Neuen SignIn-Key generieren
      const rotateRes = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers/${customerId}/rotate-signin-key`,
        { method: "POST", credentials: "include" },
      );
      if (!rotateRes.ok) throw new Error(`Fehler beim Generieren (${rotateRes.status}).`);
      const { signInKey: newKey } = await rotateRes.json();
      setSignInKey(newKey);

      // 2. QR-Code als PNG mit Tanzschulname erzeugen
      const qrSize = 450;
      const fontSize = 33;
      const padding = 12;
      const labelHeight = fontSize + padding * 2;
      const dataUrl = await QRCode.toDataURL(newKey, {
        type: "image/png",
        width: qrSize,
        margin: 0.5,
      });
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
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Canvas toBlob failed"))),
          "image/png",
        ),
      );
      const file = new File([blob], "signin-key-qr.png", { type: "image/png" });

      // 3. Zu Cloudinary hochladen
      const formData = new FormData();
      formData.append("image", file);
      const uploadRes = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings/upload-signin-qr`,
        { method: "POST", credentials: "include", body: formData },
      );
      if (!uploadRes.ok) throw new Error(`Upload fehlgeschlagen (${uploadRes.status}).`);
      const { signInKeyUrl: newUrl } = await uploadRes.json();

      // 4. Store aktualisieren
      setSettings({
        other: { ...(settingsStore.getState().settings.other ?? {}), signInKeyUrl: newUrl },
      });
    } catch (error) {
      setSignInKeyError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsGeneratingSignInKey(false);
    }
  };

  const saveBasic = async () => {
    setIsSavingBasic(true);
    setBasicError(null);
    setBasicSaved(false);
    try {
      const payload = Object.fromEntries(
        Object.entries(localBasic).filter(([, v]) => v !== ""),
      );
      const response = await fetch(`${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ basic: payload }),
      });
      if (!response.ok) throw new Error(`Fehler beim Speichern (${response.status}).`);
      setSettings({ basic: payload });
      setBasicSaved(true);
      setTimeout(() => setBasicSaved(false), 2000);
    } catch (error) {
      setBasicError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsSavingBasic(false);
    }
  };

  const copyToClipboard = async (value: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 bg-orange-400/60 rounded-2xl">
      <div
        className="flex items-center justify-between ml-2 cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <div className="flex items-center gap-4">
          <Settings className="w-6 h-6" />
          <h3 className="font-semibold text-2xl">Sonstiges</h3>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="text-2xl mr-2" />
        ) : (
          <RiArrowDownSLine className="text-2xl mr-2" />
        )}
      </div>

      {isOpen && (
        <div className="mt-4 flex flex-col gap-3">
          {/* Basic config fields */}
          <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
            <span className="text-lg font-medium">Grundeinstellungen</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(
                [
                  { key: "domain", label: "Domain", placeholder: "https://example.com" },
                  { key: "termsUri", label: "AGB-URL", placeholder: "https://example.com/agb" },
                  { key: "privacyUri", label: "Datenschutz-URL", placeholder: "https://example.com/datenschutz" },
                  { key: "cancellationUri", label: "Widerruf-URL", placeholder: "https://example.com/widerruf" },
                  { key: "cancellationSampleUri", label: "Widerrufsmuster-URL", placeholder: "https://example.com/muster" },
                ] as { key: keyof typeof localBasic; label: string; placeholder: string }[]
              ).map(({ key, label, placeholder }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground pl-1">{label}</label>
                  <input
                    type="text"
                    value={localBasic[key]}
                    onChange={(e) => setLocalBasic((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-sm focus:outline-none focus:ring-0"
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1">
                <label className="text-xs text-muted-foreground pl-1">Bundesland</label>
                <select
                  value={localBasic.federalState}
                  onChange={(e) => setLocalBasic((prev) => ({ ...prev, federalState: e.target.value }))}
                  className="h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 text-sm focus:outline-none focus:ring-0"
                >
                  <option value="">– bitte wählen –</option>
                  {FEDERAL_STATES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                onClick={saveBasic}
                disabled={isSavingBasic}
                className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {basicSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {isSavingBasic ? "Speichern…" : basicSaved ? "Gespeichert" : "Speichern"}
              </button>
              {basicError && <span className="text-sm text-red-500">{basicError}</span>}
            </div>
          </div>

          {loadError && <p className="text-sm text-red-500 pl-1">{loadError}</p>}

          <APIKeyCardItem
            label="API-Key"
            value={apiKey}
            isGenerating={false}
            error={apiKeyError}
            disabled={false}
            copied={apiKeyCopied}
            placeholder="Kein API-Key vorhanden."
            readOnly
            onRotate={() => {}}
            onCopy={() => apiKey && copyToClipboard(apiKey, setApiKeyCopied)}
          />

          <APIKeyCardItem
            label="SignIn-Key"
            value={signInKey}
            qrImageUrl={signInKeyUrl ?? null}
            isGenerating={false}
            error={signInKeyError}
            disabled={false}
            copied={signInKeyCopied}
            placeholder="Kein SignIn-Key vorhanden."
            readOnly
            onRotate={() => {}}
            onCopy={() => signInKey && copyToClipboard(signInKey, setSignInKeyCopied)}
          />
        </div>
      )}
    </div>
  );
};

export default OtherSettingsSection;
