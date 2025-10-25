const express = require('express');
const db = require('./database');

const router = express.Router();

// Validation middleware
function validateTask(req, res, next) {
  const { title } = req.body;
  
  if (!title || title.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Title is required and cannot be empty' 
    });
  }
  
  if (title.length > 200) {
    return res.status(400).json({ 
      error: 'Title must be less than 200 characters' 
    });
  }
  
  next();
}

// GET /api/tasks - Get all tasks
router.get('/tasks', (req, res) => {
  const filters = {
    status: req.query.status,
    search: req.query.search
  };

  db.getAllTasks(filters, (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  });
});

// GET /api/tasks/:id - Get single task
router.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  db.getTaskById(id, (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve task' });
    }
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({
      success: true,
      data: task
    });
  });
});

// POST /api/tasks - Create new task
router.post('/tasks', validateTask, (req, res) => {
  const { title, description } = req.body;

  db.createTask({ title, description }, (err, task) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to create task' });
    }
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  });
});

// PUT /api/tasks/:id - Update task
router.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (updates.title !== undefined && updates.title.trim().length === 0) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }

  db.updateTask(id, updates, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to update task' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({
      success: true,
      message: 'Task updated successfully'
    });
  });
});

// DELETE /api/tasks/:id - Delete task
router.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  db.deleteTask(id, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  });
});

module.exports = router;