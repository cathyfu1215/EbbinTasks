const DailyScheduleModel = require('../models/dailyScheduleModel');

// DailySchedule Controller
const DailyScheduleController = {
  // Get schedule for today or a specific date
  async getSchedule(req, res) {
    try {
      const date = req.query.date || new Date().toISOString().split('T')[0];
      const schedule = await DailyScheduleModel.getByDate(date);
      res.json(schedule);
    } catch (error) {
      console.error('Error in getSchedule:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Generate schedule for today or a specific date
  async generateSchedule(req, res) {
    try {
      const date = req.body.date || new Date().toISOString().split('T')[0];
      const limit = req.body.limit || 10;
      
      const schedule = await DailyScheduleModel.generateDailySchedule(date, limit);
      res.json({
        message: 'Schedule generated successfully',
        date,
        count: schedule.length,
        schedule
      });
    } catch (error) {
      console.error('Error in generateSchedule:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Mark a scheduled item as completed
  async markCompleted(req, res) {
    try {
      const { id } = req.params;
      const completedItem = await DailyScheduleModel.markCompleted(id);
      
      if (!completedItem) {
        return res.status(404).json({ message: 'Scheduled item not found' });
      }
      
      res.json({
        message: 'Item marked as completed',
        item: completedItem
      });
    } catch (error) {
      console.error('Error in markCompleted:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },

  // Get completed items in a date range
  async getCompletedItems(req, res) {
    try {
      const startDate = req.query.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
      
      const completed = await DailyScheduleModel.getCompletedInRange(startDate, endDate);
      res.json({
        startDate,
        endDate,
        count: completed.length,
        items: completed
      });
    } catch (error) {
      console.error('Error in getCompletedItems:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

module.exports = DailyScheduleController; 