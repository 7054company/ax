import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Settings from './pages/Settings';
import Services from './pages/Services';
import Activity from './pages/Activity';
import { Layout } from 'lucide-react';
import ProfileMenu from './components/ProfileMenu';
import CommandMenu from './components/CommandMenu';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 fixed w-full z-10">
          <div className="h-16 px-4 flex items-center justify-between">
            <div className="flex items-center flex-1">
              <Layout className="h-8 w-8 text-blue-500 mr-2" />
              <span className="font-bold text-xl text-gray-800">MyDashboard</span>
            </div>
            <div className="flex items-center ml-auto">
              <ProfileMenu setCommandMenuOpen={setCommandMenuOpen} />
            </div>
          </div>
        </header>
        <div className="flex flex-1 pt-16 overflow-hidden">
          <div ref={sidebarRef}>
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          </div>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/account" element={<Account />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/services" element={<Services />} />
                <Route path="/activity" element={<Activity />} />
              </Routes>
            </div>
          </main>
        </div>
        <CommandMenu isOpen={commandMenuOpen} setIsOpen={setCommandMenuOpen} />
      </div>
    </Router>
  );
}

export default App;