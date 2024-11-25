import { useState } from 'react';

export default function ApiSettings() {
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
}