import type { Photo } from "../types/photo";

interface Props {
  photo: Photo | null;
  isAdmin?: boolean;
  onClose: () => void;
  onDelete?: (photo: Photo) => void;
}

export function ImageModal({ photo, isAdmin, onClose, onDelete }: Props) {
  if (!photo) return null;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
      onDelete?.(photo);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="image-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="close-button" onClick={onClose}>
          ×
        </button>

        <img src={photo.url} alt={photo.caption} />

        <div className="modal-caption">
          <div className="modal-caption-text">
            <p>{photo.caption}</p>
            {photo.uploadedBy && <span>— {photo.uploadedBy}</span>}
          </div>

          {isAdmin && onDelete && (
            <button
              type="button"
              className="modal-delete-button"
              onClick={handleDelete}
            >
              🗑 Delete memory
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
