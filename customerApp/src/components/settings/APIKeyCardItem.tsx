import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

type APIKeyCardItemProps = {
  label: string;
  value: string | null;
  isGenerating: boolean;
  error: string | null;
  onRotate: () => void;
  onCopy: () => void;
  copied: boolean;
  disabled: boolean;
  placeholder: string;
  qrImageUrl?: string | null;
  readOnly?: boolean;
};

const APIKeyCardItem = ({
  label,
  value,
  isGenerating,
  error,
  onRotate,
  onCopy,
  copied,
  disabled,
  placeholder,
  qrImageUrl,
  readOnly = false,
}: APIKeyCardItemProps) => {
  const [urlCopied, setUrlCopied] = useState(false);

  const handleCopyUrl = async () => {
    if (!qrImageUrl) return;
    await navigator.clipboard.writeText(qrImageUrl);
    setUrlCopied(true);
    setTimeout(() => setUrlCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">{label}</span>
        {!readOnly && (
          <button
            type="button"
            onClick={onRotate}
            disabled={isGenerating || disabled}
            className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-tooltip-id="tooltip"
            data-tooltip-content={`Neuen ${label} generieren`}
            data-tooltip-place="bottom"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
            <span className="text-sm">{isGenerating ? "Generieren…" : "Generieren"}</span>
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {value ? (
        <>
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center justify-between gap-4 h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 cursor-pointer hover:bg-orange-500 transition-colors text-left group"
            data-tooltip-id="tooltip"
            data-tooltip-content="In Zwischenablage kopieren"
            data-tooltip-place="bottom"
          >
            <span className="font-mono text-sm truncate flex-1">{value}</span>
            {copied ? (
              <Check className="w-4 h-4 shrink-0 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
            )}
          </button>

          {qrImageUrl && (
            <>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center justify-between gap-4 h-12 w-full rounded-xl border border-muted-foreground bg-background/40 px-4 cursor-pointer hover:bg-orange-500 transition-colors text-left group"
                data-tooltip-id="tooltip"
                data-tooltip-content="URL in Zwischenablage kopieren"
                data-tooltip-place="bottom"
              >
                <span className="font-mono text-sm truncate flex-1">{qrImageUrl}</span>
                {urlCopied ? (
                  <Check className="w-4 h-4 shrink-0 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                )}
              </button>

              <div className="flex justify-center pt-1">
                <img
                  src={qrImageUrl}
                  alt="QR-Code"
                  className="w-48 h-48 rounded-xl border border-muted-foreground object-contain bg-white p-2"
                />
              </div>
            </>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground pl-1">{placeholder}</p>
      )}
    </div>
  );
};

export default APIKeyCardItem;
