// ─────────────────────────────────────────────────────────────
// src/pages/Home.jsx — Task list / dashboard page
// ─────────────────────────────────────────────────────────────
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, deleteTask } from '../services/api';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

export default function Home() {
  const { data, loading, error, refetch } = useFetch(getTasks);
  const [successMsg, setSuccessMsg] = useState('');

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setSuccessMsg('Task deleted successfully.');
      refetch();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete task.');
    }
  }

  if (loading) return <Loader message="Loading tasks..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const tasks = data?.tasks ?? [];

  if (tasks.length === 0) return <EmptyState />;

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Tasks</h1>
        <Link to="/create" className="btn btn-primary">
          + Create Task
        </Link>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}

      <div className="task-grid">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
