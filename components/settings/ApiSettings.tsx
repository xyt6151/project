import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ApiSettings {
  webhookUrl: string;
  apiVersion: string;
}

export default function ApiSettings() {
  const [settings, setSettings] = useState<ApiSettings>({
    webhookUrl: '',
    apiVersion: 'v1.0'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data, error } = await supabase
      .from('api_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching API settings:', error);
      return;
    }

    if (data) {
      setSettings({
        webhookUrl: data.webhook_url || '',
        apiVersion: data.api_version || 'v1.0'
      });
    }
    setIsLoading(false);
  };

  const updateSetting = async (key: keyof ApiSettings, value: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const updates = {
      user_id: session.user.id,
      [key === 'webhookUrl' ? 'webhook_url' : 'api_version']: value
    };

    const { error } = await supabase
      .from('api_settings')
      .upsert(updates, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating API settings:', error);
      return;
    }

    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Webhook URL</h4>
        <input
          type="text"
          value={settings.webhookUrl}
          onChange={(e) => updateSetting('webhookUrl', e.target.value)}
          placeholder="https://"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">API Version</h4>
        <select
          value={settings.apiVersion}
          onChange={(e) => updateSetting('apiVersion', e.target.value)}
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