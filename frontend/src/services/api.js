import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Task API calls
export const TaskAPI = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await api.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  // Get a task by ID
  getTaskById: async (id) => {
    try {
      const response = await api.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },
  
  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  // Update a task
  updateTask: async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  }
};

// Task Chunk API calls
export const TaskChunkAPI = {
  // Get all chunks for a task
  getChunksByTask: async (taskId) => {
    try {
      const response = await api.get(`/task-chunks/task/${taskId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chunks for task ${taskId}:`, error);
      throw error;
    }
  },
  
  // Get chunks due for review
  getChunksDueForReview: async (limit = 10) => {
    try {
      const response = await api.get(`/task-chunks/due?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chunks due for review:', error);
      throw error;
    }
  },
  
  // Create a new task chunk
  createTaskChunk: async (chunkData) => {
    try {
      const response = await api.post('/task-chunks', chunkData);
      return response.data;
    } catch (error) {
      console.error('Error creating task chunk:', error);
      throw error;
    }
  },
  
  // Update a task chunk
  updateTaskChunk: async (id, chunkData) => {
    try {
      const response = await api.put(`/task-chunks/${id}`, chunkData);
      return response.data;
    } catch (error) {
      console.error(`Error updating task chunk ${id}:`, error);
      throw error;
    }
  },
  
  // Mark a chunk as reviewed
  markChunkReviewed: async (id) => {
    try {
      const response = await api.post(`/task-chunks/${id}/review`);
      return response.data;
    } catch (error) {
      console.error(`Error marking chunk ${id} as reviewed:`, error);
      throw error;
    }
  },
  
  // Delete a task chunk
  deleteTaskChunk: async (id) => {
    try {
      const response = await api.delete(`/task-chunks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task chunk ${id}:`, error);
      throw error;
    }
  }
};

// Daily Schedule API calls
export const ScheduleAPI = {
  // Get today's schedule or for a specific date
  getSchedule: async (date = null) => {
    try {
      const url = date ? `/daily-schedule?date=${date}` : '/daily-schedule';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      throw error;
    }
  },
  
  // Generate schedule for today or a specific date
  generateSchedule: async (date = null, limit = 10) => {
    try {
      const response = await api.post('/daily-schedule/generate', { date, limit });
      return response.data;
    } catch (error) {
      console.error('Error generating schedule:', error);
      throw error;
    }
  },
  
  // Mark a scheduled item as completed
  markCompleted: async (id) => {
    try {
      const response = await api.post(`/daily-schedule/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error marking schedule item ${id} as completed:`, error);
      throw error;
    }
  },
  
  // Get completed items in a date range
  getCompletedItems: async (startDate = null, endDate = null) => {
    try {
      let url = '/daily-schedule/completed';
      
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed items:', error);
      throw error;
    }
  }
};

export default {
  TaskAPI,
  TaskChunkAPI,
  ScheduleAPI
}; 