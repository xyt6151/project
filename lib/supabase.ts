import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getPrivilegedClient = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) return supabase;

  return createClient(supabaseUrl, session.access_token);
};

export interface UiData {
  id: string;
  created_at: string;
  name: string;
  data: any;
  type: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  user_id?: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  dark_mode: boolean;
  email_notifications: boolean;
  response_style: string;
  memory_context: number;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  user_id?: string;
}

export const promoteUser = async (userId: string, newRole: 'user' | 'privileged' | 'admin') => {
  const { data, error } = await supabase
    .from('users')
    .update({ role: newRole })
    .eq('id', userId);
    
  if (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
  
  return data;
};