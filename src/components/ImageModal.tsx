import type { Photo } from "../types/photo";

interface Props {
  photo: Photo | null;
  onClose: () => void;
}

export function ImageModal({ photo, onClose }: Props) {
  if (!photo) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="image-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <img src={photo.url} alt={photo.caption} />

        <div className="modal-caption">
          <p>{photo.caption}</p>

          {photo.uploadedBy && <span>— {photo.uploadedBy}</span>}
        </div>
      </div>
    </div>
  );
}
