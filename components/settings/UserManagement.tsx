import { useState, useEffect } from 'react';
import { supabase, getPrivilegedClient } from '../../lib/supabase';
import { useCredentialAccess } from '../../lib/hooks/useCredentialAccess';

interface User {
  id: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
}

export default function UserManagement() {
  const { hasAccess, isLoading: accessLoading, client } = useCredentialAccess('UserManagement');
  const [users, setUsers] = useState<User[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  if (accessLoading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return <div>You don&apos;t have permission to access this section.</div>;
  }

  const fetchUsers = async () => {
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
    setIsLoading(false);
  };

  const handleAddUser = async () => {
    if (!newUserEmail.trim()) return;

    const { error } = await client
      .from('users')
      .insert([{
        email: newUserEmail,
        role: newUserRole,
        active: true
      }]);

    if (error) {
      console.error('Error adding user:', error);
      return;
    }

    fetchUsers();
    setNewUserEmail('');
    setNewUserRole('viewer');
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await client
      .from('users')
      .update({ active: !currentStatus })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user status:', error);
      return;
    }

    fetchUsers();
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="flex gap-2">
        <input
          type="email"
          value={newUserEmail}
          onChange={(e) => setNewUserEmail(e.target.value)}
          placeholder="Email address"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={newUserRole}
          onChange={(e) => setNewUserRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add User
        </button>
      </div>

      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
            <div>
              <div className="font-medium">{user.email}</div>
              <div className="text-sm text-gray-500">Role: {user.role}</div>
            </div>
            <button
              onClick={() => toggleUserStatus(user.id, user.active)}
              className={`px-3 py-1 rounded-md text-sm ${
                user.active 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {user.active ? 'Active' : 'Inactive'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}