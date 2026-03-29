import { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "../button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../dialog";
import { getCroppedImage } from "./getCroppedImage";

type ImageCropperModalProps = {
  open: boolean;
  imageSrc: string | null;
  onClose: () => void;
  onSave: (croppedBlob: Blob) => void;
  aspect?: number;
  title?: string;
  cropShape?: "rect" | "round";
};

type CroppedAreaPixels = {
  width: number;
  height: number;
  x: number;
  y: number;
};

const ImageCropperModal = ({
  open,
  imageSrc,
  onClose,
  onSave,
  aspect = 1,
  title = "Bild zuschneiden",
  cropShape = "rect",
}: ImageCropperModalProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels || isSaving) return;

    try {
      setIsSaving(true);
      const croppedBlob = await getCroppedImage(imageSrc, croppedAreaPixels);
      console.log("Cropped Blob:", croppedBlob);
      onSave(croppedBlob);
    } catch (error) {
      console.error("Crop failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetCropState = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  };

  const handleClose = () => {
    if (isSaving) return;
    resetCropState();
    onClose();
  };

  useEffect(() => {
    if (!open || !imageSrc) return;
    resetCropState();
  }, [open, imageSrc]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="relative h-100 w-full bg-black rounded-xl overflow-hidden">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              cropShape={cropShape}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => {
                setCroppedAreaPixels(croppedAreaPixels);
              }}
            />
          )}
        </div>

        <div className="mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Abbrechen
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Speichern..." : "Speichern"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropperModal;
