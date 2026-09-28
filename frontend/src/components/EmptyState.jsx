// ─────────────────────────────────────────────────────────────
// src/components/EmptyState.jsx — Shown when task list is empty
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

export default function EmptyState() {
  return (
    <div className="empty-state">
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="empty-icon"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 12h6" />
      </svg>
      <h2>No tasks found</h2>
      <p>Get started by creating your first task.</p>
      <Link to="/create" className="btn btn-primary">
        Create your first task
      </Link>
    </div>
  );
}
