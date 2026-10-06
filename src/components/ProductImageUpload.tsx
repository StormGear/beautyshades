"use client";

import { useState, useRef, useTransition } from "react";
import { uploadImageAction } from "@/app/admin/actions";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";

type ProductImageUploadProps = {
  initialImage?: string;
};

export function ProductImageUpload({ initialImage = "" }: ProductImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [previewUrl, setPreviewUrl] = useState(initialImage);
  const [isUploading, startUploadTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    const formData = new FormData();
    formData.append("file", file);

    startUploadTransition(async () => {
      const res = await uploadImageAction(formData);
      if ("error" in res && res.error) {
        setUploadError(res.error);
        setPreviewUrl(imageUrl);
      } else if (res.url) {
        setImageUrl(res.url);
        setPreviewUrl(res.url);
      }
    });
  };

  const handleRemove = () => {
    setImageUrl("");
    setPreviewUrl("");
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
          Product Image *
        </label>
        <button
          type="button"
          onClick={() => setManualMode(!manualMode)}
          className="flex items-center gap-1.5 text-xs text-pink transition-colors hover:text-ink"
        >
          <LinkIcon className="h-3 w-3" />
          {manualMode ? "Upload file instead" : "Or enter URL"}
        </button>
      </div>

      {/* Hidden inputs for form submission */}
      <input type="hidden" name="image" value={imageUrl} required />

      {manualMode ? (
        <div className="space-y-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setPreviewUrl(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
            className="underline-input"
          />
          {previewUrl && (
            <div className="relative mt-2 h-32 w-32 overflow-hidden rounded-xl bg-blush/60 ring-1 ring-black/5">
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      ) : (
        <div>
          {previewUrl ? (
            <div className="relative flex items-center gap-4 rounded-2xl bg-blush/30 p-4 ring-1 ring-black/5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-blush shadow-inner">
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white backdrop-blur-[2px]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-ink">
                  {isUploading ? (
                    <span className="flex items-center gap-1.5 text-pink">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Uploading to Neon Object Storage...
                    </span>
                  ) : (
                    <span className="text-emerald-700">✓ Stored in Neon Storage</span>
                  )}
                </p>
                <p className="mt-1 truncate font-mono text-[10px] text-muted">
                  {imageUrl || "Uploading..."}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ink ring-1 ring-black/10 hover:bg-black/5 disabled:opacity-50"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-red-600 hover:underline disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/15 bg-blush/20 p-8 transition-colors hover:border-pink/50 hover:bg-blush/40 ${
                isUploading ? "pointer-events-none opacity-60" : ""
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-pink" />
                  <p className="mt-2 text-xs font-medium text-ink">Uploading to Neon Object Storage...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-105">
                    <Upload className="h-5 w-5 text-pink" />
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink">
                    Upload product photo
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    Drag and drop or click to browse (PNG, JPG, WebP up to 10MB)
                  </p>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
}
