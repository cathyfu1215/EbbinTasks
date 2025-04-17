const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// TaskChunk model for database operations
const TaskChunkModel = {
  // Create a new task chunk
  async create(data) {
    const {
      parentTask,
      title,
      userImportance = 0.5,
      orderWithinTask = null,
      isReview = true
    } = data;

    const id = uuidv4();
    const query = `
      INSERT INTO task_chunks (
        id, parent_task, title, user_importance, 
        order_within_task, is_review
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [id, parentTask, title, userImportance, orderWithinTask, isReview];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating task chunk:', error);
      throw error;
    }
  },

  // Get all chunks for a specific task
  async getAllByTask(taskId) {
    const query = `
      SELECT * FROM task_chunks
      WHERE parent_task = $1
      ORDER BY order_within_task, created_at
    `;
    const values = [taskId];
    
    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting task chunks:', error);
      throw error;
    }
  },

  // Get a chunk by ID
  async getById(id) {
    const query = 'SELECT * FROM task_chunks WHERE id = $1';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error getting task chunk by ID:', error);
      throw error;
    }
  },

  // Update a task chunk
  async update(id, data) {
    const {
      title,
      userImportance,
      orderWithinTask,
      isReview,
      isMastered
    } = data;

    let query = 'UPDATE task_chunks SET ';
    let values = [];
    let setFields = [];
    let paramCount = 1;

    // Only update fields that are provided
    if (title !== undefined) {
      setFields.push(`title = $${paramCount++}`);
      values.push(title);
    }
    
    if (userImportance !== undefined) {
      setFields.push(`user_importance = $${paramCount++}`);
      values.push(userImportance);
    }
    
    if (orderWithinTask !== undefined) {
      setFields.push(`order_within_task = $${paramCount++}`);
      values.push(orderWithinTask);
    }
    
    if (isReview !== undefined) {
      setFields.push(`is_review = $${paramCount++}`);
      values.push(isReview);
    }
    
    if (isMastered !== undefined) {
      setFields.push(`is_mastered = $${paramCount++}`);
      values.push(isMastered);
    }

    if (setFields.length === 0) {
      throw new Error('No fields to update');
    }

    query += setFields.join(', ');
    query += ` WHERE id = $${paramCount} RETURNING *`;
    values.push(id);
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error updating task chunk:', error);
      throw error;
    }
  },

  // Mark a chunk as reviewed
  async markReviewed(id) {
    const query = `
      UPDATE task_chunks
      SET last_reviewed = NOW(), review_count = review_count + 1, 
          retention_score = CASE 
            WHEN review_count < 5 THEN 1.0 - (review_count * 0.1)
            ELSE 0.5
          END
      WHERE id = $1
      RETURNING *
    `;
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error marking task chunk as reviewed:', error);
      throw error;
    }
  },

  // Delete a task chunk
  async delete(id) {
    const query = 'DELETE FROM task_chunks WHERE id = $1 RETURNING *';
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting task chunk:', error);
      throw error;
    }
  },

  // Get chunks due for review based on priority
  async getChunksDueForReview(limit = 10) {
    const query = `
      SELECT * FROM task_chunks
      WHERE is_review = TRUE AND is_mastered = FALSE
      ORDER BY priority DESC, last_reviewed ASC NULLS FIRST
      LIMIT $1
    `;
    const values = [limit];
    
    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting chunks due for review:', error);
      throw error;
    }
  }
};

module.exports = TaskChunkModel; 