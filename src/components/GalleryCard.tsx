import type { Photo } from "../types/photo";

interface Props {
  photo: Photo;
  index: number;
  onClick: () => void;
}

export function GalleryCard({ photo, index, onClick }: Props) {
  return (
    <button className={`photo-card photo-card-${index % 5}`} onClick={onClick}>
      <div className="photo-frame">
        <img src={photo.url} alt={photo.caption} loading="lazy" />
      </div>

      <div className="photo-caption">
        <p>{photo.caption}</p>

        {photo.uploadedBy && <span>— {photo.uploadedBy}</span>}
      </div>
    </button>
  );
}
