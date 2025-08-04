// Department Dashboard Data Models and Mock Data

export interface Employee {
  id: string;
  name: string;
  assignedQueries: number;
  resolvedQueries: number;
  pendingQueries: number;
  status: 'Active' | 'Inactive';
  department?: string;
  joinDate?: string;
}

export interface DepartmentSummaryStats {
  totalQueries: number;
  querySolvingRate: number; // as percentage
  averageResolutionTime: string;
  activeEmployees: number;
  pendingQueries: number;
  resolvedQueries: number;
}

export interface DepartmentDashboardData {
  title: string;
  description: string;
  summaryStats: DepartmentSummaryStats;
  employees: Employee[];
  lastUpdated: string;
}

// Mock data for Department Dashboard
export const mockDepartmentData: DepartmentDashboardData = {
  title: "Department Dashboard",
  description: "Track and manage queries assigned to your department.",
  summaryStats: {
    totalQueries: 125,
    querySolvingRate: 85,
    averageResolutionTime: "3 days",
    activeEmployees: 5,
    pendingQueries: 20,
    resolvedQueries: 105
  },
  employees: [
    {
      id: "emp_001",
      name: "Ethan Harper",
      assignedQueries: 30,
      resolvedQueries: 25,
      pendingQueries: 5,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-01-15"
    },
    {
      id: "emp_002", 
      name: "Olivia Bennett",
      assignedQueries: 25,
      resolvedQueries: 20,
      pendingQueries: 5,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-03-10"
    },
    {
      id: "emp_003",
      name: "Noah Carter", 
      assignedQueries: 20,
      resolvedQueries: 18,
      pendingQueries: 2,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-02-20"
    },
    {
      id: "emp_004",
      name: "Ava Mitchell",
      assignedQueries: 25,
      resolvedQueries: 22,
      pendingQueries: 3,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-04-05"
    },
    {
      id: "emp_005",
      name: "Liam Foster",
      assignedQueries: 25,
      resolvedQueries: 20,
      pendingQueries: 5,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-01-30"
    }
  ],
  lastUpdated: new Date().toISOString()
};

// Future: Additional dashboard data types for MLA and Normal User roles
export interface MLADashboardData {
  // To be defined when converting MLA dashboard
}

export interface UserDashboardData {
  // To be defined when converting User dashboard  
}

// Data fetching functions (mock for now, will be replaced with API calls)
export const fetchDepartmentDashboardData = async (): Promise<DepartmentDashboardData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockDepartmentData;
};

export const fetchMLADashboardData = async (): Promise<MLADashboardData> => {
  // To be implemented
  throw new Error("MLA dashboard data not yet implemented");
};

export const fetchUserDashboardData = async (): Promise<UserDashboardData> => {
  // To be implemented  
  throw new Error("User dashboard data not yet implemented");
};
