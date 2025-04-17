const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const TaskChunkModel = require('./taskChunkModel');

// DailySchedule model for database operations
const DailyScheduleModel = {
  // Create a new daily schedule entry
  async create(taskChunkId, scheduledFor) {
    const id = uuidv4();
    const query = `
      INSERT INTO daily_schedule (id, task_chunk_id, scheduled_for)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [id, taskChunkId, scheduledFor];
    
    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating daily schedule entry:', error);
      throw error;
    }
  },

  // Get schedule for a specific date
  async getByDate(date) {
    const query = `
      SELECT ds.*, tc.title as chunk_title, tc.parent_task, t.title as task_title
      FROM daily_schedule ds
      JOIN task_chunks tc ON ds.task_chunk_id = tc.id
      JOIN tasks t ON tc.parent_task = t.id
      WHERE ds.scheduled_for = $1
      ORDER BY tc.priority DESC
    `;
    const values = [date];
    
    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting daily schedule by date:', error);
      throw error;
    }
  },

  // Mark a scheduled item as completed
  async markCompleted(id) {
    const query = `
      UPDATE daily_schedule
      SET is_completed = TRUE, completed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const values = [id];
    
    try {
      const result = await db.query(query, values);
      
      // Also update the task chunk's review status
      if (result.rows.length > 0) {
        const { task_chunk_id } = result.rows[0];
        await TaskChunkModel.markReviewed(task_chunk_id);
      }
      
      return result.rows[0];
    } catch (error) {
      console.error('Error marking daily schedule as completed:', error);
      throw error;
    }
  },

  // Generate a daily schedule for today
  async generateDailySchedule(date = new Date().toISOString().split('T')[0], limit = 10) {
    try {
      // First, delete any uncompleted items from today's schedule
      await db.query(
        `DELETE FROM daily_schedule 
         WHERE scheduled_for = $1 
         AND is_completed = FALSE`,
        [date]
      );
      
      // Get chunks due for review based on priority
      const chunks = await TaskChunkModel.getChunksDueForReview(limit);
      
      // Create schedule entries for each chunk
      const schedulePromises = chunks.map(chunk => 
        this.create(chunk.id, date)
      );
      
      const scheduleResults = await Promise.all(schedulePromises);
      return scheduleResults;
    } catch (error) {
      console.error('Error generating daily schedule:', error);
      throw error;
    }
  },

  // Get completed schedule items for a date range
  async getCompletedInRange(startDate, endDate) {
    const query = `
      SELECT ds.*, tc.title as chunk_title, t.title as task_title
      FROM daily_schedule ds
      JOIN task_chunks tc ON ds.task_chunk_id = tc.id
      JOIN tasks t ON tc.parent_task = t.id
      WHERE ds.scheduled_for BETWEEN $1 AND $2
      AND ds.is_completed = TRUE
      ORDER BY ds.completed_at DESC
    `;
    const values = [startDate, endDate];
    
    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error getting completed schedule items:', error);
      throw error;
    }
  }
};

module.exports = DailyScheduleModel; 