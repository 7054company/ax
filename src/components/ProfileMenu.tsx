import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Bell, X, ExternalLink, Sun, Moon, Monitor, Command } from 'lucide-react';

interface ProfileMenuProps {
  setCommandMenuOpen: (open: boolean) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ setCommandMenuOpen }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
    }
    return 'system';
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const notifications = [
    {
      id: 1,
      title: 'New deployment successful',
      description: 'Your application was deployed to production',
      time: '2 minutes ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Database backup completed',
      description: 'Weekly backup finished successfully',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: 3,
      title: 'System update available',
      description: 'New security patches are ready to install',
      time: '3 hours ago',
      unread: false,
    },
  ];

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileOpen(false);
    if (hasNotifications) setHasNotifications(false);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
    setIsNotificationsOpen(false);
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className="flex items-center gap-4" ref={menuRef}>
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
        onClick={handleNotificationClick}
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        {hasNotifications && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
        )}
      </button>

      <button
        onClick={handleProfileClick}
        className="relative rounded-full transition-all duration-200 group"
      >
        <img
          className="h-8 w-8 rounded-full ring-2 ring-transparent group-hover:ring-blue-400/50"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="User avatar"
        />
      </button>

      {isNotificationsOpen && (
        <div className="absolute right-4 top-14 w-96 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 z-20 ring-1 ring-black/5 dark:ring-white/10">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-start gap-x-3">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${notification.unread ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{notification.description}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800">
            <a
              href="#"
              className="flex items-center justify-center text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-150"
            >
              View all notifications
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="absolute right-4 top-14 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 z-20 ring-1 ring-black/5 dark:ring-white/10">
          <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">John Doe</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">john@example.com</p>
          </div>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 flex items-center"
          >
            <User className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
            Profile
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 flex items-center"
          >
            <Settings className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
            API
          </a>

          <button
            onClick={() => setCommandMenuOpen(true)}
            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 flex items-center justify-between"
          >
            <div className="flex items-center">
              <Command className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <span>Command Menu</span>
            </div>
            <kbd className="ml-2 inline-flex items-center gap-1 rounded border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </button>
          
          <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
              <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-md p-0.5">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`p-1 rounded ${
                    theme === 'light' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                  } transition-all duration-200`}
                  title="Light theme"
                >
                  <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`p-1 rounded ${
                    theme === 'dark' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                  } transition-all duration-200`}
                  title="Dark theme"
                >
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleThemeChange('system')}
                  className={`p-1 rounded ${
                    theme === 'system' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''
                  } transition-all duration-200`}
                  title="System theme"
                >
                  <Monitor className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 flex items-center"
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              Logout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;