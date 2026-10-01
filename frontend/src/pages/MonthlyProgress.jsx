// ─────────────────────────────────────────────────────────────
// src/pages/MonthlyProgress.jsx — Monthly progress dashboard
// ─────────────────────────────────────────────────────────────
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/api';
import useFetch from '../hooks/useFetch';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function toDateKey(date) {
  return date.toISOString().split('T')[0];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function MonthlyProgress() {
  const { data, loading, error, refetch } = useFetch(getTasks);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  // Build a map: dateKey -> { total, done, inProgress, pending }
  const dayMap = useMemo(() => {
    const tasks = data?.tasks ?? [];
    const map = {};
    for (const task of tasks) {
      const key = toDateKey(new Date(task.createdAt));
      if (!map[key]) {
        map[key] = { total: 0, done: 0, inProgress: 0, pending: 0, tasks: [] };
      }
      map[key].total++;
      if (task.status === 'done') map[key].done++;
      else if (task.status === 'in_progress') map[key].inProgress++;
      else map[key].pending++;
      map[key].tasks.push(task);
    }
    return map;
  }, [data]);

  // Monthly summary stats
  const monthStats = useMemo(() => {
    const tasks = data?.tasks ?? [];
    const monthTasks = tasks.filter((t) => {
      const d = new Date(t.createdAt);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const total = monthTasks.length;
    const done = monthTasks.filter((t) => t.status === 'done').length;
    const inProgress = monthTasks.filter((t) => t.status === 'in_progress').length;
    const pending = monthTasks.filter((t) => t.status === 'pending').length;
    const percent = total > 0 ? Math.round((done / total) * 100) : 0;

    // Streak calculation
    const daysInMonth = getDaysInMonth(year, month);
    let streak = 0;
    let maxStreak = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toDateKey(new Date(year, month, d));
      const dayData = dayMap[key];
      if (dayData && dayData.done > 0) {
        streak++;
        maxStreak = Math.max(maxStreak, streak);
      } else {
        streak = 0;
      }
    }

    // Active days
    let activeDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = toDateKey(new Date(year, month, d));
      if (dayMap[key] && dayMap[key].total > 0) activeDays++;
    }

    return { total, done, inProgress, pending, percent, maxStreak, activeDays };
  }, [data, year, month, dayMap]);

  // Calendar grid
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const cells = [];

    // Empty cells before the 1st
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null, key: null });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const key = toDateKey(new Date(year, month, d));
      const dayData = dayMap[key] || { total: 0, done: 0, inProgress: 0, pending: 0, tasks: [] };
      const isToday = key === toDateKey(new Date());
      cells.push({ day: d, key, ...dayData, isToday });
    }
    return cells;
  }, [year, month, dayMap]);

  // Selected day's tasks
  const selectedDayData = useMemo(() => {
    if (!selectedDay) return null;
    const key = toDateKey(new Date(year, month, selectedDay));
    return dayMap[key] || { total: 0, done: 0, tasks: [] };
  }, [selectedDay, year, month, dayMap]);

  function navigateMonth(offset) {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setMonth(newMonth);
    setYear(newYear);
    setSelectedDay(null);
  }

  function goToCurrentMonth() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDay(null);
  }

  function getHeatLevel(cell) {
    if (!cell.day || cell.total === 0) return 0;
    const pct = (cell.done / cell.total) * 100;
    if (pct === 100) return 4;
    if (pct >= 66) return 3;
    if (pct >= 33) return 2;
    return 1;
  }

  if (loading) return <Loader message="Loading progress data..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();

  return (
    <div className="page">
      {/* Month Navigator */}
      <div className="monthly-nav">
        <button className="btn btn-outline btn-sm" onClick={() => navigateMonth(-1)}>
          ← Prev
        </button>
        <div className="monthly-nav-center">
          <h1 className="monthly-title">{MONTH_NAMES[month]} {year}</h1>
          {!isCurrentMonth && (
            <button className="btn btn-outline btn-sm" onClick={goToCurrentMonth}>
              This Month
            </button>
          )}
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => navigateMonth(1)}>
          Next →
        </button>
      </div>

      {/* Summary Cards */}
      <div className="monthly-summary">
        <div className="summary-card summary-card-total">
          <div className="summary-card-icon">📊</div>
          <div className="summary-card-data">
            <span className="summary-card-value">{monthStats.total}</span>
            <span className="summary-card-label">Total Tasks</span>
          </div>
        </div>
        <div className="summary-card summary-card-done">
          <div className="summary-card-icon">✅</div>
          <div className="summary-card-data">
            <span className="summary-card-value">{monthStats.done}</span>
            <span className="summary-card-label">Completed</span>
          </div>
        </div>
        <div className="summary-card summary-card-rate">
          <div className="summary-card-icon">📈</div>
          <div className="summary-card-data">
            <span className="summary-card-value">{monthStats.percent}%</span>
            <span className="summary-card-label">Completion Rate</span>
          </div>
        </div>
        <div className="summary-card summary-card-streak">
          <div className="summary-card-icon">🔥</div>
          <div className="summary-card-data">
            <span className="summary-card-value">{monthStats.maxStreak}</span>
            <span className="summary-card-label">Best Streak</span>
          </div>
        </div>
        <div className="summary-card summary-card-active">
          <div className="summary-card-icon">📅</div>
          <div className="summary-card-data">
            <span className="summary-card-value">{monthStats.activeDays}</span>
            <span className="summary-card-label">Active Days</span>
          </div>
        </div>
      </div>

      {/* Completion Progress Bar */}
      <div className="monthly-progress-section">
        <div className="monthly-progress-header">
          <span>Monthly Completion</span>
          <span className="monthly-progress-pct">{monthStats.done}/{monthStats.total} tasks</span>
        </div>
        <div className="monthly-progress-bar">
          <div
            className="monthly-progress-fill"
            style={{ width: `${monthStats.percent}%` }}
          />
        </div>
        <div className="monthly-progress-legend">
          <span className="legend-item legend-done">
            <span className="legend-dot" /> Done ({monthStats.done})
          </span>
          <span className="legend-item legend-progress">
            <span className="legend-dot" /> In Progress ({monthStats.inProgress})
          </span>
          <span className="legend-item legend-pending">
            <span className="legend-dot" /> Pending ({monthStats.pending})
          </span>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="monthly-calendar">
        <div className="calendar-header">
          {DAY_NAMES.map((d) => (
            <div key={d} className="calendar-day-name">{d}</div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((cell, i) => (
            <div
              key={i}
              className={`calendar-cell 
                ${!cell.day ? 'calendar-cell-empty' : ''} 
                ${cell.isToday ? 'calendar-cell-today' : ''} 
                ${selectedDay === cell.day ? 'calendar-cell-selected' : ''}
                heat-${getHeatLevel(cell)}`}
              onClick={() => cell.day && setSelectedDay(cell.day === selectedDay ? null : cell.day)}
              title={cell.day ? `${cell.day}: ${cell.done || 0}/${cell.total || 0} completed` : ''}
            >
              {cell.day && (
                <>
                  <span className="calendar-cell-day">{cell.day}</span>
                  {cell.total > 0 && (
                    <span className="calendar-cell-count">
                      {cell.done}/{cell.total}
                    </span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="calendar-legend">
          <span className="calendar-legend-label">Less</span>
          <span className="calendar-legend-cell heat-0" />
          <span className="calendar-legend-cell heat-1" />
          <span className="calendar-legend-cell heat-2" />
          <span className="calendar-legend-cell heat-3" />
          <span className="calendar-legend-cell heat-4" />
          <span className="calendar-legend-label">More</span>
        </div>
      </div>

      {/* Selected Day Detail Drawer */}
      {selectedDayData && selectedDay && (
        <div className="monthly-day-detail">
          <div className="day-detail-header">
            <h3>
              {MONTH_NAMES[month]} {selectedDay}, {year}
            </h3>
            <button className="btn btn-outline btn-sm" onClick={() => setSelectedDay(null)}>
              ✕
            </button>
          </div>
          {selectedDayData.tasks.length === 0 ? (
            <p className="day-detail-empty">No tasks on this day.</p>
          ) : (
            <div className="day-detail-list">
              {selectedDayData.tasks.map((task) => (
                <Link key={task.id} to={`/tasks/${task.id}`} className="day-detail-task">
                  <span className={`day-detail-status status-${task.status}`}>
                    {task.status === 'done' ? '✓' : task.status === 'in_progress' ? '◐' : '○'}
                  </span>
                  <span className="day-detail-title">{task.title}</span>
                  <span className={`badge badge-${task.status}`}>
                    {task.status === 'done' ? 'Done' : task.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
