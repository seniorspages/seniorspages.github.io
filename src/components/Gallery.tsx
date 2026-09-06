import type { Photo } from "../types/photo";
import { GalleryCard } from "./GalleryCard";

interface Props {
  photos: Photo[];
  onPhotoClick: (photo: Photo) => void;
}

export function Gallery({ photos, onPhotoClick }: Props) {
  return (
    <section className="gallery">
      {photos.map((photo, index) => (
        <GalleryCard
          key={photo.id}
          photo={photo}
          index={index}
          onClick={() => onPhotoClick(photo)}
        />
      ))}
    </section>
  );
}
