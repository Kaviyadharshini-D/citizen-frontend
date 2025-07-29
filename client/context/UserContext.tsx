import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'MLA' | 'Department' | 'Normal User';

interface User {
  name: string;
  role: UserRole;
  position: string;
  avatar: string;
}

interface UserContextType {
  user: User;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>({
    name: "Aisha Sharma",
    role: "Department", // Set to Department to show the Department Dashboard by default
    position: "Public Works Department",
    avatar: "https://api.builder.io/api/v1/image/assets/TEMP/dd574254d520b2926427eec623a82531a0d2be4d?width=80"
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
