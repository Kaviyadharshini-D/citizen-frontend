import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User as AuthUser, UserRole } from "../types/auth";
import { authService } from "../services/authService";

interface User {
  name: string;
  role: UserRole;
  position: string;
  avatar: string;
  constituency_id: string;
  constituency_name: string;
  panchayat_id: string;
  panchayat_name: string;
  ward_no: string;
  ward_name: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const apiUser = JSON.parse(userData);
        // Map API user to context user format
        const roleMapping: Record<string, UserRole> = {
          citizen: "citizen",
          mlastaff: "mlastaff",
          dept: "dept",
          dept_staff: "dept_staff",
          admin: "admin",
        };

        const userRole = roleMapping[apiUser.role] || "citizen";

        // Set appropriate position based on role
        const getPositionFromRole = (role: string): string => {
          switch (role) {
            case "mlastaff":
              return "Member of Legislative Assembly";
            case "dept":
              return "Department Officer";
            case "dept_staff":
              return "Department Staff";
            case "admin":
              return "Administrator";
            case "citizen":
              return "Citizen";
            default:
              return "User";
          }
        };
        setUser({
          name: apiUser.name,
          role: userRole,
          position: apiUser.position || getPositionFromRole(userRole),
          avatar: apiUser.avatar || "",
          constituency_id: apiUser.constituency_id || "",
          constituency_name: apiUser.constituency_name || "",
          panchayat_id: apiUser.panchayat_id || "",
          panchayat_name: apiUser.panchayat_name || "",
          ward_no: apiUser.ward_no || "",
          ward_name: apiUser.ward_name || "",
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid data
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }

    setIsInitialized(true);
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = user !== null;

  // Don't render children until context is initialized
  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, isAuthenticated }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export type { UserRole };
