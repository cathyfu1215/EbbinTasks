import React, { useState, useEffect } from 'react';
import { FaCheck, FaRedo, FaCalendarAlt } from 'react-icons/fa';
import { ScheduleAPI } from '../services/api';

const DailySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [generateLoading, setGenerateLoading] = useState(false);
  
  useEffect(() => {
    fetchSchedule();
  }, [selectedDate]);
  
  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const data = await ScheduleAPI.getSchedule(selectedDate);
      setSchedule(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setLoading(false);
    }
  };
  
  const handleGenerateSchedule = async () => {
    try {
      setGenerateLoading(true);
      await ScheduleAPI.generateSchedule(selectedDate);
      await fetchSchedule();
      setGenerateLoading(false);
    } catch (error) {
      console.error('Error generating schedule:', error);
      setGenerateLoading(false);
    }
  };
  
  const handleMarkCompleted = async (id) => {
    try {
      await ScheduleAPI.markCompleted(id);
      // Update the local state to reflect the change
      setSchedule(schedule.map(item => 
        item.id === id ? { ...item, is_completed: true } : item
      ));
    } catch (error) {
      console.error('Error marking item as completed:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Group items by parent task
  const groupedSchedule = schedule.reduce((groups, item) => {
    const taskTitle = item.task_title;
    if (!groups[taskTitle]) {
      groups[taskTitle] = [];
    }
    groups[taskTitle].push(item);
    return groups;
  }, {});
  
  // Count completed items
  const completedCount = schedule.filter(item => item.is_completed).length;
  const totalCount = schedule.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Daily Schedule</h1>
      
      {/* Date Selector and Generate Button */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <label htmlFor="date" className="form-label flex items-center">
              <FaCalendarAlt className="mr-2 text-primary-600" />
              Select Date
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="form-input mt-1"
            />
          </div>
          
          <button
            onClick={handleGenerateSchedule}
            disabled={generateLoading}
            className={`flex items-center px-4 py-2 rounded-lg ${
              generateLoading
                ? 'bg-primary-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white`}
          >
            {generateLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FaRedo className="mr-2" />
                Generate Schedule
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Progress */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-secondary-800 mb-2">
          {formatDate(selectedDate)}
        </h2>
        
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-secondary-600">Progress</span>
            <span className="text-secondary-800 font-medium">{completedCount} of {totalCount} completed</span>
          </div>
          <div className="w-full bg-secondary-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Schedule List */}
      {Object.keys(groupedSchedule).length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-secondary-500 mb-4">No tasks scheduled for this date.</p>
          <button
            onClick={handleGenerateSchedule}
            className="btn-primary"
          >
            Generate Schedule
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSchedule).map(([taskTitle, items]) => (
            <div key={taskTitle} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary-50 px-6 py-4 border-b border-secondary-200">
                <h3 className="text-lg font-semibold text-secondary-800">{taskTitle}</h3>
              </div>
              
              <div className="divide-y divide-secondary-200">
                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-4 ${item.is_completed ? 'bg-green-50' : ''}`}
                  >
                    <div>
                      <h4 className="text-md font-medium text-secondary-800">
                        {item.chunk_title}
                      </h4>
                      {item.is_completed && (
                        <p className="text-sm text-green-600 mt-1">
                          Completed at {new Date(item.completed_at).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                    
                    {!item.is_completed && (
                      <button
                        onClick={() => handleMarkCompleted(item.id)}
                        className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        <FaCheck className="mr-1" /> Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailySchedule; 