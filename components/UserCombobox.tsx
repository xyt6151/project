import { Fragment, useState, useEffect } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
}

export default function UserCombobox() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordMode, setIsPasswordMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkCurrentSession();
  }, []);

  const handleInputSubmit = async () => {
    if (!query.trim()) return;
    setSelected(user);
    if (!isPasswordMode) {
      setIsLoading(true);
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: query,
          password: 'dummy_password'
        });

        if (error && error.message.includes('Invalid login credentials')) {
          setSelected({
            id: '',
            email: query,
            role: 'user'
          });
          setIsPasswordMode(true);
          setQuery('');
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error checking user:', error);
      } finally {
        setIsLoading(false);
      }
      return;
    } else if (query.trim()) {
      try {
        setIsLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email: selected?.email || '',
          password: query
        });

        if (error) throw error;

        if (!isLoggedIn && query.length > 0) {
          setIsLoggedIn(true);
          setIsPasswordMode(false);
          setQuery(selected?.email || '');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        setIsPasswordMode(false);
        setSelected(null);
        setQuery('');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredUsers = query === ''
    ? []
    : users;

  const checkCurrentSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsLoggedIn(true);
      setQuery(session.user.email || '');
      setSelected({
        id: session.user.id,
        email: session.user.email || '',
        role: session.user.user_metadata?.role || 'user'
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      return;
    }
    
    setIsLoggedIn(false);
    setIsPasswordMode(false);
    setSelected(null);
    setQuery('');
    setUsers([]);
  };

  const getPlaceholderText = () => {
    if (isLoggedIn) return selected?.email;
    if (isPasswordMode) return "Password...";
    return "Username...";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  return (
    <div className="w-64">
      <Combobox value={selected} onChange={setSelected} disabled={isLoggedIn}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className="w-full rounded-lg border-2 border-gray-300 bg-white py-2 pl-4 pr-10 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder={getPlaceholderText()}
              type={isPasswordMode ? "password" : "text"}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleKeyPress}
              value={query}
              readOnly={isLoggedIn}
            />
            <button
              onClick={isLoggedIn ? handleLogout : handleInputSubmit}
              disabled={isLoading}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:opacity-75 transition-opacity"
            >
              {isLoading ? (
                <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent" />
              ) : isLoggedIn ? (
                <LockOpenIcon className="h-5 w-5 text-green-500" />
              ) : (
                <LockClosedIcon className="h-5 w-5 text-red-500" />
              )}
            </button>
          </div>
        </div>
      </Combobox>
    </div>
  );
}