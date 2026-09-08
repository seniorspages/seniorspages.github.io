import type { Photo } from "../types/photo";

interface Props {
  photo: Photo;
  liked: boolean;
  index: number;
  isAdmin: boolean;
  onClick: () => void;
  onLike: (photoId: string) => void;
  onDelete?: (photo: Photo) => void;
}

export function GalleryCard({
  photo,
  liked,
  index,
  isAdmin,
  onClick,
  onLike,
  onDelete,
}: Props) {
  return (
    <button
      type="button"
      className={`photo-card photo-card-${index % 5}`}
      onClick={onClick}
    >
      <div className="photo-frame">
        <img src={photo.url} alt={photo.caption} loading="lazy" />

        {isAdmin && onDelete && (
          <button
            type="button"
            className="photo-delete-button"
            title="Delete memory"
            onClick={(event) => {
              event.stopPropagation();
              if (
                window.confirm("Are you sure you want to delete this memory?")
              ) {
                onDelete(photo);
              }
            }}
          >
            ✕
          </button>
        )}

        <button
          type="button"
          className={`like-button ${liked ? "liked" : ""}`}
          title={liked ? "Unlike memory" : "Like memory"}
          onClick={(event) => {
            event.stopPropagation();
            onLike(photo.id);
          }}
        >
          <span className="like-icon">{liked ? "♥" : "♡"}</span>
          <span className="like-count">{photo.likeCount}</span>
        </button>
      </div>

      <div className="photo-caption">
        <p>{photo.caption}</p>
        {photo.uploadedBy && <span>— {photo.uploadedBy}</span>}
      </div>
    </button>
  );
}
