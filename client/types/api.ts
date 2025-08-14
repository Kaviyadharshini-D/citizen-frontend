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
  id: string;
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
  ward_no: string;
}

export interface GoogleSignupRequest {
  accessToken: string;
  email: string;
  name: string;
  phone_number: string;
  constituency_id: string;
  panchayat_id: string;
  ward_no: string;
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
