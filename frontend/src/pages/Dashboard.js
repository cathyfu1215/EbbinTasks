import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaCalendarCheck, FaRedo } from 'react-icons/fa';
import { TaskAPI, TaskChunkAPI, ScheduleAPI } from '../services/api';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalChunks: 0,
    tasksToday: 0,
    completedToday: 0
  });
  const [dueTasks, setDueTasks] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Get all tasks
        const tasks = await TaskAPI.getAllTasks();
        
        // Get today's schedule
        const todaySchedule = await ScheduleAPI.getSchedule();
        
        // Get chunks due for review
        const dueChunks = await TaskChunkAPI.getChunksDueForReview(5);
        
        // Count completed items for today
        const today = new Date().toISOString().split('T')[0];
        const completedItems = await ScheduleAPI.getCompletedItems(today, today);
        
        setStats({
          totalTasks: tasks.length,
          totalChunks: tasks.reduce((sum, task) => sum + (task.chunkCount || 0), 0),
          tasksToday: todaySchedule.length,
          completedToday: completedItems.count || 0
        });
        
        setDueTasks(dueChunks);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleGenerateSchedule = async () => {
    try {
      await ScheduleAPI.generateSchedule();
      // Refresh the dashboard
      window.location.reload();
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 text-primary-800">
              <FaClipboardList className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-secondary-800">{stats.totalTasks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-800">
              <FaClipboardList className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-500">Total Chunks</p>
              <p className="text-2xl font-semibold text-secondary-800">{stats.totalChunks}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-800">
              <FaCalendarCheck className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-500">Tasks Today</p>
              <p className="text-2xl font-semibold text-secondary-800">{stats.tasksToday}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-800">
              <FaCalendarCheck className="text-xl" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-secondary-500">Completed Today</p>
              <p className="text-2xl font-semibold text-secondary-800">{stats.completedToday}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Due Tasks */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary-800">Tasks Due for Review</h2>
          <button 
            onClick={handleGenerateSchedule}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaRedo className="mr-2" />
            Generate Schedule
          </button>
        </div>
        
        {dueTasks.length === 0 ? (
          <p className="text-secondary-500">No tasks due for review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Last Reviewed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {dueTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">{task.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-500">
                        {(task.priority * 100).toFixed(0)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-500">
                        {task.last_reviewed ? new Date(task.last_reviewed).toLocaleDateString() : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/schedule`} className="text-primary-600 hover:text-primary-900">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          to="/tasks"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">
            Manage Your Tasks
          </h3>
          <p className="text-secondary-600">
            Create, edit, and organize your tasks and task chunks
          </p>
        </Link>
        
        <Link 
          to="/schedule"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">
            Today's Schedule
          </h3>
          <p className="text-secondary-600">
            View and complete your scheduled task chunks for today
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 