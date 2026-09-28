// ─────────────────────────────────────────────────────────────
// src/components/Loader.jsx — Reusable loading spinner
// ─────────────────────────────────────────────────────────────
export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="spinner" />
      <p className="loader-text">{message}</p>
    </div>
  );
}
