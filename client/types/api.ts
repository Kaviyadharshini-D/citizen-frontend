// API Types based on backend models and routes

export enum RoleTypes {
  CITIZEN = "citizen",
  MLASTAFF = "mlastaff",
  DEPT = "dept",
  DEPT_STAFF = "dept_staff",
  ADMIN = "admin",
}

export enum IssueStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  REJECTED = "rejected",
}

export enum PriorityLevel {
  HIGH = "high",
  NORMAL = "normal",
  LOW = "low",
}

export enum Satisfaction {
  GOOD = "good",
  AVERAGE = "average",
  POOR = "poor",
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  role: RoleTypes;
  is_verified: boolean;
  hasPassword: boolean;
  created_at?: string;
  updated_at?: string;
  constituency_id: string;
  constituency_name: string;
  panchayat_id: string;
  panchayat_name: string;
  ward_no: string;
  ward_name: string;
  department_id: string;
  department_name: string;
}

// Department Types
export interface Department {
  _id: string;
  name: string;
  code: string;
  description?: string;
  head_mla_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentsResponse {
  success: boolean;
  message: string;
  data: Department[];
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  role: string;
  specialization: string;
  issues_resolved: number;
  avg_response_time: number;
  satisfaction: number;
  efficiency: number;
  department_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface DepartmentEmployeesResponse {
  employees: Employee[];
  total: number;
}

export interface UserDetails {
  user_id: string;
  constituency: {
    name: string;
    constituency_id: string;
  };
  panchayat_id: {
    name: string;
    panchayat_id: string;
  };
  ward_no: string;
}

// Location Types
export interface Constituency {
  id: string;
  name: string;
  constituency_id: string;
  district?: string;
  population?: number;
  reserved_category?: "SC" | "ST" | "OBC" | "None";
  mla_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Panchayat {
  id: string;
  name: string;
  panchayat_id: string;
  constituency_id: string;
  ward_list: Ward[];
  created_at?: string;
  updated_at?: string;
}

// Issue Types
export interface Issue {
  _id: string;
  title: string;
  detail: string;
  locality: string;
  user_id: string;
  constituency_id: string;
  panchayat_id: string;
  ward_no: string;
  department_id?: string;
  handled_by?: string;
  status: IssueStatus;
  upvotes: number;
  priority_level: PriorityLevel;
  is_anonymous: boolean;
  attachments?: string;
  feedback?: string;
  satisfaction_score?: Satisfaction;
  created_at: string;
  completed_at?: string;
  updated_at?: string;
}

export interface IssueStatistics {
  total_issues: number;
  pending_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  rejected_issues: number;
  average_resolution_time?: number;
}

// Authentication Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  accessToken: string;
  email: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
  phone_number: string;
  constituency_id: string;
  panchayat_id: string;
  ward_id: string;
  department_id: string;
  department_name: string;
}

export interface GoogleSignupRequest {
  accessToken: string;
  email: string;
  name: string;
  phone_number: string;
  constituency_id: string;
  panchayat_id: string;
  ward_id: string;
  department_id: string;
  department_name: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateUserDetailsRequest {
  constituency_id: string;
  panchayat_id: string;
  ward_no: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginResponse extends AuthResponse {}

export interface SignupResponse extends AuthResponse {}

export interface UserProfileResponse {
  user: User;
}

export interface UserDetailsResponse {
  message: string;
  data: UserDetails;
}

export interface IssuesResponse {
  issues: any;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IssueResponse {
  issue: Issue;
}

export interface ConstituenciesResponse {
  success: boolean;
  message: string;
  data: Array<{
    _id: string;
    name: string;
    panchayats: Array<{
      _id: string;
      name: string;
      ward_list: Array<{
        ward_id: string;
        ward_name: string;
        _id: string;
      }>;
      panchayat_id: string;
    }>;
    constituency_id: string;
    mla_id: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
  }>;
}

export interface PanchayatsResponse {
  success: boolean;
  message: string;
  data: Panchayat[];
}

export interface Panchayat {
  _id: string;
  name: string;
  panchayat_id: string;
  constituency: {
    id: string;
    name: string;
    constituency_id: string;
  };
  ward_list: Ward[];
  createdAt: string;
  updatedAt: string;
}

export interface Ward {
  _id: string;
  ward_id: string;
  ward_name: string;
}

export interface IssueStatisticsResponse {
  statistics: IssueStatistics;
}

// Filter Types
export interface IssueFilter {
  status?: IssueStatus;
  priority_level?: PriorityLevel;
  constituency_id?: string;
  panchayat_id?: string;
  ward_no?: string;
  user_id?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

// Error Types
export interface ApiError {
  success: false;
  message: string;
  error?: string;
  status?: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Admin Management Types
export interface MLAProfile {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  party?: string;
  photo_url?: string;
  bio?: string;
  term_start?: string; // ISO date
  term_end?: string; // ISO date
  status: "active" | "inactive" | "ended";
  constituency_id?: string; // one-to-one link
  created_at?: string;
  updated_at?: string;
}

export interface AuditLogEntry {
  id: string;
  type: "mla" | "constituency" | "user" | "assignment";
  action: string; // e.g., assigned, updated, deleted
  entity_id: string;
  entity_name?: string;
  actor: {
    id: string;
    name: string;
    role: RoleTypes;
  };
  created_at: string;
  meta?: Record<string, any>;
}

// MLA Dashboard Types
export interface MLADashboardData {
  _id: string;
  constituency_id: string;
  name: string;
  total_voters: number;
  active_voters: number;
  total_panchayats: number;
  total_wards: number;
  area: string;
  population: string;
  literacy_rate: string;
  total_issues: number;
  resolved_issues: number;
  pending_issues: number;
  avg_response_time: number;
  user_satisfaction: number;
  efficiency: number;
  maintenance_completed: number;
  new_connections: number;
  revenue: number;
  cost_savings: number;
  budget: number;
  spent: number;
  created_at: string;
  updated_at: string;
}

export interface MLADashboardStats {
  total_issues: number;
  resolved_issues: number;
  pending_issues: number;
  critical_issues: number;
  avg_resolution_time: number;
  user_satisfaction: number;
  efficiency: number;
  monthly_trends: Array<{
    month: string;
    total: number;
    resolved: number;
    pending: number;
    critical: number;
    avg_resolution: number;
    satisfaction: number;
  }>;
  category_breakdown: Array<{
    name: string;
    value: number;
    color: string;
    priority: string;
    avg_resolution: number;
  }>;
  priority_distribution: Array<{
    priority: string;
    count: number;
    color: string;
  }>;
  department_performance: Array<{
    name: string;
    issues: number;
    resolved: number;
    pending: number;
    avg_response: number;
    satisfaction: number;
    budget: number;
    spent: number;
  }>;
  recent_issues: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    submitted: string;
    location: string;
  }>;
}

export interface MLADashboardResponse {
  success: boolean;
  message: string;
  data: MLADashboardData;
}

export interface MLADashboardStatsResponse {
  success: boolean;
  message: string;
  data: MLADashboardStats;
}

// Meeting Types
export interface Meeting {
  _id: string;
  meetingName: string;
  departments: string[];
  date: string;
  time: string;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
  constituency_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingRequest {
  meetingName: string;
  departments: string[];
  date: string;
  time: string;
  description?: string;
}

export interface UpdateMeetingRequest {
  meetingName?: string;
  departments?: string[];
  date?: string;
  time?: string;
  description?: string;
  status?: "scheduled" | "completed" | "cancelled";
}

export interface MeetingsResponse {
  success: boolean;
  message: string;
  data: Meeting[];
}

export interface MeetingResponse {
  success: boolean;
  message: string;
  data: Meeting;
}
