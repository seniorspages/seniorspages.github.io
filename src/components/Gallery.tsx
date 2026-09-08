import type { Photo } from "../types/photo";
import { GalleryCard } from "./GalleryCard";

interface Props {
  photos: Photo[];
  likedPhotoIds: Set<string>;
  isAdmin: boolean;
  onPhotoClick: (photo: Photo) => void;
  onLike: (photoId: string) => void;
  onDeletePhoto?: (photo: Photo) => void;
}

export function Gallery({
  photos,
  likedPhotoIds,
  isAdmin,
  onPhotoClick,
  onLike,
  onDeletePhoto,
}: Props) {
  if (photos.length === 0) {
    return (
      <div className="gallery-empty">
        <p>No memories in this view yet.</p>
      </div>
    );
  }

  return (
    <section className="gallery">
      {photos.map((photo, index) => (
        <GalleryCard
          key={photo.id}
          photo={photo}
          liked={likedPhotoIds.has(photo.id)}
          index={index}
          isAdmin={isAdmin}
          onClick={() => onPhotoClick(photo)}
          onLike={onLike}
          onDelete={onDeletePhoto}
        />
      ))}
    </section>
  );
}
