import { useState } from 'react';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

interface ApiKey {
  id: number;
  name: string;
  key: string;
  created: Date;
}

export default function ApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([
    { id: 1, name: 'Production API Key', key: 'pk_live_123456789', created: new Date(2023, 11, 1) },
    { id: 2, name: 'Development API Key', key: 'pk_test_987654321', created: new Date(2023, 11, 15) }
  ]);
  const [showKey, setShowKey] = useState<number | null>(null);
  const [newKeyName, setNewKeyName] = useState('');

  const handleAddKey = () => {
    if (!newKeyName.trim()) return;
    
    const newKey: ApiKey = {
      id: Date.now(),
      name: newKeyName,
      key: `pk_${Math.random().toString(36).substring(2, 15)}`,
      created: new Date()
    };
    
    setKeys(prev => [...prev, newKey]);
    setNewKeyName('');
  };

  const handleDeleteKey = (id: number) => {
    setKeys(prev => prev.filter(key => key.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="New API Key Name"
          className="flex-1 rounded-lg border-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddKey}
          className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600 transition-colors flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Key
        </button>
      </div>

      <div className="space-y-4">
        {keys.map(key => (
          <div key={key.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{key.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {showKey === key.id ? key.key : '••••••••••••••••'}
                </code>
                <button
                  onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showKey === key.id ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Created: {key.created.toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => handleDeleteKey(key.id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}