// ─────────────────────────────────────────────────────────────
// src/pages/TaskDetails.jsx — Single task detail view
// ─────────────────────────────────────────────────────────────
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, deleteTask } from '../services/api';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  done: 'Done',
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch(() => getTask(id), [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await deleteTask(id);
      navigate('/', { state: { message: 'Task deleted successfully.' } });
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  }

  if (loading) return <Loader message="Loading task details..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const task = data?.task;
  if (!task) {
    return <ErrorMessage message="Task not found." />;
  }

  return (
    <div className="page">
      <div className="detail-card">
        <div className="detail-header">
          <h1>{task.title}</h1>
          <span className={`badge badge-${task.status} badge-lg`}>
            {STATUS_LABELS[task.status] || task.status}
          </span>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{task.description || 'No description provided.'}</p>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">Created</span>
              <span className="meta-value">{formatDate(task.createdAt)}</span>
            </div>
            {task.updatedAt && task.updatedAt !== task.createdAt && (
              <div className="meta-item">
                <span className="meta-label">Updated</span>
                <span className="meta-value">{formatDate(task.updatedAt)}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-label">Task ID</span>
              <span className="meta-value">#{task.id}</span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <Link to="/" className="btn btn-outline">
            ← Back
          </Link>
          <Link to={`/edit/${task.id}`} className="btn btn-secondary">
            Edit Task
          </Link>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
