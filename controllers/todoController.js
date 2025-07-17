// controllers/todoController.js
// Import the 'query' helper function which returns a Promise
import { query } from '../config/db.js';

// @desc    Get all todos
// @route   GET /api/todos
export async function getTodos(req, res) { // Make it async
  try {
    const results = await query('SELECT * FROM todos ORDER BY created_at DESC'); // Use 'await query'
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching todos:', error); // Log for server-side debugging
    res.status(500).json({ error: 'Failed to fetch todos: ' + error.message });
  }
}

// @desc    Create a new todo
// @route   POST /api/todos
export async function createTodo(req, res) { // Make it async
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: 'Task content is required' });
  }

  const newTodo = { task: task, completed: false };
  try {
    const results = await query('INSERT INTO todos SET ?', newTodo); // Use 'await query'
    res.status(201).json({ id: results.insertId, ...newTodo });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo: ' + error.message });
  }
}

// @desc    Update a todo (e.g., mark as completed)
// @route   PUT /api/todos/:id
export async function updateTodo(req, res) {
  const { id } = req.params;
  let { completed } = req.body;

  try {
    completed = completed === true || completed === 'true' ? 1 : 0;
    console.log(`Updating todo with id: ${id}, completed: ${completed}`);

    const results = await query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const result = await query('SELECT * FROM todos WHERE id = ?', [id]);
    const updatedTodo = Array.isArray(result) ? result[0] : result;

    if (!updatedTodo) {
      return res.status(500).json({ error: 'Failed to retrieve updated todo' });
    }

    res.status(200).json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error.stack);
    res.status(500).json({ error: 'Failed to update todo: ' + error.message });
  }
}

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
export async function deleteTodo(req, res) { // Make it async
  const { id } = req.params;
  try {
    const results = await query('DELETE FROM todos WHERE id = ?', [id]); // Use 'await query'
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo: ' + error.message });
  }
}