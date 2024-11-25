import { useState } from 'react';

interface User {
  id: string;
  role: string;
  active: boolean;
}

export default function UserManagement() {
  const [users] = useState<User[]>([
    { id: '1', role: 'Admin', active: true },
    { id: '2', role: 'Editor', active: true },
    { id: '3', role: 'Viewer', active: true }
  ]);

  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Active Users</h4>
        <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Add User
        </button>
      </div>
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
            <span>{user.role}</span>
            <button className="text-sm text-gray-500 hover:text-gray-700">Manage</button>
          </div>
        ))}
      </div>
    </div>
  );
}