interface Props {
  instagramUrl?: string;
  tiktokUrl?: string;
  instagramHandle?: string;
  tiktokHandle?: string;
}

function TikTokIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.323 0 .633.052.923.149V9.45a6.31 6.31 0 0 0-.923-.067 6.34 6.34 0 0 0-6.335 6.336 6.34 6.34 0 0 0 6.335 6.336 6.34 6.34 0 0 0 6.336-6.336V9.01a8.17 8.17 0 0 0 4.77 1.524V7.089a4.8 4.8 0 0 1-1.005-.403z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.5" />
    </svg>
  );
}

export function SocialLinks({
  instagramUrl = "https://www.instagram.com/nls.juniors.27?stkn=dXQwMXRxYmd3ZGJk",
  tiktokUrl = "https://www.tiktok.com/@nls.juniors.27?_r=1&_t=ZS-99aVDTks8hs",
//   instagramHandle = "@classof2028",
//   tiktokHandle = "@classof2028",
}: Props) {
  return (
    <section className="social-section" aria-label="Social media links">
      <div className="social-heading">
        <p className="eyebrow">✦ STAY CONNECTED ✦</p>
        <h2>The feed doesn't stop here.</h2>
        <p className="social-description">
          Catch the behind-the-scenes moments, photo dumps, and daily chaos on
          our socials.
        </p>
      </div>

      <div className="social-badges-grid">
        {/* TikTok Sticker Badge */}
        <a
          href={tiktokUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="social-badge-card social-badge-tiktok"
        //   title={`Visit TikTok (${tiktokHandle})`}
        >
          <div className="social-badge-icon-wrapper">
            <TikTokIcon />
          </div>

          <div className="social-badge-content">
            <div className="social-badge-header">
              <h3 className="social-badge-title">TikTok</h3>
              <span className="social-badge-arrow">↗</span>
            </div>
            <span className="social-badge-tagline">the bloopers & vlogs</span>
            {/* <span className="social-badge-handle">{tiktokHandle}</span> */}
          </div>
        </a>

        {/* Instagram Sticker Badge */}
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="social-badge-card social-badge-instagram"
        //   title={`Visit Instagram (${instagramHandle})`}
        >
          <div className="social-badge-icon-wrapper">
            <InstagramIcon />
          </div>

          <div className="social-badge-content">
            <div className="social-badge-header">
              <h3 className="social-badge-title">Instagram</h3>
              <span className="social-badge-arrow">↗</span>
            </div>
            <span className="social-badge-tagline">
              the photo dumps & reels
            </span>
            {/* <span className="social-badge-handle">{instagramHandle}</span> */}
          </div>
        </a>
      </div>
    </section>
  );
}
