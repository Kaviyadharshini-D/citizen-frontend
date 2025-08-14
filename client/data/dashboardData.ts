// Department Dashboard Data Models and Mock Data
// TODO: These interfaces and data will be replaced with API calls when backend endpoints are available

export interface Employee {
  id: string;
  name: string;
  assignedQueries: number;
  resolvedQueries: number;
  pendingQueries: number;
  status: "Active" | "Inactive";
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

// Mock data for Department Dashboard - COMMENTED OUT: No corresponding API endpoints
/*
export const mockDepartmentData: DepartmentDashboardData = {
  title: "Department Dashboard",
  description: "Track and manage queries assigned to your department.",
  summaryStats: {
    totalQueries: 125,
    querySolvingRate: 85,
    averageResolutionTime: "3 days",
    activeEmployees: 5,
    pendingQueries: 20,
    resolvedQueries: 105,
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
      joinDate: "2023-01-15",
    },
    {
      id: "emp_002",
      name: "Olivia Bennett",
      assignedQueries: 25,
      resolvedQueries: 20,
      pendingQueries: 5,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-03-10",
    },
    {
      id: "emp_003",
      name: "Noah Carter",
      assignedQueries: 20,
      resolvedQueries: 18,
      pendingQueries: 2,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-02-20",
    },
    {
      id: "emp_004",
      name: "Ava Mitchell",
      assignedQueries: 25,
      resolvedQueries: 22,
      pendingQueries: 3,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-04-05",
    },
    {
      id: "emp_005",
      name: "Liam Foster",
      assignedQueries: 25,
      resolvedQueries: 20,
      pendingQueries: 5,
      status: "Active",
      department: "Public Services",
      joinDate: "2023-01-30",
    },
  ],
  lastUpdated: new Date().toISOString(),
};
*/

// Future: Additional dashboard data types for MLA and Normal User roles
export interface MLADashboardData {
  title: string;
  description: string;
  constituency: {
    name: string;
    totalVoters: number;
    activeVoters: number;
  };
  summaryStats: {
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    averageResolutionTime: string;
    voterSatisfaction: number;
    departmentPerformance: number;
  };
  departments: Array<{
    id: string;
    name: string;
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    performance: number;
    avgResponseTime: string;
  }>;
  recentIssues: Array<{
    id: string;
    title: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    upvotes: number;
  }>;
  lastUpdated: string;
}

export interface UserDashboardData {
  // To be defined when converting User dashboard
}

// Data fetching functions (mock for now, will be replaced with API calls)
export const fetchDepartmentDashboardData =
  async (): Promise<DepartmentDashboardData> => {
    // TODO: Replace with actual API call when backend endpoint is available
    // For now, return empty data structure
    return {
      title: "Department Dashboard",
      description: "Track and manage queries assigned to your department.",
      summaryStats: {
        totalQueries: 0,
        querySolvingRate: 0,
        averageResolutionTime: "0 days",
        activeEmployees: 0,
        pendingQueries: 0,
        resolvedQueries: 0,
      },
      employees: [],
      lastUpdated: new Date().toISOString(),
    };
  };

export const fetchMLADashboardData = async (): Promise<MLADashboardData> => {
  // Mock data for MLA Dashboard
  return {
    title: "MLA Dashboard",
    description: "Monitor constituency issues and department performance.",
    constituency: {
      name: "Thiruvananthapuram",
      totalVoters: 125000,
      activeVoters: 89000,
    },
    summaryStats: {
      totalIssues: 1247,
      resolvedIssues: 892,
      pendingIssues: 355,
      averageResolutionTime: "3.2 days",
      voterSatisfaction: 87,
      departmentPerformance: 92,
    },
    departments: [
      {
        id: "dept_001",
        name: "Water Supply",
        totalIssues: 245,
        resolvedIssues: 198,
        pendingIssues: 47,
        performance: 89,
        avgResponseTime: "2.1 days",
      },
      {
        id: "dept_002",
        name: "Roads & Transport",
        totalIssues: 189,
        resolvedIssues: 156,
        pendingIssues: 33,
        performance: 85,
        avgResponseTime: "3.5 days",
      },
      {
        id: "dept_003",
        name: "Electricity",
        totalIssues: 167,
        resolvedIssues: 142,
        pendingIssues: 25,
        performance: 91,
        avgResponseTime: "1.8 days",
      },
      {
        id: "dept_004",
        name: "Sanitation",
        totalIssues: 134,
        resolvedIssues: 118,
        pendingIssues: 16,
        performance: 94,
        avgResponseTime: "2.3 days",
      },
      {
        id: "dept_005",
        name: "Education",
        totalIssues: 98,
        resolvedIssues: 87,
        pendingIssues: 11,
        performance: 96,
        avgResponseTime: "1.5 days",
      },
    ],
    recentIssues: [
      {
        id: "issue_001",
        title: "Water supply disruption in Ward 14",
        category: "Water Supply",
        status: "In Progress",
        priority: "High",
        createdAt: "2024-01-15T10:30:00Z",
        upvotes: 45,
      },
      {
        id: "issue_002",
        title: "Street light repair needed on Main Road",
        category: "Electricity",
        status: "Resolved",
        priority: "Medium",
        createdAt: "2024-01-14T15:20:00Z",
        upvotes: 32,
      },
      {
        id: "issue_003",
        title: "Garbage collection irregular in Panchayat area",
        category: "Sanitation",
        status: "Pending",
        priority: "High",
        createdAt: "2024-01-13T09:15:00Z",
        upvotes: 67,
      },
      {
        id: "issue_004",
        title: "School building maintenance required",
        category: "Education",
        status: "In Progress",
        priority: "Medium",
        createdAt: "2024-01-12T14:45:00Z",
        upvotes: 28,
      },
      {
        id: "issue_005",
        title: "Road repair needed near market area",
        category: "Roads & Transport",
        status: "Resolved",
        priority: "High",
        createdAt: "2024-01-11T11:30:00Z",
        upvotes: 89,
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
};

export const fetchUserDashboardData = async (): Promise<UserDashboardData> => {
  // To be implemented
  throw new Error("User dashboard data not yet implemented");
};
