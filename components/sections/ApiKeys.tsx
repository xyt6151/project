import { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useCredentialAccess } from '../../lib/hooks/useCredentialAccess';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function ApiKeys() {
  const { hasAccess, isLoading, client } = useCredentialAccess('ApiKeys');
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    if (hasAccess) {
      fetchApiKeys();
    }
  }, [hasAccess]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await client
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01') {
          console.error('Table api_keys does not exist');
          return;
        }
        console.error('Error fetching API keys:', error);
        return;
      }

      setKeys(data || []);
    } catch (err) {
      console.error('Failed to fetch API keys:', err);
    }
  };

  const handleAddKey = async () => {
    if (!newKeyName.trim()) return;
    
    const newKey = {
      name: newKeyName,
      key: `pk_${Math.random().toString(36).substring(2, 15)}`
    };
    
    const { error } = await client
      .from('api_keys')
      .insert([newKey]);

    if (error) {
      console.error('Error adding API key:', error);
      return;
    }
    
    fetchApiKeys();
    setNewKeyName('');
  };

  const handleDeleteKey = async (id: string) => {
    const { error } = await client
      .from('api_keys')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting API key:', error);
      return;
    }

    fetchApiKeys();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <div>You don&apos;t have permission to access this section.</div>;
  }

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
                Created: {formatDate(key.created_at)}
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