const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, '../tasks.db'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err);
    } else {
      console.log('Tasks table ready');
    }
  });
}

// Database operations
const dbOperations = {
  // Get all tasks with optional filtering
  getAllTasks: (filters, callback) => {
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (filters.status === 'completed') {
      query += ' AND completed = 1';
    } else if (filters.status === 'pending') {
      query += ' AND completed = 0';
    }

    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, callback);
  },

  // Get single task by ID
  getTaskById: (id, callback) => {
    db.get('SELECT * FROM tasks WHERE id = ?', [id], callback);
  },

  // Create new task
  createTask: (task, callback) => {
    const { title, description } = task;
    db.run(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title, description || ''],
      function(err) {
        if (err) {
          callback(err);
        } else {
          callback(null, { id: this.lastID, title, description, completed: false });
        }
      }
    );
  },

  // Update task
  updateTask: (id, updates, callback) => {
    const fields = [];
    const params = [];

    if (updates.title !== undefined) {
      fields.push('title = ?');
      params.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      params.push(updates.description);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      params.push(updates.completed ? 1 : 0);
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;

    db.run(query, params, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  },

  // Delete task
  deleteTask: (id, callback) => {
    db.run('DELETE FROM tasks WHERE id = ?', [id], function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, { changes: this.changes });
      }
    });
  }
};

module.exports = dbOperations;