import React from 'react';
import { Bell, Lock, Eye, Moon, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings</h2>
      <div className="space-y-6">
        <SettingItem
          icon={<Bell className="text-blue-500" />}
          title="Notifications"
          description="Manage your notification preferences"
        />
        <SettingItem
          icon={<Lock className="text-green-500" />}
          title="Privacy"
          description="Control your privacy settings"
        />
        <SettingItem
          icon={<Eye className="text-purple-500" />}
          title="Appearance"
          description="Customize the look and feel of the dashboard"
        />
        <SettingItem
          icon={<Moon className="text-yellow-500" />}
          title="Dark Mode"
          description="Toggle dark mode on or off"
          toggle
        />
      </div>
    </div>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  toggle?: boolean;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, title, description, toggle }) => {
  const [isOn, setIsOn] = React.useState(false);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg transition-all duration-200 hover:bg-gray-100">
      <div className="flex items-center">
        <div className="mr-4">{icon}</div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {toggle ? (
        <button
          onClick={() => setIsOn(!isOn)}
          className={`p-1 rounded-full ${isOn ? 'bg-blue-500' : 'bg-gray-300'}`}
        >
          {isOn ? <ToggleRight size={24} className="text-white" /> : <ToggleLeft size={24} className="text-gray-500" />}
        </button>
      ) : (
        <button className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          Manage
        </button>
      )}
    </div>
  );
};

export default Settings;