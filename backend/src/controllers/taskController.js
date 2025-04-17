const TaskModel = require('../models/taskModel');

// Task Controller
const TaskController = {
  // Create a new task
  async createTask(req, res) {
    try {
      const { title } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      
      const newTask = await TaskModel.create(title);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error in createTask:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get all tasks
  async getAllTasks(req, res) {
    try {
      const tasks = await TaskModel.getAll();
      res.json(tasks);
    } catch (error) {
      console.error('Error in getAllTasks:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get a task by ID
  async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await TaskModel.getById(id);
      
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(task);
    } catch (error) {
      console.error('Error in getTaskById:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Update a task
  async updateTask(req, res) {
    try {
      const { id } = req.params;
      const { title } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: 'Title is required' });
      }
      
      const updatedTask = await TaskModel.update(id, title);
      
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json(updatedTask);
    } catch (error) {
      console.error('Error in updateTask:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Delete a task
  async deleteTask(req, res) {
    try {
      const { id } = req.params;
      const deletedTask = await TaskModel.delete(id);
      
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
      
      res.json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
      console.error('Error in deleteTask:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = TaskController; 