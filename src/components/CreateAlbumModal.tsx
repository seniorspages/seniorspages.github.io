import { useState, type FormEvent } from "react";
import type { Album } from "../types/photo";
import { createAlbum } from "../lib/albums";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (album: Album) => void;
}

export function CreateAlbumModal({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || creating) return;

    setError("");
    setCreating(true);

    try {
      const album = await createAlbum(name, description);
      onCreate(album);
      setName("");
      setDescription("");
      onClose();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create album";
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={creating ? undefined : onClose}>
      <div
        className="upload-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          disabled={creating}
        >
          ×
        </button>

        <h2>Create Album 📁</h2>
        <p className="modal-subtitle">
          Organize memories into events, trips, or milestones.
        </p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="caption-input"
            placeholder="Album Name (e.g. Senior Prom 2028)"
            value={name}
            required
            disabled={creating}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            className="caption-input"
            placeholder="Description (optional)"
            value={description}
            disabled={creating}
            onChange={(event) => setDescription(event.target.value)}
          />

          <button
            type="submit"
            className="upload-button"
            disabled={!name.trim() || creating}
          >
            {creating ? (
              <>
                <span className="spinner" />
                Creating...
              </>
            ) : (
              "Create Album ✨"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
