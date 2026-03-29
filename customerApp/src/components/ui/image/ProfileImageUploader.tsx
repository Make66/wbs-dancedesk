import { useEffect, useRef, useState } from "react";
import ImageCropperModal from "./ImageCropperModal";

const ProfileImageUploader = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleOpenFilePicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setIsCropperOpen(true);
    e.target.value = "";
  };

  useEffect(() => {
    if (!selectedFile) {
      // eslint-disable-next-line
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleCloseModal = () => {
    setIsCropperOpen(false);
  };

  const handleSaveCroppedImage = async (blob: Blob) => {
    const file = new File([blob], "profile.jpg", {
      type: "image/jpeg",
    });

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);

    setIsCropperOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <button onClick={handleOpenFilePicker}>
        <div className="flex items-center gap-4 cursor-pointer">
          <img
            src={
              previewUrl ||
              "https://img.freepik.com/vektoren-premium/das-profilbild-des-mannes-avatars-ist-auf-dem-hintergrund-isoliert_1293239-4841.jpg?semt=ais_hybrid&w=740&q=80"
            }
            alt="Vorschau"
            className="h-24 w-24 rounded-full object-cover border"
          />
        </div>
      </button>

      <ImageCropperModal
        open={isCropperOpen}
        imageSrc={previewUrl}
        onClose={handleCloseModal}
        onSave={handleSaveCroppedImage}
        aspect={1}
        title="Profilbild zuschneiden"
        cropShape="round"
      />
    </div>
  );
};

export default ProfileImageUploader;
