import { useEffect, useState } from "react";
import type { Photo } from "../types/photo";
import { uploadPhoto } from "../lib/photos";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (photo: Photo) => void;
}

export function UploadModal({ open, onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!open) return null;

  const handleUpload = async () => {
    if (!file || uploading) return;

    try {
      setUploading(true);

      const photo = await uploadPhoto(file, caption);

      onUpload(photo);

      setFile(null);
      setCaption("");
      onClose();
    } catch (error) {
      console.error("Failed to upload photo:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={uploading ? undefined : onClose}>
      <div
        className="upload-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-button" onClick={onClose} disabled={uploading}>
          ×
        </button>

        <h2>Add a memory 📸</h2>

        <p className="modal-subtitle">
          Leave something behind for everyone to remember.
        </p>

        <label className={`file-picker ${uploading ? "disabled" : ""}`}>
          {preview ? (
            <img src={preview} alt="Preview" />
          ) : (
            <>
              <span>＋</span>
              <strong>Choose a photo</strong>
              <small>JPG, PNG or WebP</small>
            </>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <input
          className="caption-input"
          placeholder="Write a little something..."
          value={caption}
          disabled={uploading}
          onChange={(event) => setCaption(event.target.value)}
        />

        <button
          className="upload-button"
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? (
            <>
              <span className="spinner" />
              Uploading...
            </>
          ) : (
            "Add to our memories ✨"
          )}
        </button>
      </div>
    </div>
  );
}
