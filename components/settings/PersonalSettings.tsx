import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { supabase } from '../../lib/supabase';

export default function PersonalSettings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    emailNotifications: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching settings:', error);
      return;
    }

    if (data) {
      setSettings({
        darkMode: data.dark_mode || false,
        emailNotifications: data.email_notifications || true
      });
    }
    setIsLoading(false);
  };

  const updateSetting = async (key: string, value: boolean) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const updates = {
      user_id: session.user.id,
      [key === 'darkMode' ? 'dark_mode' : 'email_notifications']: value,
    };

    const { error } = await supabase
      .from('user_settings')
      .upsert(updates, { onConflict: 'user_id' });

    if (error) {
      console.error('Error updating settings:', error);
      return;
    }

    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="space-y-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium">Dark Mode</h4>
          <p className="text-sm text-gray-500">Enable dark theme for the interface</p>
        </div>
        <Switch
          checked={settings.darkMode}
          onChange={(checked) => updateSetting('darkMode', checked)}
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
          onChange={(checked) => updateSetting('emailNotifications', checked)}
          className={`${settings.emailNotifications ? 'bg-blue-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
        >
          <span className={`${settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
        </Switch>
      </div>
    </div>
  );
}