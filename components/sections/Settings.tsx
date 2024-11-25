import { useState } from 'react';
import { UserIcon, CogIcon, UsersIcon, ChatBubbleLeftRightIcon, KeyboardIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

// Sub-components for settings sections
const PersonalSettings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true
  });

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Dark Mode</h4>
          <p className="text-sm text-gray-500">Enable dark theme for the interface</p>
        </div>
        <button
          onClick={() => setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))}
          className={`${settings.darkMode ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Email Notifications</h4>
          <p className="text-sm text-gray-500">Receive email updates</p>
        </div>
        <button
          onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
          className={`${settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span className={`${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </button>
      </div>
    </div>
  );
};

const ApiSettings = () => {
  const [settings, setSettings] = useState({
    webhookUrl: '',
    apiVersion: 'v1.0'
  });

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Webhook URL</h4>
        <input
          type="text"
          value={settings.webhookUrl}
          onChange={(e) => setSettings(prev => ({ ...prev, webhookUrl: e.target.value }))}
          placeholder="https://"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">API Version</h4>
        <select
          value={settings.apiVersion}
          onChange={(e) => setSettings(prev => ({ ...prev, apiVersion: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="v1.0">v1.0</option>
          <option value="v2.0">v2.0</option>
          <option value="v3.0">v3.0 (Beta)</option>
        </select>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users] = useState([
    { id: '1', role: 'Admin', active: true },
    { id: '2', role: 'Editor', active: true },
    { id: '3', role: 'Viewer', active: true }
  ]);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Active Users</h4>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Add User
        </button>
      </div>
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <span>{user.role}</span>
            <button className="text-sm text-gray-500 hover:text-gray-700">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConversationSettings = () => {
  const [settings, setSettings] = useState({
    responseStyle: 'Professional',
    memoryContext: 5
  });

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Response Style</h4>
        <select
          value={settings.responseStyle}
          onChange={(e) => setSettings(prev => ({ ...prev, responseStyle: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Professional</option>
          <option>Casual</option>
          <option>Technical</option>
        </select>
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Memory Context</h4>
        <input
          type="range"
          className="w-full"
          min="1"
          max="10"
          value={settings.memoryContext}
          onChange={(e) => setSettings(prev => ({ ...prev, memoryContext: Number(e.target.value) }))}
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Short</span>
          <span>Long</span>
        </div>
      </div>
    </div>
  );
};

const InputSettings = () => {
  const [inputMethods, setInputMethods] = useState([
    { id: 'text', name: 'Text', enabled: true },
    { id: 'voice', name: 'Voice', enabled: false },
    { id: 'file', name: 'File Upload', enabled: false }
  ]);

  const toggleMethod = (id: string) => {
    setInputMethods(prev => prev.map(method => 
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Input Methods</h4>
        {inputMethods.map(method => (
          <label key={method.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={method.enabled}
              onChange={() => toggleMethod(method.id)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span>{method.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// SettingsSection component
const SettingsSection = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <ChevronDownIcon 
          className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {children}
        </div>
      )}
    </div>
  );
};

// Main Settings component
export default function Settings() {
  const [sections, setSections] = useState([
    { id: 'personal', title: 'Personal Settings', icon: UserIcon, isOpen: false, component: PersonalSettings },
    { id: 'api', title: 'API/Webhook Settings', icon: CogIcon, isOpen: false, component: ApiSettings },
    { id: 'users', title: 'User Management', icon: UsersIcon, isOpen: false, component: UserManagement },
    { id: 'conversation', title: 'Conversation Settings', icon: ChatBubbleLeftRightIcon, isOpen: false, component: ConversationSettings },
    { id: 'input', title: 'User Input Methods', icon: KeyboardIcon, isOpen: false, component: InputSettings }
  ]);

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      isOpen: section.id === id ? !section.isOpen : section.isOpen
    })));
  };

  return (
    <div className="space-y-4">
      {sections.map(section => {
        const Component = section.component;
        return (
          <SettingsSection
            key={section.id}
            title={section.title}
            icon={section.icon}
            isOpen={section.isOpen}
            onToggle={() => toggleSection(section.id)}
          >
            <Component />
          </SettingsSection>
        );
      })}
    </div>
  );
}