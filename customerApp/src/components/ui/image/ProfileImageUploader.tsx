import { useRef, useState } from "react";
import ImageCropperModal from "./ImageCropperModal";
import { cn } from "../../../lib/utils";

type ImageUploaderProps = {
  id?: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  className?: string;
  imageUrl?: string;
  onChange?: (file: File) => void;
};

const ProfileImageUploader = ({
  id,
  aspect = 1,
  cropShape = "round",
  className,
  imageUrl,
  onChange,
}: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setSelectedImageSrc(objectUrl);
    setIsCropperOpen(true);

    e.target.value = "";
  };

  const handleCloseModal = () => {
    setIsCropperOpen(false);

    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
      setSelectedImageSrc(null);
    }
  };

  const handleSaveCroppedImage = async (blob: Blob) => {
    const file = new File([blob], id ? `${id}.webp` : "profile.webp", {
      type: "image/webp",
    });

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setIsCropperOpen(false);

    if (selectedImageSrc) {
      URL.revokeObjectURL(selectedImageSrc);
      setSelectedImageSrc(null);
    }

    onChange?.(file);
  };

  const displayImage =
    previewUrl ||
    imageUrl ||
    "https://img.freepik.com/vektoren-premium/das-profilbild-des-mannes-avatars-ist-auf-dem-hintergrund-isoliert_1293239-4841.jpg?semt=ais_hybrid&w=740&q=80";

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button onClick={handleOpenFilePicker} type="button" className="w-max cursor-pointer">
        <div className="flex items-center gap-4">
          <img
            src={displayImage}
            alt=""
            className={cn("rounded-full object-cover border", className)}
          />
        </div>
      </button>

      <ImageCropperModal
        open={isCropperOpen}
        imageSrc={selectedImageSrc}
        onClose={handleCloseModal}
        onSave={handleSaveCroppedImage}
        aspect={aspect}
        title="Profilbild zuschneiden"
        cropShape={cropShape}
      />
    </div>
  );
};

export default ProfileImageUploader;
