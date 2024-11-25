import { useContext } from 'react';
import { Command } from 'cmdk';
import { CredentialContext } from '../pages/_app';

export default function CommandPalette() {
  const { credentialLevel } = useContext(CredentialContext);
  const isAnonymous = credentialLevel === 'anonymous';

  return (
    <Command className="relative z-50">
      <div className="relative">
        <Command.Input 
          placeholder={isAnonymous ? "Please log in to use commands" : "Type a command or search..."}
          disabled={isAnonymous}
          className={`w-96 rounded-lg border-2 border-gray-300 py-2 pl-4 pr-10 text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isAnonymous ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
          }`}
        />
      </div>
      {!isAnonymous && (
        <Command.List>
          {/* Your existing command list items */}
        </Command.List>
      )}
    </Command>
  );
}