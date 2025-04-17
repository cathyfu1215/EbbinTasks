require('dotenv').config();
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const taskChunkRoutes = require('./routes/taskChunkRoutes');
const dailyScheduleRoutes = require('./routes/dailyScheduleRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/task-chunks', taskChunkRoutes);
app.use('/api/daily-schedule', dailyScheduleRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to EbbinTasks API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 