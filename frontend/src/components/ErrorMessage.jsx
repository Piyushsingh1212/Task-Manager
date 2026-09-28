// ─────────────────────────────────────────────────────────────
// src/components/ErrorMessage.jsx — Reusable error display
// ─────────────────────────────────────────────────────────────
export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-box">
      <svg
        className="error-icon"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
