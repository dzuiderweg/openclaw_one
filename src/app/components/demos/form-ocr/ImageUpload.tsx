import { useRef, useState, useCallback } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface ImageUploadProps {
  onImageSelected: (file: File, dataUrl: string) => void;
  imagePreview: string | null;
  onClear?: () => void;
  label?: string;
}

export function ImageUpload({
  onImageSelected,
  imagePreview,
  onClear,
  label = "Upload a form image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelected(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  if (imagePreview) {
    return (
      <div className="relative rounded-lg border border-neutral-200 bg-white p-4">
        <img
          src={imagePreview}
          alt="Uploaded form"
          className="mx-auto max-h-80 object-contain rounded"
        />
        {onClear && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 right-2"
            onClick={onClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : "border-neutral-300 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100"
        }`}
      >
        <Upload className="mx-auto h-8 w-8 text-neutral-400 mb-3" />
        <p className="text-sm font-medium text-neutral-700">{label}</p>
        <p className="text-xs text-neutral-500 mt-1">
          Drag and drop or click to browse
        </p>
      </button>
    </>
  );
}
