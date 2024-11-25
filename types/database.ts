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
