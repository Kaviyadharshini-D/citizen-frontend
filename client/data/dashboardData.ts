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

// Simple function to get basic mock data for fallback
export const getMockMLADashboardData = () => {
  console.warn("Using mock MLA dashboard data - API may be unavailable");
  return {
    constituency: {
      name: "Thiruvananthapuram",
      total_voters: 125000,
      active_voters: 89000,
      total_panchayats: 15,
      total_wards: 120,
      area: "214.86 sq km",
      population: "957,730",
      literacy_rate: "94.2%",
    },
    stats: {
      total_issues: 156,
      resolved_issues: 142,
      pending_issues: 14,
      critical_issues: 3,
      avg_resolution_time: 1.8,
      user_satisfaction: 4.6,
      efficiency: 89,
      monthly_trends: [
        {
          month: "Jan",
          total: 42,
          resolved: 38,
          pending: 4,
          critical: 2,
          avg_resolution: 1.6,
          satisfaction: 4.4,
        },
        {
          month: "Feb",
          total: 38,
          resolved: 35,
          pending: 3,
          critical: 1,
          avg_resolution: 1.4,
          satisfaction: 4.5,
        },
        {
          month: "Mar",
          total: 45,
          resolved: 41,
          pending: 4,
          critical: 3,
          avg_resolution: 1.8,
          satisfaction: 4.3,
        },
        {
          month: "Apr",
          total: 52,
          resolved: 47,
          pending: 5,
          critical: 2,
          avg_resolution: 1.7,
          satisfaction: 4.6,
        },
        {
          month: "May",
          total: 48,
          resolved: 44,
          pending: 4,
          critical: 1,
          avg_resolution: 1.5,
          satisfaction: 4.7,
        },
        {
          month: "Jun",
          total: 41,
          resolved: 38,
          pending: 3,
          critical: 2,
          avg_resolution: 1.6,
          satisfaction: 4.5,
        },
      ],
      category_breakdown: [
        {
          name: "Roads & Transport",
          value: 35,
          color: "#ff6b6b",
          priority: "High",
          avg_resolution: 1.2,
        },
        {
          name: "Water Supply",
          value: 28,
          color: "#4ecdc4",
          priority: "Medium",
          avg_resolution: 1.8,
        },
        {
          name: "Electricity",
          value: 22,
          color: "#45b7d1",
          priority: "High",
          avg_resolution: 2.1,
        },
        {
          name: "Sanitation",
          value: 12,
          color: "#96ceb4",
          priority: "Low",
          avg_resolution: 1.5,
        },
        {
          name: "Healthcare",
          value: 8,
          color: "#feca57",
          priority: "Medium",
          avg_resolution: 2.5,
        },
      ],
      priority_distribution: [
        { priority: "High", count: 45, color: "#ff6b6b" },
        { priority: "Medium", count: 78, color: "#4ecdc4" },
        { priority: "Low", count: 33, color: "#96ceb4" },
      ],
      department_performance: [
        {
          name: "Roads & Transport",
          issues: 156,
          resolved: 142,
          pending: 14,
          avg_response: 2.1,
          satisfaction: 4.6,
          budget: 2500000,
          spent: 2100000,
        },
        {
          name: "Water Supply",
          issues: 89,
          resolved: 82,
          pending: 7,
          avg_response: 1.8,
          satisfaction: 4.7,
          budget: 1800000,
          spent: 1650000,
        },
        {
          name: "Electricity",
          issues: 67,
          resolved: 61,
          pending: 6,
          avg_response: 1.5,
          satisfaction: 4.8,
          budget: 1200000,
          spent: 1100000,
        },
        {
          name: "Sanitation",
          issues: 45,
          resolved: 42,
          pending: 3,
          avg_response: 1.9,
          satisfaction: 4.5,
          budget: 800000,
          spent: 750000,
        },
      ],
      recent_issues: [
        {
          id: "IS001",
          title: "Pothole on main road",
          category: "Roads & Transport",
          priority: "High",
          status: "In Progress",
          submitted: "2 hours ago",
          location: "Main Street, City Center",
        },
        {
          id: "IS002",
          title: "Water supply disruption",
          category: "Water Supply",
          priority: "Medium",
          status: "Pending",
          submitted: "4 hours ago",
          location: "Residential Area A",
        },
        {
          id: "IS003",
          title: "Street light malfunction",
          category: "Electricity",
          priority: "Low",
          status: "Resolved",
          submitted: "1 day ago",
          location: "Park Street",
        },
        {
          id: "IS004",
          title: "Garbage collection delay",
          category: "Sanitation",
          priority: "Medium",
          status: "In Progress",
          submitted: "1 day ago",
          location: "Market Area",
        },
        {
          id: "IS005",
          title: "Traffic signal issue",
          category: "Roads & Transport",
          priority: "High",
          status: "Pending",
          submitted: "2 days ago",
          location: "Central Junction",
        },
      ],
    },
    isMockData: true, // Flag to indicate this is mock data
  };
};
