import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface InputMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export default function InputSettings() {
  const [inputMethods, setInputMethods] = useState<InputMethod[]>([
    { id: 'text', name: 'Text', enabled: true },
    { id: 'voice', name: 'Voice', enabled: false },
    { id: 'file', name: 'File Upload', enabled: false }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('input_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return;
    }

    if (data) {
      setInputMethods(prev => prev.map(method => ({
        ...method,
        enabled: data[`${method.id}_enabled`] ?? method.enabled
      })));
    }
    setIsLoading(false);
  };

  const toggleMethod = async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const newMethods = inputMethods.map(method => 
      method.id === id ? { ...method, enabled: !method.enabled } : method
    );

    const updates = {
      user_id: session.user.id,
      [`${id}_enabled`]: !inputMethods.find(m => m.id === id)?.enabled
    };

    const { error } = await supabase
      .from('input_settings')
      .upsert(updates, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating input methods:', error);
      return;
    }

    setInputMethods(newMethods);
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
      <div className="space-y-2">
        <h4 className="font-medium">Keyboard Shortcuts</h4>
        <button className="w-full px-3 py-2 text-left text-sm bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
          Configure Shortcuts
        </button>
      </div>
    </div>
  );
}