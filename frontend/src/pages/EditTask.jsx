// ─────────────────────────────────────────────────────────────
// src/pages/EditTask.jsx — Form to edit an existing task
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, updateTask } from '../services/api';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    async function loadTask() {
      try {
        const data = await getTask(id);
        const task = data.task;
        setForm({
          title: task.title || '',
          description: task.description || '',
          status: task.status || 'pending',
        });
      } catch (err) {
        if (err.message === 'Failed to fetch') {
          setFetchError(
            'Unable to connect to the server. Please make sure the backend is running.'
          );
        } else {
          setFetchError(err.message || 'Failed to load task.');
        }
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [id]);

  function validate() {
    const errs = {};
    if (!form.title.trim()) {
      errs.title = 'Title is required.';
    } else if (form.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters.';
    }
    if (!form.description.trim()) {
      errs.description = 'Description cannot be empty.';
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError('');

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await updateTask(id, {
        title: form.title.trim(),
        description: form.description.trim(),
        status: form.status,
      });
      navigate(`/tasks/${id}`, {
        state: { message: 'Task updated successfully!' },
      });
    } catch (err) {
      if (err.message === 'Failed to fetch') {
        setApiError(
          'Unable to connect to the server. Please make sure the backend is running.'
        );
      } else {
        setApiError(err.message || 'Failed to update task.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader message="Loading task data..." />;
  if (fetchError) return <ErrorMessage message={fetchError} />;

  return (
    <div className="page">
      <div className="form-card">
        <h1>Edit Task</h1>

        {apiError && <div className="alert alert-error">{apiError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter task description"
              className={errors.description ? 'input-error' : ''}
            />
            {errors.description && (
              <span className="field-error">{errors.description}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="form-actions">
            <Link to="/" className="btn btn-outline">
              Cancel
            </Link>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
