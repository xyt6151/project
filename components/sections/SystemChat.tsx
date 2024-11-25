import { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useCredentialAccess } from '../../lib/hooks/useCredentialAccess';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
  user_id?: string;
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export default function SystemChat() {
  const { hasAccess, isLoading, client } = useCredentialAccess('SystemChat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState<any>(null);

  const checkSession = async () => {
    const { data: { session: currentSession } } = await client.auth.getSession();
    setSession(currentSession);
  };

  const fetchMessages = async () => {
    if (!hasAccess) return;
    
    const { data, error } = await client
      .from('messages')
      .select('*')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    setMessages(data || []);
  };

  useEffect(() => {
    checkSession();
    fetchMessages();

    // Subscribe to new messages
    const channel = client
      .channel('chat_messages')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [client, hasAccess]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <div>You don&apos;t have permission to access this section.</div>;
  }

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const newMsg: Partial<Message> = {
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString(),
      user_id: session?.user?.id
    };

    const { error } = await client
      .from('messages')
      .insert(newMsg);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }

    setNewMessage('');
  };

  return (
    <div className="h-[320px] flex flex-col">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-75 mt-1">
                {formatTime(new Date(message.timestamp))}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          className="flex-1 rounded-lg border-2 border-gray-300 p-2 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}