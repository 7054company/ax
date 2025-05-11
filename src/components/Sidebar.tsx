import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Settings, ChevronRight, Server, Activity } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  return (
    <div
      className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-16'
      } h-full flex flex-col`}
    >
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
        <SidebarLink to="/" icon={<Home size={20} />} text="Dashboard" isOpen={isOpen} />
        <SidebarLink to="/services" icon={<Server size={20} />} text="Services" isOpen={isOpen} />
        <SidebarLink to="/activity" icon={<Activity size={20} />} text="Activity" isOpen={isOpen} />
        <SidebarLink to="/account" icon={<User size={20} />} text="Account" isOpen={isOpen} />
        <SidebarLink to="/settings" icon={<Settings size={20} />} text="Settings" isOpen={isOpen} />
      </nav>
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center text-gray-500 hover:text-gray-600 focus:outline-none"
        >
          <ChevronRight size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          {isOpen && <span className="ml-2 text-sm font-medium">Collapse</span>}
        </button>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isOpen: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, text, isOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center py-2 px-4 ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      } transition-colors duration-200`}
    >
      <span className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{icon}</span>
      {isOpen && <span className="ml-4 text-sm font-medium">{text}</span>}
    </Link>
  );
};

export default Sidebar;