import { Fragment, useState, KeyboardEvent } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';

const users = [
  { id: 1, name: 'alice_dev' },
  { id: 2, name: 'bob_admin' },
  { id: 3, name: 'charlie_user' },
  { id: 4, name: 'diana_test' },
];

export default function UserCombobox() {
  const [selected, setSelected] = useState<any>(null);
  const [query, setQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredUsers = query === ''
    ? []
    : users.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (user: any) => {
    setSelected(user);
    setQuery(user.name);
    setShowSuggestions(false);
  };

  const handleLogin = () => {
    if (query.trim()) {
      setIsLoggedIn(true);
      setShowSuggestions(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelected(null);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!isLoggedIn && query.trim()) {
        handleLogin();
      }
      setShowSuggestions(false);
    }
  };

  const handleLockClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else if (query.trim()) {
      handleLogin();
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
  };

  const handleInputFocus = () => {
    if (!isLoggedIn && query.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow option selection to complete
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div className="w-64">
      <Combobox value={selected} onChange={handleSelect} disabled={isLoggedIn}>
        <div className="relative">
          <div className="relative w-full">
            <Combobox.Input
              className="w-full rounded-lg border-2 border-gray-300 bg-white py-2 pl-4 pr-10 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              placeholder="Username..."
              onChange={(event) => handleInputChange(event.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={query}
              readOnly={isLoggedIn}
            />
            <button
              onClick={handleLockClick}
              className={`absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:opacity-75 transition-opacity ${!isLoggedIn && !query.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isLoggedIn ? "Log out" : "Log in"}
              disabled={!isLoggedIn && !query.trim()}
            >
              {isLoggedIn ? (
                <LockOpenIcon className="h-5 w-5 text-green-500" aria-hidden="true" />
              ) : (
                <LockClosedIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              )}
            </button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            show={showSuggestions && filteredUsers.length > 0 && !isLoggedIn}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredUsers.map((user) => (
                <Combobox.Option
                  key={user.id}
                  value={user}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {user.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}