import { useEffect, useState } from "react";
import type { Photo } from "../types/photo";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (photo: Photo) => void;
}

export function UploadModal({ open, onClose, onUpload }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState("");

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

  const handleUpload = () => {
    if (!file) return;

    const photo: Photo = {
      id: crypto.randomUUID(),
      url: preview,
      caption: caption || "A memory from our final year",
      uploadedBy: "Anonymous",
      createdAt: new Date().toISOString(),
    };

    onUpload(photo);

    setFile(null);
    setCaption("");
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="upload-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Add a memory 📸</h2>

        <p className="modal-subtitle">
          Leave something behind for everyone to remember.
        </p>

        <label className="file-picker">
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
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        <input
          className="caption-input"
          placeholder="Write a little something..."
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />

        <button
          className="upload-button"
          disabled={!file}
          onClick={handleUpload}
        >
          Add to our memories ✨
        </button>
      </div>
    </div>
  );
}
