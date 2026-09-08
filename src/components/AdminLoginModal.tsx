import { useState, type FormEvent } from "react";
import { signInAdmin } from "../lib/auth";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminLoginModal({ open, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInAdmin(email, password);
      setEmail("");
      setPassword("");
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onClose}>
      <div
        className="upload-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          disabled={loading}
        >
          ×
        </button>

        <h2>Admin Access ✦</h2>
        <p className="modal-subtitle">
          Sign in to create albums and manage memories.
        </p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="caption-input"
            type="email"
            placeholder="Admin Email"
            value={email}
            required
            disabled={loading}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="caption-input"
            type="password"
            placeholder="Password"
            value={password}
            required
            disabled={loading}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button
            type="submit"
            className="upload-button"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Signing in...
              </>
            ) : (
              "Enter Admin Mode"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
