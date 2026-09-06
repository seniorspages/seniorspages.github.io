import { useState } from "react";
import { Gallery } from "./components/Gallery";
import { ImageModal } from "./components/ImageModal";
import { UploadModal } from "./components/UploadModal";
import { mockPhotos } from "./data/mockPhotos";
import type { Photo } from "./types/photo";

function App() {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);

  const addPhoto = (photo: Photo) => {
    setPhotos((current) => [photo, ...current]);
  };

  return (
    <main>
      <header className="hero">
        <div className="hero-decoration">✦</div>

        <p className="eyebrow">THE YEAR WE'LL NEVER FORGET</p>

        <h1>
          Class of
          <br />
          <span>2026</span>
        </h1>

        <p className="hero-description">
          A little corner of the internet for all the memories we made along the
          way.
        </p>

        <button className="primary-button" onClick={() => setUploadOpen(true)}>
          + Add a memory
        </button>
      </header>

      <section className="gallery-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR MEMORIES</p>
            <h2>The good stuff.</h2>
          </div>

          <span>{photos.length} memories</span>
        </div>

        <Gallery photos={photos} onPhotoClick={setSelectedPhoto} />
      </section>

      <footer>
        <p>made with love by the Class of 2026 ♡</p>
      </footer>

      <ImageModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={addPhoto}
      />
    </main>
  );
}

export default App;
