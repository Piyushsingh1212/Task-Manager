// ─────────────────────────────────────────────────────────────
// routes/tasks.js — CRUD endpoints for tasks
// ─────────────────────────────────────────────────────────────
const express = require('express');
const { getDB } = require('../db');

const router = express.Router();

// GET /api/tasks — List all tasks for the authenticated user
router.get('/', (req, res) => {
  try {
    const db = getDB();
    const tasks = db
      .prepare('SELECT * FROM tasks WHERE userId = ? ORDER BY createdAt DESC')
      .all(req.user.id);
    res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// GET /api/tasks/:id — Get a single task
router.get('/:id', (req, res) => {
  try {
    const db = getDB();
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?')
      .get(req.params.id, req.user.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    res.json({ task });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ error: 'Failed to fetch task.' });
  }
});

// POST /api/tasks — Create a new task
router.post('/', (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters.' });
    }

    const validStatuses = ['pending', 'in_progress', 'done'];
    const taskStatus = validStatuses.includes(status) ? status : 'pending';

    const db = getDB();
    const now = new Date().toISOString();
    const result = db
      .prepare(
        'INSERT INTO tasks (title, description, status, userId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
      )
      .run(title.trim(), (description || '').trim(), taskStatus, req.user.id, now, now);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({ task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// PUT /api/tasks/:id — Update a task
router.put('/:id', (req, res) => {
  try {
    const db = getDB();
    const existing = db
      .prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?')
      .get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const { title, description, status } = req.body;

    const newTitle = title !== undefined ? title.trim() : existing.title;
    const newDescription = description !== undefined ? description.trim() : existing.description;

    const validStatuses = ['pending', 'in_progress', 'done'];
    const newStatus = validStatuses.includes(status) ? status : existing.status;

    if (newTitle.length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters.' });
    }

    const now = new Date().toISOString();
    db.prepare(
      'UPDATE tasks SET title = ?, description = ?, status = ?, updatedAt = ? WHERE id = ? AND userId = ?'
    ).run(newTitle, newDescription, newStatus, now, req.params.id, req.user.id);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);

    res.json({ task });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', (req, res) => {
  try {
    const db = getDB();
    const existing = db
      .prepare('SELECT * FROM tasks WHERE id = ? AND userId = ?')
      .get(req.params.id, req.user.id);

    if (!existing) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ? AND userId = ?').run(req.params.id, req.user.id);

    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;
