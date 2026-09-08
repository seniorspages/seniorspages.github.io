import { useEffect, useState } from "react";
import type { Album, Photo } from "../types/photo";
import { uploadPhoto } from "../lib/photos";

interface Props {
  open: boolean;
  albums: Album[];
  defaultAlbumId?: string | null;
  onClose: () => void;
  onUpload: (photo: Photo) => void;
}

export function UploadModal({
  open,
  albums,
  defaultAlbumId,
  onClose,
  onUpload,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>("");
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedAlbumId(defaultAlbumId ?? "");
    }
  }, [open, defaultAlbumId]);

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

      const photo = await uploadPhoto(
        file,
        caption,
        selectedAlbumId || undefined,
      );

      onUpload(photo);

      setFile(null);
      setCaption("");
      setSelectedAlbumId("");
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
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          disabled={uploading}
        >
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

        {albums.length > 0 && (
          <select
            className="album-select"
            value={selectedAlbumId}
            disabled={uploading}
            onChange={(event) => setSelectedAlbumId(event.target.value)}
          >
            <option value="">No Album (General Memories)</option>
            {albums.map((album) => (
              <option key={album.id} value={album.id}>
                📁 {album.name}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
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
