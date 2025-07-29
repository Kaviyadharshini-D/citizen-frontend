import React from 'react';
import { useUser, UserRole } from '../context/UserContext';

export function RoleSwitcher() {
  const { user, setUser } = useUser();

  const roles: { role: UserRole; position: string }[] = [
    { role: 'MLA', position: 'MLA, Ward 14' },
    { role: 'Department', position: 'Public Works Department' },
    { role: 'Normal User', position: 'Citizen, Ward 14' },
  ];

  const handleRoleChange = (newRole: UserRole, position: string) => {
    setUser({
      ...user,
      role: newRole,
      position: position,
    });
  };

  return (
    <div className="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
      <div className="text-sm font-medium text-gray-900 mb-2">Switch Role (Testing)</div>
      <div className="space-y-2">
        {roles.map(({ role, position }) => (
          <button
            key={role}
            onClick={() => handleRoleChange(role, position)}
            className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
              user.role === role
                ? 'bg-blue-100 text-blue-900 font-medium'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            {role}
          </button>
        ))}
      </div>
    </div>
  );
}
