import { useState, useEffect } from "react";
import { Settings, RefreshCw, Copy, Check } from "lucide-react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";

const OtherSettingsSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers`,
          { credentials: "include" },
        );
        if (!response.ok) {
          setLoadError(`Fehler beim Laden (${response.status})`);
          return;
        }
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCustomerId(data[0].id);
          if (data[0].apiKey) setApiKey(data[0].apiKey);
        } else {
          setLoadError("Kein Customer-Eintrag gefunden.");
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Netzwerkfehler.");
      }
    };
    fetchCustomer();
  }, []);

  const handleRotate = async () => {
    if (!customerId) return;
    setIsGenerating(true);
    setGenerateError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_AUTH_SERVER_URL}/api/customers/${customerId}/rotate-api-key`,
        { method: "POST", credentials: "include" },
      );
      if (!response.ok) throw new Error(`Fehler beim Generieren (${response.status}).`);
      const data = await response.json();
      setApiKey(data.apiKey);
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    await navigator.clipboard.writeText(apiKey);
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
          <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">API-Key</span>
              <button
                type="button"
                onClick={handleRotate}
                disabled={isGenerating || !customerId}
                className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-tooltip-id="tooltip"
                data-tooltip-content="Neuen API-Key generieren"
                data-tooltip-place="bottom"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                <span className="text-sm">Generieren</span>
              </button>
            </div>

            {loadError && <p className="text-sm text-red-500">{loadError}</p>}
            {generateError && <p className="text-sm text-red-500">{generateError}</p>}

            {apiKey ? (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-between gap-4 h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 cursor-pointer hover:bg-orange-500 transition-colors text-left group"
                data-tooltip-id="tooltip"
                data-tooltip-content="In Zwischenablage kopieren"
                data-tooltip-place="bottom"
              >
                <span className="font-mono text-sm truncate flex-1">{apiKey}</span>
                {copied ? (
                  <Check className="w-4 h-4 shrink-0 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                )}
              </button>
            ) : (
              <p className="text-sm text-muted-foreground pl-1">
                Klicke auf „Generieren" um einen neuen API-Key zu erstellen.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherSettingsSection;
