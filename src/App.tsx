import { useEffect, useState } from "react";
import { Gallery } from "./components/Gallery";
import { ImageModal } from "./components/ImageModal";
import { UploadModal } from "./components/UploadModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { CreateAlbumModal } from "./components/CreateAlbumModal";
import { AdminBar } from "./components/AdminBar";
import type { Album, Photo } from "./types/photo";
import { getPhotos, deletePhoto } from "./lib/photos";
import { getAlbums, deleteAlbum } from "./lib/albums";
import { getLikedPhotoIds, likePhoto, unlikePhoto } from "./lib/likes";
import { checkIsAdmin, signOutAdmin } from "./lib/auth";
import { supabase } from "./lib/supabase";

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [createAlbumOpen, setCreateAlbumOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [likedPhotoIds, setLikedPhotoIds] = useState<Set<string>>(new Set());

  // 1. Initial data fetch
  useEffect(() => {
    getPhotos().then(setPhotos).catch(console.error);
    getAlbums().then(setAlbums).catch(console.error);
    getLikedPhotoIds().then(setLikedPhotoIds).catch(console.error);

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkIsAdmin(session.user.id).then(setIsAdmin);
      } else {
        setIsAdmin(false);
      }
    });

    // Listen to auth changes (sign in / sign out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const admin = await checkIsAdmin(session.user.id);
        setIsAdmin(admin);
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Photo upload callback
  const handleAddPhoto = (photo: Photo) => {
    setPhotos((current) => [photo, ...current]);
  };

  // 3. Album creation callback
  const handleAddAlbum = (album: Album) => {
    setAlbums((current) => [album, ...current]);
    setSelectedAlbumId(album.id);
  };

  // 4. Photo deletion
  const handleDeletePhoto = async (photo: Photo) => {
    try {
      await deletePhoto(photo);
      setPhotos((current) => current.filter((p) => p.id !== photo.id));
      if (selectedPhoto?.id === photo.id) {
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error("Failed to delete photo:", error);
      alert("Failed to delete memory. Please check permissions.");
    }
  };

  // 5. Album deletion
  const handleDeleteAlbum = async (albumId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this album? Photos in this album will remain in your general memories.",
      )
    ) {
      return;
    }

    try {
      await deleteAlbum(albumId);
      setAlbums((current) => current.filter((a) => a.id !== albumId));
      // Unlink photos locally
      setPhotos((current) =>
        current.map((p) =>
          p.albumId === albumId ? { ...p, albumId: undefined } : p,
        ),
      );
      setSelectedAlbumId(null);
    } catch (error) {
      console.error("Failed to delete album:", error);
      alert("Failed to delete album. Please check permissions.");
    }
  };

  // 6. Optimistic Like Toggle
  const handleToggleLike = async (photoId: string) => {
    const isCurrentlyLiked = likedPhotoIds.has(photoId);

    // Optimistic UI update
    setLikedPhotoIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyLiked) {
        next.delete(photoId);
      } else {
        next.add(photoId);
      }
      return next;
    });

    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id === photoId) {
          return {
            ...p,
            likeCount: Math.max(0, p.likeCount + (isCurrentlyLiked ? -1 : 1)),
          };
        }
        return p;
      }),
    );

    try {
      if (isCurrentlyLiked) {
        await unlikePhoto(photoId);
      } else {
        await likePhoto(photoId);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
      // Revert optimistic update on error
      setLikedPhotoIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyLiked) {
          next.add(photoId);
        } else {
          next.delete(photoId);
        }
        return next;
      });

      setPhotos((prev) =>
        prev.map((p) => {
          if (p.id === photoId) {
            return {
              ...p,
              likeCount: Math.max(0, p.likeCount + (isCurrentlyLiked ? 1 : -1)),
            };
          }
          return p;
        }),
      );
    }
  };

  // 7. Admin Logout
  const handleSignOut = async () => {
    try {
      await signOutAdmin();
      setIsAdmin(false);
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  // 8. Filtered photos based on selected album
  const filteredPhotos = selectedAlbumId
    ? photos.filter((p) => p.albumId === selectedAlbumId)
    : photos;

  const currentAlbum = albums.find((a) => a.id === selectedAlbumId);

  return (
    <main>
      {isAdmin && (
        <AdminBar
          onNewAlbum={() => setCreateAlbumOpen(true)}
          onSignOut={handleSignOut}
        />
      )}

      <header className="hero">
        <div className="hero-decoration">✦</div>

        <p className="eyebrow">THE YEAR WE'LL NEVER FORGET</p>

        <h1>
          Class of
          <br />
          <span>2028</span>
        </h1>

        <p className="hero-description">
          A little corner of the internet for all the memories we made along the
          way.
        </p>

        <button
          type="button"
          className="primary-button"
          onClick={() => setUploadOpen(true)}
        >
          + Add a memory
        </button>
      </header>

      <section className="gallery-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR MEMORIES</p>
            <h2>The good stuff.</h2>
          </div>

          <span>{filteredPhotos.length} memories</span>
        </div>

        {/* Album Selector Tabs */}
        <div className="album-tabs-container">
          <div className="album-tabs">
            <button
              type="button"
              className={`album-tab ${selectedAlbumId === null ? "active" : ""}`}
              onClick={() => setSelectedAlbumId(null)}
            >
              All Memories ({photos.length})
            </button>

            {albums.map((album) => {
              const count = photos.filter((p) => p.albumId === album.id).length;
              return (
                <button
                  type="button"
                  key={album.id}
                  className={`album-tab ${selectedAlbumId === album.id ? "active" : ""}`}
                  onClick={() => setSelectedAlbumId(album.id)}
                >
                  📁 {album.name} ({count})
                </button>
              );
            })}

            {isAdmin && (
              <button
                type="button"
                className="create-album-tab-btn"
                onClick={() => setCreateAlbumOpen(true)}
              >
                + New Album
              </button>
            )}
          </div>
        </div>

        {/* Selected Album Details Banner */}
        {currentAlbum && (
          <div className="album-banner">
            <div className="album-banner-info">
              <h3>{currentAlbum.name}</h3>
              {currentAlbum.description && <p>{currentAlbum.description}</p>}
            </div>

            {isAdmin && (
              <button
                type="button"
                className="delete-album-btn"
                onClick={() => handleDeleteAlbum(currentAlbum.id)}
              >
                🗑 Delete Album
              </button>
            )}
          </div>
        )}

        <Gallery
          photos={filteredPhotos}
          likedPhotoIds={likedPhotoIds}
          isAdmin={isAdmin}
          onPhotoClick={setSelectedPhoto}
          onLike={handleToggleLike}
          onDeletePhoto={handleDeletePhoto}
        />
      </section>

      <footer>
        <p>made with love by the Class of 2028 ♡</p>
        <div className="footer-admin">
          {isAdmin ? (
            <button
              type="button"
              className="admin-login-link"
              onClick={handleSignOut}
            >
              Admin Mode Active • Log Out
            </button>
          ) : (
            <button
              type="button"
              className="admin-login-link"
              onClick={() => setLoginOpen(true)}
            >
              Admin Login
            </button>
          )}
        </div>
      </footer>

      <ImageModal
        photo={selectedPhoto}
        isAdmin={isAdmin}
        onClose={() => setSelectedPhoto(null)}
        onDelete={handleDeletePhoto}
      />

      <UploadModal
        open={uploadOpen}
        albums={albums}
        defaultAlbumId={selectedAlbumId}
        onClose={() => setUploadOpen(false)}
        onUpload={handleAddPhoto}
      />

      <AdminLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => setIsAdmin(true)}
      />

      <CreateAlbumModal
        open={createAlbumOpen}
        onClose={() => setCreateAlbumOpen(false)}
        onCreate={handleAddAlbum}
      />
    </main>
  );
}

export default App;
