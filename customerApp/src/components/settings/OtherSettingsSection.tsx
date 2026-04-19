import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
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
    (s) => (s.settings.other as Record<string, unknown> | undefined)?.signInKeyUrl as string | undefined,
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

  const rotateKey = async (
    endpoint: string,
    responseKey: string,
    setValue: (v: string) => void,
    setGenerating: (v: boolean) => void,
    setError: (v: string | null) => void,
  ) => {
    if (!customerId) return;
    setGenerating(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers/${customerId}/${endpoint}`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) throw new Error(`Fehler beim Generieren (${response.status}).`);
      const data = await response.json();
      setValue(data[responseKey]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = async (value: string, setCopied: (v: boolean) => void) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUploadQr = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch(
      `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/settings/upload-signin-qr`,
      { method: "POST", credentials: "include", body: formData },
    );
    if (!response.ok) throw new Error(`Upload fehlgeschlagen (${response.status}).`);
    const data = await response.json();
    setSettings({ other: { ...(settingsStore.getState().settings.other ?? {}), signInKeyUrl: data.signInKeyUrl } });
    return data.signInKeyUrl;
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
            onRotate={() =>
              rotateKey(
                "rotate-api-key",
                "apiKey",
                setApiKey,
                setIsGeneratingApiKey,
                setApiKeyError,
              )
            }
            onCopy={() => apiKey && copyToClipboard(apiKey, setApiKeyCopied)}
          />

          <APIKeyCardItem
            label="SignIn-Key"
            value={signInKey}
            showQr
            qrImageUrl={signInKeyUrl ?? null}
            onUploadQr={handleUploadQr}
            isGenerating={isGeneratingSignInKey}
            error={signInKeyError}
            disabled={!customerId}
            copied={signInKeyCopied}
            placeholder='Klicke auf „Generieren" um einen neuen SignIn-Key zu erstellen.'
            onRotate={() =>
              rotateKey(
                "rotate-signin-key",
                "signInKey",
                setSignInKey,
                setIsGeneratingSignInKey,
                setSignInKeyError,
              )
            }
            onCopy={() => signInKey && copyToClipboard(signInKey, setSignInKeyCopied)}
          />
        </div>
      )}
    </div>
  );
};

export default OtherSettingsSection;
