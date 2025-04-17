const TaskChunkModel = require('../models/taskChunkModel');
const TaskModel = require('../models/taskModel');

// TaskChunk Controller
const TaskChunkController = {
  // Create a new task chunk
  async createTaskChunk(req, res) {
    try {
      const { parentTask, title, userImportance, orderWithinTask, isReview } = req.body;
      
      if (!parentTask || !title) {
        return res.status(400).json({ message: 'Parent task ID and title are required' });
      }
      
      // Verify that the parent task exists
      const task = await TaskModel.getById(parentTask);
      if (!task) {
        return res.status(404).json({ message: 'Parent task not found' });
      }
      
      const newTaskChunk = await TaskChunkModel.create({
        parentTask,
        title,
        userImportance,
        orderWithinTask,
        isReview
      });
      
      res.status(201).json(newTaskChunk);
    } catch (error) {
      console.error('Error in createTaskChunk:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all chunks for a task
  async getChunksByTask(req, res) {
    try {
      const { taskId } = req.params;
      
      // Verify that the task exists
      const task = await TaskModel.getById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      const chunks = await TaskChunkModel.getAllByTask(taskId);
      res.json(chunks);
    } catch (error) {
      console.error('Error in getChunksByTask:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get a chunk by ID
  async getChunkById(req, res) {
    try {
      const { id } = req.params;
      const chunk = await TaskChunkModel.getById(id);
      
      if (!chunk) {
        return res.status(404).json({ message: 'Task chunk not found' });
      }
      
      res.json(chunk);
    } catch (error) {
      console.error('Error in getChunkById:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update a task chunk
  async updateChunk(req, res) {
    try {
      const { id } = req.params;
      const { title, userImportance, orderWithinTask, isReview, isMastered } = req.body;
      
      const updatedChunk = await TaskChunkModel.update(id, {
        title,
        userImportance,
        orderWithinTask,
        isReview,
        isMastered
      });
      
      if (!updatedChunk) {
        return res.status(404).json({ message: 'Task chunk not found' });
      }
      
      res.json(updatedChunk);
    } catch (error) {
      console.error('Error in updateChunk:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Mark a chunk as reviewed
  async markChunkReviewed(req, res) {
    try {
      const { id } = req.params;
      const updatedChunk = await TaskChunkModel.markReviewed(id);
      
      if (!updatedChunk) {
        return res.status(404).json({ message: 'Task chunk not found' });
      }
      
      res.json(updatedChunk);
    } catch (error) {
      console.error('Error in markChunkReviewed:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete a task chunk
  async deleteChunk(req, res) {
    try {
      const { id } = req.params;
      const deletedChunk = await TaskChunkModel.delete(id);
      
      if (!deletedChunk) {
        return res.status(404).json({ message: 'Task chunk not found' });
      }
      
      res.json({ message: 'Task chunk deleted successfully', chunk: deletedChunk });
    } catch (error) {
      console.error('Error in deleteChunk:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get chunks due for review
  async getChunksDueForReview(req, res) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const chunks = await TaskChunkModel.getChunksDueForReview(limit);
      res.json(chunks);
    } catch (error) {
      console.error('Error in getChunksDueForReview:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = TaskChunkController; 