import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';

const commands = [
  { id: 1, name: 'Open Chat' },
  { id: 2, name: 'Settings' },
  { id: 3, name: 'API Keys' },
];

export default function CommandPalette() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const filteredCommands = query === ''
    ? commands
    : commands.filter((command) =>
        command.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-96 z-50">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative">
          <Combobox.Input
            className="w-full rounded-lg border-2 border-gray-300 bg-white py-2 px-4 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a command..."
            onChange={(event) => setQuery(event.target.value)}
          />
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredCommands.map((command) => (
                <Combobox.Option
                  key={command.id}
                  value={command}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 px-4 ${
                      active ? 'bg-blue-500 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {command.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}