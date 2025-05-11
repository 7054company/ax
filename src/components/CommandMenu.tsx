import React, { useState, useEffect } from 'react';
import { Command, Search, Settings, User, Server, Activity, Home, LogOut, Github, Sun, Moon, Monitor } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ isOpen, setIsOpen }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    localStorage.setItem('theme', theme);
  };

  const commands = [
    { icon: <Home size={16} />, label: 'Go to Dashboard', action: () => navigate('/') },
    { icon: <Server size={16} />, label: 'View Services', action: () => navigate('/services') },
    { icon: <Activity size={16} />, label: 'View Activity', action: () => navigate('/activity') },
    { icon: <User size={16} />, label: 'Account Settings', action: () => navigate('/account') },
    { icon: <Settings size={16} />, label: 'Settings', action: () => navigate('/settings') },
    { icon: <Github size={16} />, label: 'View Source', action: () => window.open('https://github.com', '_blank') },
    { icon: <LogOut size={16} />, label: 'Sign Out', action: () => console.log('Sign out') },
    { type: 'separator', label: 'Theme' },
    { icon: <Sun size={16} />, label: 'Light Theme', action: () => handleThemeChange('light') },
    { icon: <Moon size={16} />, label: 'Dark Theme', action: () => handleThemeChange('dark') },
    { icon: <Monitor size={16} />, label: 'System Theme', action: () => handleThemeChange('system') },
  ];

  const filteredCommands = commands.filter(command =>
    'type' in command ? true : command.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0 bg-gray-900/50 transition-opacity" onClick={() => setIsOpen(false)} />
        
        <div className="inline-block w-full max-w-md my-16 text-left align-middle transition-all transform">
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-2xl">
            <div className="border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2 px-4 py-3">
                <Command className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 text-sm"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto py-2">
              {filteredCommands.map((command, index) => {
                if ('type' in command && command.type === 'separator') {
                  return (
                    <div key={command.label} className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
                      {command.label}
                    </div>
                  );
                }

                if (!('action' in command)) return null;

                return (
                  <button
                    key={command.label}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 ${
                      selectedIndex === index
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                    onClick={() => {
                      command.action();
                      setIsOpen(false);
                    }}
                  >
                    {command.icon}
                    {command.label}
                  </button>
                );
              })}
              
              {filteredCommands.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  No commands found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandMenu;