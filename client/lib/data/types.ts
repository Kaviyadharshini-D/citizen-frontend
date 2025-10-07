// client/lib/data/types.ts
// Normalized data types following 3NF principles

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Core entities
export interface Constituency extends BaseEntity {
  name: string;
  code: string; // e.g., "TVM001"
  district: string;
  reserved_category: ReservedCategory;
  population: number;
  area_km2?: number;
  description?: string;
}

export interface MLA extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  party_id: string; // Foreign key to Party
  constituency_id: string; // Foreign key to Constituency
  term_start: string;
  term_end: string;
  status: MLAStatus;
  bio?: string;
  profile_image?: string;
}

export interface Party extends BaseEntity {
  name: string;
  abbreviation: string; // e.g., "INC", "BJP"
  color: string; // Hex color for UI
  logo?: string;
  description?: string;
}

export interface Department extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  head_mla_id?: string; // Foreign key to MLA
}

export interface Issue extends BaseEntity {
  title: string;
  description: string;
  locality: string;
  constituency_id: string; // Foreign key to Constituency
  department_id?: string; // Foreign key to Department
  status: IssueStatus;
  priority: Priority;
  created_by: string; // User ID
  assigned_to?: string; // MLA ID
  is_anonymous: boolean;
  attachments?: string[]; // File URLs
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  constituency_id?: string; // Foreign key to Constituency
  is_active: boolean;
  last_login?: string;
}

// Enums
export type ReservedCategory = "GENERAL" | "SC" | "ST" | "OBC";
export type MLAStatus = "ACTIVE" | "INACTIVE" | "ENDED" | "SUSPENDED";
export type IssueStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED" | "CLOSED";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type UserRole = "CITIZEN" | "MLA_STAFF" | "DEPT_STAFF" | "ADMIN";

// Junction tables for many-to-many relationships
export interface MLACommittee extends BaseEntity {
  mla_id: string; // Foreign key to MLA
  committee_id: string; // Foreign key to Committee
  role: string; // e.g., "Chair", "Member"
}

export interface Committee extends BaseEntity {
  name: string;
  description?: string;
  department_id?: string; // Foreign key to Department
}

// Aggregated views for dashboard
export interface DashboardStats {
  total_constituencies: number;
  total_mlas: number;
  active_mlas: number;
  inactive_mlas: number;
  total_issues: number;
  pending_issues: number;
  resolved_issues: number;
  total_users: number;
  active_users: number;
}

export interface ConstituencyStats {
  constituency_id: string;
  total_issues: number;
  resolved_issues: number;
  pending_issues: number;
  avg_resolution_time_days: number;
  satisfaction_rating: number;
}

export interface MLAStats {
  mla_id: string;
  total_issues_handled: number;
  resolved_issues: number;
  pending_issues: number;
  avg_response_time_hours: number;
  satisfaction_rating: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filters?: Record<string, any>;
}

// Form data types
export interface CreateConstituencyData {
  name: string;
  code: string;
  district: string;
  reserved_category: ReservedCategory;
  population: number;
  area_km2?: number;
  description?: string;
}

export interface UpdateConstituencyData extends Partial<CreateConstituencyData> {
  id: string;
}

export interface CreateMLAData {
  name: string;
  email: string;
  phone?: string;
  party_id: string;
  constituency_id: string;
  term_start: string;
  term_end: string;
  bio?: string;
  profile_image?: string;
}

export interface UpdateMLAData extends Partial<CreateMLAData> {
  id: string;
  status?: MLAStatus;
}

export interface CreateIssueData {
  title: string;
  description: string;
  locality: string;
  constituency_id: string;
  department_id?: string;
  priority: Priority;
  is_anonymous: boolean;
  attachments?: File[];
}

export interface UpdateIssueData extends Partial<CreateIssueData> {
  id: string;
  status?: IssueStatus;
  assigned_to?: string;
}



