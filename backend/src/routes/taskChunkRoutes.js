const express = require('express');
const router = express.Router();
const TaskChunkController = require('../controllers/taskChunkController');

// GET /api/task-chunks/task/:taskId - Get all chunks for a specific task
router.get('/task/:taskId', TaskChunkController.getChunksByTask);

// GET /api/task-chunks/due - Get chunks due for review
router.get('/due', TaskChunkController.getChunksDueForReview);

// GET /api/task-chunks/:id - Get a chunk by ID
router.get('/:id', TaskChunkController.getChunkById);

// POST /api/task-chunks - Create a new task chunk
router.post('/', TaskChunkController.createTaskChunk);

// PUT /api/task-chunks/:id - Update a task chunk
router.put('/:id', TaskChunkController.updateChunk);

// POST /api/task-chunks/:id/review - Mark a chunk as reviewed
router.post('/:id/review', TaskChunkController.markChunkReviewed);

// DELETE /api/task-chunks/:id - Delete a task chunk
router.delete('/:id', TaskChunkController.deleteChunk);

module.exports = router; 