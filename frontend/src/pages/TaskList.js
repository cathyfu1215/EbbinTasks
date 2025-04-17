import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { TaskAPI } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskAPI.getAllTasks();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTaskTitle.trim()) return;
    
    try {
      const newTask = await TaskAPI.createTask({ title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };
  
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await TaskAPI.deleteTask(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary-800">Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FaPlus className="mr-2" />
          Add Task
        </button>
      </div>
      
      {/* New Task Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-secondary-800 mb-4">Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Task Title
              </label>
              <input
                type="text"
                id="title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="form-input"
                placeholder="Enter task title"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewTaskTitle('');
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-secondary-500 mb-4">You don't have any tasks yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                  {task.title}
                </h3>
                <p className="text-sm text-secondary-500 mb-4">
                  Created: {new Date(task.created_at).toLocaleDateString()}
                </p>
                <div className="flex justify-between">
                  <Link
                    to={`/tasks/${task.id}`}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      to={`/tasks/${task.id}`}
                      className="p-2 text-secondary-500 hover:text-secondary-700"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList; 