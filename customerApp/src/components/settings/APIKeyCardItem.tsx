import { useRef, useState } from "react";
import { Check, Copy, RefreshCw, Download, Upload } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

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
  qrImageUrl?: string | null;
  onUploadQr?: (file: File) => Promise<string>;
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
  qrImageUrl,
  onUploadQr,
}: APIKeyCardItemProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(qrImageUrl ?? null);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.toLowerCase().replace(/\s+/g, "-")}-qr.png`;
    a.click();
  };

  const handleUpload = async () => {
    if (!onUploadQr || !canvasRef.current) return;
    setIsUploading(true);
    setUploadError(null);
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        setUploadError("QR-Code konnte nicht erstellt werden.");
        setIsUploading(false);
        return;
      }
      try {
        const file = new File([blob], "signin-key-qr.png", { type: "image/png" });
        const url = await onUploadQr(file);
        setUploadedUrl(url);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload fehlgeschlagen.");
      } finally {
        setIsUploading(false);
      }
    }, "image/png");
  };

  return (
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
            <div className="flex flex-col items-center gap-3 pt-2 pb-1">
              <div className="p-3 rounded-2xl bg-white shadow-md">
                <QRCodeCanvas ref={canvasRef} value={value} size={180} />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-orange-500 transition-colors"
                  data-tooltip-id="tooltip"
                  data-tooltip-content="QR-Code als PNG herunterladen"
                  data-tooltip-place="bottom"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">PNG herunterladen</span>
                </button>

                {onUploadQr && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="h-10 flex items-center gap-2 px-4 rounded-xl border border-muted-foreground bg-background/40 cursor-pointer hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    data-tooltip-id="tooltip"
                    data-tooltip-content="QR-Code zu Cloudinary hochladen"
                    data-tooltip-place="bottom"
                  >
                    <Upload className={`w-4 h-4 ${isUploading ? "animate-pulse" : ""}`} />
                    <span className="text-sm">{isUploading ? "Hochladen…" : "Zu Cloudinary"}</span>
                  </button>
                )}
              </div>

              {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

              {uploadedUrl && (
                <div className="w-full flex flex-col gap-2">
                  <img
                    src={uploadedUrl}
                    alt="QR-Code (Cloudinary)"
                    className="w-48 h-48 mx-auto rounded-xl border border-muted-foreground object-contain bg-white"
                  />
                  <a
                    href={uploadedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-muted-foreground text-center truncate hover:text-foreground transition-colors"
                  >
                    {uploadedUrl}
                  </a>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground pl-1">{placeholder}</p>
      )}
    </div>
  );
};

export default APIKeyCardItem;
