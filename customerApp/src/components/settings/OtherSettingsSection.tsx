import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import QRCode from "qrcode";
import APIKeyCardItem from "./APIKeyCardItem";
import { settingsStore } from "../../stores/settingsStore";

const OtherSettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGeneratingApiKey, setIsGeneratingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const [signInKey, setSignInKey] = useState<string | null>(null);
  const [isGeneratingSignInKey, setIsGeneratingSignInKey] = useState(false);
  const [signInKeyError, setSignInKeyError] = useState<string | null>(null);
  const [signInKeyCopied, setSignInKeyCopied] = useState(false);

  const signInKeyUrl = settingsStore(
    (s) =>
      (s.settings.other as Record<string, unknown> | undefined)?.signInKeyUrl as string | undefined,
  );
  const setSettings = settingsStore((s) => s.setSettings);

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

      // 2. QR-Code als PNG-Blob erzeugen
      const dataUrl = await QRCode.toDataURL(newKey, {
        type: "image/png",
        width: 400,
        margin: 0.5,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
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
          {loadError && <p className="text-sm text-red-500 pl-1">{loadError}</p>}

          <APIKeyCardItem
            label="API-Key"
            value={apiKey}
            isGenerating={isGeneratingApiKey}
            error={apiKeyError}
            disabled={!customerId}
            copied={apiKeyCopied}
            placeholder='Klicke auf „Generieren" um einen neuen API-Key zu erstellen.'
            onRotate={rotateApiKey}
            onCopy={() => apiKey && copyToClipboard(apiKey, setApiKeyCopied)}
          />

          <APIKeyCardItem
            label="SignIn-Key"
            value={signInKey}
            qrImageUrl={signInKeyUrl ?? null}
            isGenerating={isGeneratingSignInKey}
            error={signInKeyError}
            disabled={!customerId}
            copied={signInKeyCopied}
            placeholder='Klicke auf „Generieren" um einen neuen SignIn-Key zu erstellen.'
            onRotate={rotateSignInKey}
            onCopy={() => signInKey && copyToClipboard(signInKey, setSignInKeyCopied)}
          />
        </div>
      )}
    </div>
  );
};

export default OtherSettingsSection;
