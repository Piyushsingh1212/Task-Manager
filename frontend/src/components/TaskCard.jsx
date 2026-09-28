// ─────────────────────────────────────────────────────────────
// src/components/TaskCard.jsx — Card for a single task
// ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function TaskCard({ task, onDelete }) {
  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      onDelete(task.id);
    }
  }

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        <span className={`badge badge-${task.status}`}>
          {STATUS_LABELS[task.status] || task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-card-desc">
          {task.description.length > 120
            ? task.description.slice(0, 120) + '…'
            : task.description}
        </p>
      )}

      <div className="task-card-meta">
        <time>
          {new Date(task.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </time>
      </div>

      <div className="task-card-actions">
        <Link to={`/tasks/${task.id}`} className="btn btn-primary btn-sm">
          View
        </Link>
        <Link to={`/edit/${task.id}`} className="btn btn-secondary btn-sm">
          Edit
        </Link>
        <button className="btn btn-danger btn-sm" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
