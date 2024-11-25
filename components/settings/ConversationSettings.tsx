import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function ConversationSettings() {
  const [settings, setSettings] = useState({
    responseStyle: 'Professional',
    memoryContext: 5
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('conversation_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      return;
    }

    if (data) {
      setSettings({
        responseStyle: data.response_style || 'Professional',
        memoryContext: data.memory_context || 5
      });
    }
    setIsLoading(false);
  };

  const updateSetting = async (key: string, value: string | number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const updates = {
      user_id: session.user.id,
      [key === 'responseStyle' ? 'response_style' : 'memory_context']: value,
    };

    const { error } = await supabase
      .from('conversation_settings')
      .upsert(updates, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating settings:', error);
      return;
    }

    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Response Style</h4>
        <select
          value={settings.responseStyle}
          onChange={(e) => updateSetting('responseStyle', e.target.value)}
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