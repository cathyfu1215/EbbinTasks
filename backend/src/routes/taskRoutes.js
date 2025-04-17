const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// GET /api/tasks - Get all tasks
router.get('/', TaskController.getAllTasks);

// GET /api/tasks/:id - Get a task by ID
router.get('/:id', TaskController.getTaskById);

// POST /api/tasks - Create a new task
router.post('/', TaskController.createTask);

// PUT /api/tasks/:id - Update a task
router.put('/:id', TaskController.updateTask);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', TaskController.deleteTask);

module.exports = router; 