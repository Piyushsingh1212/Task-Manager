// ─────────────────────────────────────────────────────────────
// src/pages/DailyTasks.jsx — Daily task tracking view
// ─────────────────────────────────────────────────────────────
import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTasks, updateTask, createTask } from '../services/api';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const STATUS_CYCLE = ['pending', 'in_progress', 'done'];
const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In Progress',
  done: 'Done',
};
const STATUS_ICONS = {
  pending: '○',
  in_progress: '◐',
  done: '●',
};

function toDateKey(date) {
  return date.toISOString().split('T')[0];
}

function formatDisplayDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function isToday(date) {
  const today = new Date();
  return toDateKey(date) === toDateKey(today);
}

export default function DailyTasks() {
  const { data, loading, error, refetch } = useFetch(getTasks);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [updatingId, setUpdatingId] = useState(null);
  const [quickTitle, setQuickTitle] = useState('');
  const [adding, setAdding] = useState(false);

  const dateKey = toDateKey(selectedDate);

  // Filter tasks for the selected date
  const dayTasks = useMemo(() => {
    const tasks = data?.tasks ?? [];
    return tasks.filter((task) => {
      const taskDate = new Date(task.createdAt);
      return toDateKey(taskDate) === dateKey;
    });
  }, [data, dateKey]);

  // Stats for the day
  const stats = useMemo(() => {
    const total = dayTasks.length;
    const done = dayTasks.filter((t) => t.status === 'done').length;
    const inProgress = dayTasks.filter((t) => t.status === 'in_progress').length;
    const pending = dayTasks.filter((t) => t.status === 'pending').length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, done, inProgress, pending, percent };
  }, [dayTasks]);

  function navigateDay(offset) {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(next.getDate() + offset);
      return next;
    });
  }

  function goToToday() {
    setSelectedDate(new Date());
  }

  const handleCycleStatus = useCallback(
    async (task) => {
      const currentIdx = STATUS_CYCLE.indexOf(task.status);
      const nextStatus = STATUS_CYCLE[(currentIdx + 1) % STATUS_CYCLE.length];
      setUpdatingId(task.id);
      try {
        await updateTask(task.id, { ...task, status: nextStatus });
        refetch();
      } catch (err) {
        alert(err.message || 'Failed to update task status.');
      } finally {
        setUpdatingId(null);
      }
    },
    [refetch]
  );

  async function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setAdding(true);
    try {
      await createTask({
        title: quickTitle.trim(),
        description: `Quick task added on ${formatDisplayDate(selectedDate)}`,
        status: 'pending',
      });
      setQuickTitle('');
      refetch();
    } catch (err) {
      alert(err.message || 'Failed to add task.');
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <Loader message="Loading daily tasks..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div className="page">
      {/* Date Navigator */}
      <div className="daily-nav">
        <button className="btn btn-outline btn-sm" onClick={() => navigateDay(-1)}>
          ← Prev
        </button>
        <div className="daily-nav-center">
          <h1 className="daily-date">{formatDisplayDate(selectedDate)}</h1>
          {!isToday(selectedDate) && (
            <button className="btn btn-outline btn-sm daily-today-btn" onClick={goToToday}>
              Today
            </button>
          )}
          {isToday(selectedDate) && (
            <span className="daily-today-badge">Today</span>
          )}
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigateDay(1)}>
          Next →
        </button>
      </div>

      {/* Day Stats Bar */}
      <div className="daily-stats-bar">
        <div className="daily-stat">
          <span className="daily-stat-value">{stats.total}</span>
          <span className="daily-stat-label">Total</span>
        </div>
        <div className="daily-stat daily-stat-done">
          <span className="daily-stat-value">{stats.done}</span>
          <span className="daily-stat-label">Done</span>
        </div>
        <div className="daily-stat daily-stat-progress">
          <span className="daily-stat-value">{stats.inProgress}</span>
          <span className="daily-stat-label">In Progress</span>
        </div>
        <div className="daily-stat daily-stat-pending">
          <span className="daily-stat-value">{stats.pending}</span>
          <span className="daily-stat-label">Pending</span>
        </div>
        <div className="daily-stat daily-stat-percent">
          <div className="daily-progress-ring">
            <svg viewBox="0 0 36 36" className="progress-ring-svg">
              <path
                className="progress-ring-bg"
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="progress-ring-fill"
                strokeDasharray={`${stats.percent}, 100`}
                d="M18 2.0845
                   a 15.9155 15.9155 0 0 1 0 31.831
                   a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="progress-ring-text">{stats.percent}%</span>
          </div>
        </div>
      </div>

      {/* Quick Add */}
      {isToday(selectedDate) && (
        <form className="daily-quick-add" onSubmit={handleQuickAdd}>
          <input
            type="text"
            placeholder="Quick add a task for today..."
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            disabled={adding}
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={adding || !quickTitle.trim()}>
            {adding ? '...' : '+ Add'}
          </button>
        </form>
      )}

      {/* Task List */}
      {dayTasks.length === 0 ? (
        <div className="daily-empty">
          <div className="daily-empty-icon">📋</div>
          <h3>No tasks for this day</h3>
          <p>Tasks created on this date will appear here.</p>
          <Link to="/create" className="btn btn-primary">
            + Create Task
          </Link>
        </div>
      ) : (
        <div className="daily-task-list">
          {dayTasks.map((task) => (
            <div
              key={task.id}
              className={`daily-task-item ${task.status === 'done' ? 'daily-task-done' : ''}`}
            >
              <button
                className={`daily-status-toggle status-${task.status}`}
                onClick={() => handleCycleStatus(task)}
                disabled={updatingId === task.id}
                title={`Click to change status (${STATUS_LABELS[task.status]})`}
              >
                {updatingId === task.id ? (
                  <span className="daily-status-spinner" />
                ) : (
                  STATUS_ICONS[task.status]
                )}
              </button>
              <div className="daily-task-content">
                <Link to={`/tasks/${task.id}`} className="daily-task-title">
                  {task.title}
                </Link>
                {task.description && (
                  <p className="daily-task-desc">
                    {task.description.length > 80
                      ? task.description.slice(0, 80) + '…'
                      : task.description}
                  </p>
                )}
              </div>
              <span className={`badge badge-${task.status}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
