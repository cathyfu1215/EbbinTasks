import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBrain, FaList, FaCalendarAlt } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  
  // Helper to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-700' : '';
  };

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
            <FaBrain className="text-2xl" />
            <span>EbbinTasks</span>
          </Link>
          
          <div className="hidden md:flex space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 ${isActive('/')}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/tasks" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 ${isActive('/tasks')}`}
            >
              Tasks
            </Link>
            <Link 
              to="/schedule" 
              className={`px-3 py-2 rounded-md text-sm font-medium hover:bg-primary-700 ${isActive('/schedule')}`}
            >
              Today's Schedule
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="flex md:hidden space-x-4">
            <Link to="/" className={`p-2 rounded-md ${isActive('/')}`}>
              <FaBrain />
            </Link>
            <Link to="/tasks" className={`p-2 rounded-md ${isActive('/tasks')}`}>
              <FaList />
            </Link>
            <Link to="/schedule" className={`p-2 rounded-md ${isActive('/schedule')}`}>
              <FaCalendarAlt />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 