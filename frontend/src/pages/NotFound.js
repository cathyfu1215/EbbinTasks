import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-secondary-800 mb-6">Page Not Found</h2>
      <p className="text-secondary-600 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Link 
        to="/"
        className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
      >
        <FaHome className="mr-2" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound; 