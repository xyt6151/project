import { useState } from 'react';

interface InputMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export function InputSettings() {
  const [inputMethods, setInputMethods] = useState<InputMethod[]>([
    { id: 'text', name: 'Text', enabled: true },
    { id: 'voice', name: 'Voice', enabled: false },
    { id: 'file', name: 'File Upload', enabled: false }
  ]);

  const toggleMethod = (id: string) => {
    setInputMethods(prev => prev.map(method => 
      method.id === id ? { ...method, enabled: !method.enabled } : method
    ));
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <h4 className="font-medium">Input Methods</h4>
        {inputMethods.map(method => (
          <label key={method.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={method.enabled}
              onChange={() => toggleMethod(method.id)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span>{method.name}</span>
          </label>
        ))}
      </div>
      <div className="space-y-2">
        <h4 className="font-medium">Keyboard Shortcuts</h4>
        <button className="w-full px-3 py-2 text-left text-sm bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
          Configure Shortcuts
        </button>
      </div>
    </div>
  );
}