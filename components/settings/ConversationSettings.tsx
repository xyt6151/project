import { useState } from 'react';

export default function ConversationSettings() {
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
}