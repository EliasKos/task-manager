import { useState, useEffect } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/tasks', { title: newTitle, description: newDesc })
      .then(res => {
        setTasks([...tasks, res.data]);
        setNewTitle('');
        setNewDesc('');
      })
      .catch(err => console.error(err));
  }

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error(err));
  }

  const handleToggleComplete = (id) => {
    axios.patch(`http://localhost:5000/tasks/${id}`)
      .then(res => {
        setTasks(tasks.map(task => task.id === id ? res.data : task));
      })
      .catch(err => console.error(err));
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task title"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Task description"
          value={newDesc}
          onChange={e => setNewDesc(e.target.value)}
        />
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      {tasks.map(task => (
        <div key={task.id} className={`task ${task.completed ? 'completed' : ''}`}>
          <div className="task-info">
            <strong>{task.title}</strong>
            <p>{task.description}</p>
          </div>
          <div>
            <button onClick={() => handleDelete(task.id)} className="delete-btn">Delete</button>
            <button onClick={() => handleToggleComplete(task.id)} className="complete-btn">
              {task.completed ? "Mark Incomplete" : "Mark Complete"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;