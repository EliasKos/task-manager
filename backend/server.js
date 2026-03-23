const express = require('express');
const cors = require('cors');
const pool = require('./db'); // your postgres connection

const app = express();

app.use(cors());
app.use(express.json());

// ✅ GET all tasks
app.get('/tasks', async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
  res.json(result.rows);
});

// ✅ ADD task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
    [title, description]
  );
  res.json(result.rows[0]);
});

// ✅ DELETE task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  res.json({ message: 'Task deleted' });
});

// ✅ TOGGLE complete
app.patch('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'UPDATE tasks SET completed = NOT completed WHERE id = $1 RETURNING *',
    [id]
  );
  res.json(result.rows[0]);
});

// ✅ IMPORTANT: use Render port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});