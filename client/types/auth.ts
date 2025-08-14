export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  constituency: string;
  constituency_id: string;
  panchayat: string;
  ward: string;
  position?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
}

export type UserRole = "citizen" | "mlastaff" | "dept" | "dept_staff" | "admin";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  phone: string;
  constituency: string;
  panchayat: string;
  ward: string;
}

export interface GoogleAuthData {
  email: string;
  name: string;
  picture?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}
