import { Check, Copy, RefreshCw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

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
  showQr?: boolean;
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
  showQr = false,
}: APIKeyCardItemProps) => (
  <div className="rounded-2xl border border-muted-foreground bg-background/40 p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-lg font-medium">{label}</span>
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
        <span className="text-sm">Generieren</span>
      </button>
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

        {showQr && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="p-3 rounded-2xl bg-white shadow-md">
              <QRCodeSVG value={value} size={180} />
            </div>
          </div>
        )}
      </>
    ) : (
      <p className="text-sm text-muted-foreground pl-1">{placeholder}</p>
    )}
  </div>
);

export default APIKeyCardItem;
