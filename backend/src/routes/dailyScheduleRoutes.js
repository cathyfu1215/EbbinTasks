const express = require('express');
const router = express.Router();
const DailyScheduleController = require('../controllers/dailyScheduleController');

// GET /api/daily-schedule - Get schedule for today or a specific date
router.get('/', DailyScheduleController.getSchedule);

// POST /api/daily-schedule/generate - Generate schedule for today or a specific date
router.post('/generate', DailyScheduleController.generateSchedule);

// POST /api/daily-schedule/:id/complete - Mark a scheduled item as completed
router.post('/:id/complete', DailyScheduleController.markCompleted);

// GET /api/daily-schedule/completed - Get completed items in a date range
router.get('/completed', DailyScheduleController.getCompletedItems);

module.exports = router; 