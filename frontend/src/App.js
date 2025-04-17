import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import DailySchedule from './pages/DailySchedule';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/schedule" element={<DailySchedule />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App; 