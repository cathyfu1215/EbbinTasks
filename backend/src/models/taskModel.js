const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Task model for database operations
const TaskModel = {
  // Create a new task
  async create(title, userId = null) {
    const id = uuidv4();
    const query = `
      INSERT INTO tasks (id, user_id, title)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [id, userId, title];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Get all tasks
  async getAll(userId = null) {
    let query = 'SELECT * FROM tasks';
    let values = [];
    
    // Filter by user ID if provided
    if (userId) {
      query += ' WHERE user_id = $1';
      values.push(userId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw error;
    }
  },

  // Get a task by ID
  async getById(id) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting task by ID:', error);
      throw error;
    }
  },

  // Update a task
  async update(id, title) {
    const query = `
      UPDATE tasks
      SET title = $1
      WHERE id = $2
      RETURNING *
    `;
    const values = [title, id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  async delete(id) {
    const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};

module.exports = TaskModel; 