interface Props {
  onNewAlbum: () => void;
  onSignOut: () => void;
}

export function AdminBar({ onNewAlbum, onSignOut }: Props) {
  return (
    <aside className="admin-bar">
      <div className="admin-bar-status">
        <span className="admin-badge">✦ Admin Mode Active</span>
      </div>

      <div className="admin-bar-actions">
        <button type="button" onClick={onNewAlbum}>
          + New Album
        </button>
        <button type="button" onClick={onSignOut}>
          Log Out
        </button>
      </div>
    </aside>
  );
}
