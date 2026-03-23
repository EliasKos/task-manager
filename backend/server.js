const express = require('express');
const cors = require('cors');
const pool = require('./db'); // make sure db.js exists
const app = express();

app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await pool.query('SELECT * FROM tasks ORDER BY id');
    res.json(tasks.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add task
app.post('/tasks', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title, description]
    );
    res.json(newTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Toggle complete
app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const task = await pool.query('SELECT completed FROM tasks WHERE id = $1', [id]);
    if (task.rows.length === 0) return res.status(404).json({ error: "Task not found" });

    const newStatus = !task.rows[0].completed;
    const updatedTask = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [newStatus, id]
    );

    res.json(updatedTask.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

const path = require('path');

// Serve React build folder
app.use(express.static(path.join(__dirname, '../client/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});