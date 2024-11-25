import { useState } from 'react';
import { Switch } from '@headlessui/react';

export default function PersonalSettings() {
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
        <Switch
          checked={settings.darkMode}
          onChange={(checked) => setSettings(prev => ({ ...prev, darkMode: checked }))}
          className={`${settings.darkMode ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span className={`${settings.darkMode ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </Switch>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Email Notifications</h4>
          <p className="text-sm text-gray-500">Receive email updates</p>
        </div>
        <Switch
          checked={settings.emailNotifications}
          onChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
          className={`${settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span className={`${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </Switch>
      </div>
    </div>
  );
}