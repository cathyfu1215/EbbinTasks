import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaStar } from 'react-icons/fa';
import { TaskAPI, TaskChunkAPI } from '../services/api';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [task, setTask] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskTitle, setEditingTaskTitle] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [showChunkForm, setShowChunkForm] = useState(false);
  const [newChunk, setNewChunk] = useState({
    title: '',
    userImportance: 0.5,
    isReview: true
  });
  
  useEffect(() => {
    fetchTaskDetails();
  }, [id]);
  
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);
      const taskData = await TaskAPI.getTaskById(id);
      setTask(taskData);
      setTaskTitle(taskData.title);
      
      const chunksData = await TaskChunkAPI.getChunksByTask(id);
      setChunks(chunksData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching task details:', error);
      setLoading(false);
      navigate('/tasks');
    }
  };
  
  const handleUpdateTaskTitle = async () => {
    if (!taskTitle.trim() || taskTitle === task.title) {
      setTaskTitle(task.title);
      setEditingTaskTitle(false);
      return;
    }
    
    try {
      const updatedTask = await TaskAPI.updateTask(id, { title: taskTitle });
      setTask(updatedTask);
      setEditingTaskTitle(false);
    } catch (error) {
      console.error('Error updating task title:', error);
    }
  };
  
  const handleCreateChunk = async (e) => {
    e.preventDefault();
    
    if (!newChunk.title.trim()) return;
    
    try {
      const chunkData = {
        ...newChunk,
        parentTask: id
      };
      
      const createdChunk = await TaskChunkAPI.createTaskChunk(chunkData);
      setChunks([...chunks, createdChunk]);
      setNewChunk({
        title: '',
        userImportance: 0.5,
        isReview: true
      });
      setShowChunkForm(false);
    } catch (error) {
      console.error('Error creating task chunk:', error);
    }
  };
  
  const handleDeleteChunk = async (chunkId) => {
    if (!window.confirm('Are you sure you want to delete this chunk?')) return;
    
    try {
      await TaskChunkAPI.deleteTaskChunk(chunkId);
      setChunks(chunks.filter(chunk => chunk.id !== chunkId));
    } catch (error) {
      console.error('Error deleting task chunk:', error);
    }
  };
  
  const handleMarkMastered = async (chunkId) => {
    try {
      const updatedChunk = await TaskChunkAPI.updateTaskChunk(chunkId, { isMastered: true });
      setChunks(chunks.map(chunk => 
        chunk.id === chunkId ? updatedChunk : chunk
      ));
    } catch (error) {
      console.error('Error marking chunk as mastered:', error);
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
      <div className="mb-6">
        <button 
          onClick={() => navigate('/tasks')} 
          className="text-primary-600 hover:text-primary-800"
        >
          &larr; Back to Tasks
        </button>
      </div>
      
      {/* Task Title */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          {editingTaskTitle ? (
            <div className="flex-1 mr-4">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="form-input"
                placeholder="Task Title"
                autoFocus
              />
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-secondary-800">{task.title}</h1>
          )}
          
          <div>
            {editingTaskTitle ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setTaskTitle(task.title);
                    setEditingTaskTitle(false);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateTaskTitle}
                  className="btn-primary"
                >
                  Save
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setEditingTaskTitle(true)}
                className="p-2 text-secondary-500 hover:text-secondary-700"
              >
                <FaEdit />
              </button>
            )}
          </div>
        </div>
        <p className="text-secondary-500 mt-2">Created: {new Date(task.created_at).toLocaleDateString()}</p>
      </div>
      
      {/* Task Chunks */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-secondary-800">Task Chunks</h2>
          <button
            onClick={() => setShowChunkForm(!showChunkForm)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <FaPlus className="mr-2" />
            Add Chunk
          </button>
        </div>
        
        {/* Chunk Form */}
        {showChunkForm && (
          <div className="bg-secondary-50 rounded-lg p-4 mb-4">
            <h3 className="text-lg font-medium text-secondary-800 mb-3">Create New Chunk</h3>
            <form onSubmit={handleCreateChunk}>
              <div className="mb-4">
                <label htmlFor="chunk-title" className="form-label">Chunk Title</label>
                <input
                  type="text"
                  id="chunk-title"
                  value={newChunk.title}
                  onChange={(e) => setNewChunk({...newChunk, title: e.target.value})}
                  className="form-input"
                  placeholder="Enter chunk title"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="importance" className="form-label">
                  Importance (0.0 - 1.0)
                </label>
                <input
                  type="range"
                  id="importance"
                  min="0"
                  max="1"
                  step="0.1"
                  value={newChunk.userImportance}
                  onChange={(e) => setNewChunk({...newChunk, userImportance: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-secondary-500">
                  <span>Low: 0.0</span>
                  <span>Current: {newChunk.userImportance}</span>
                  <span>High: 1.0</span>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newChunk.isReview}
                    onChange={(e) => setNewChunk({...newChunk, isReview: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="form-label">Include in review schedule</span>
                </label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowChunkForm(false);
                    setNewChunk({
                      title: '',
                      userImportance: 0.5,
                      isReview: true
                    });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Chunk
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Chunks List */}
        {chunks.length === 0 ? (
          <p className="text-secondary-500">No chunks added yet. Add some chunks to start learning!</p>
        ) : (
          <div className="space-y-4">
            {chunks.map((chunk) => (
              <div 
                key={chunk.id} 
                className={`border rounded-lg p-4 ${chunk.is_mastered ? 'bg-green-50 border-green-200' : 'bg-white border-secondary-200'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-secondary-800">
                      {chunk.title}
                      {chunk.is_mastered && (
                        <span className="ml-2 badge badge-success">
                          <FaStar className="mr-1" /> Mastered
                        </span>
                      )}
                    </h3>
                    <div className="mt-2 text-sm text-secondary-500">
                      <p>Priority: {(chunk.priority * 100).toFixed(0)}%</p>
                      <p>Importance: {(chunk.user_importance * 100).toFixed(0)}%</p>
                      <p>
                        Last Reviewed: {chunk.last_reviewed ? new Date(chunk.last_reviewed).toLocaleDateString() : 'Never'}
                      </p>
                      {chunk.review_count > 0 && (
                        <p>Review Count: {chunk.review_count}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {!chunk.is_mastered && (
                      <button
                        onClick={() => handleMarkMastered(chunk.id)}
                        className="p-2 text-green-500 hover:text-green-700"
                        title="Mark as Mastered"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteChunk(chunk.id)}
                      className="p-2 text-red-500 hover:text-red-700"
                      title="Delete Chunk"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail; 