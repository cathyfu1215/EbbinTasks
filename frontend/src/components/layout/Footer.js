import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">EbbinTasks</h3>
            <p className="text-sm text-secondary-300">
              Spaced repetition task management system
            </p>
          </div>
          
          <div className="text-secondary-300 text-sm">
            &copy; {currentYear} EbbinTasks. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 