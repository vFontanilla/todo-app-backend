// routes/todos.js
import { Router } from 'express';
const router = Router();
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController.js';

// GET all todos
router.get('/', getTodos);

// POST a new todo
router.post('/', createTodo);

// PUT to update a todo
router.put('/:id', updateTodo);

// DELETE a todo
router.delete('/:id', deleteTodo);

export default router;
