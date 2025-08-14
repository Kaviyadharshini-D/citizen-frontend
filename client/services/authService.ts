import {
  LoginFormData,
  SignupFormData,
  AuthResponse,
  User,
  UserRole,
} from "../types/auth";
import { apiService } from "./api";
import { RoleTypes } from "../types/api";

// Professional authentication service using real API
class AuthService {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    try {
      const response = await apiService.loginWithEmail({
        email: credentials.email,
        password: credentials.password,
      });

      return {
        success: true,
        user: this.mapApiUserToUser(response.user),
        token: response.token,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      };
    }
  }

  async signup(userData: SignupFormData): Promise<AuthResponse> {
    try {
      // First, we need to get constituency and panchayat IDs from the location data
      // This is a temporary solution until we integrate the location APIs
      const constituencyId = "temp_constituency_id"; // TODO: Get from API
      const panchayatId = "temp_panchayat_id"; // TODO: Get from API

      const response = await apiService.signupWithEmail({
        email: userData.email,
        password: userData.password,
        name: userData.username,
        phone_number: userData.phone,
        constituency_id: constituencyId,
        panchayat_id: panchayatId,
        ward_no: userData.ward,
      });

      return {
        success: true,
        user: this.mapApiUserToUser(response.user),
        token: response.token,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Signup failed",
      };
    }
  }

  async googleAuth(email: string, name: string): Promise<AuthResponse> {
    try {
      // Simulate Google OAuth flow - in real implementation, you'd get the access token from Google
      const mockAccessToken = "mock_google_access_token";

      const response = await apiService.loginWithGoogle({
        accessToken: mockAccessToken,
        email: email,
      });

      return {
        success: true,
        user: this.mapApiUserToUser(response.user),
        token: response.token,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        message: "Please complete your profile",
      };
    }
  }

  private mapApiUserToUser(apiUser: any): User {
    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      phone: apiUser.phone_number,
      role: this.mapApiRoleToUserRole(apiUser.role),
      constituency: "temp_constituency", // TODO: Get from user details API
      panchayat: "temp_panchayat", // TODO: Get from user details API
      ward: "temp_ward", // TODO: Get from user details API
      position: this.getPositionFromRole(apiUser.role),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiUser.name)}&background=0D9488&color=fff&size=150`,
      isVerified: apiUser.is_verified,
      createdAt: apiUser.created_at || new Date().toISOString(),
    };
  }

  private mapApiRoleToUserRole(apiRole: string): UserRole {
    switch (apiRole) {
      case RoleTypes.MLASTAFF:
        return "mlastaff";
      case RoleTypes.DEPT:
        return "dept";
      case RoleTypes.DEPT_STAFF:
        return "dept_staff";
      case RoleTypes.ADMIN:
        return "admin";
      case RoleTypes.CITIZEN:
      default:
        return "citizen";
    }
  }

  private getPositionFromRole(role: string): string | undefined {
    switch (role) {
      case RoleTypes.MLASTAFF:
        return "Member of Legislative Assembly";
      case RoleTypes.DEPT:
        return "Department Officer";
      case RoleTypes.DEPT_STAFF:
        return "Department Staff";
      case RoleTypes.ADMIN:
        return "Administrator";
      default:
        return undefined;
    }
  }

  private determineUserRole(userData: SignupFormData): UserRole {
    // Professional role determination logic
    const email = userData.email.toLowerCase();
    const name = userData.username.toLowerCase();

    // Check for government email domains
    if (email.includes("@kerala.gov.in") || email.includes("@gov.in")) {
      if (
        email.includes("mla") ||
        email.includes("minister") ||
        name.includes("mla")
      ) {
        return "mlastaff";
      }
      if (
        email.includes("dept") ||
        email.includes("commissioner") ||
        name.includes("director")
      ) {
        return "dept";
      }
      return "dept"; // Default for government emails
    }

    // Check for specific keywords in name or email
    if (
      name.includes("mla") ||
      name.includes("minister") ||
      name.includes("assembly")
    ) {
      return "mlastaff";
    }
    if (
      name.includes("director") ||
      name.includes("commissioner") ||
      name.includes("officer")
    ) {
      return "dept";
    }

    // Default to citizen
    return "citizen";
  }

  private generateToken(userId: string): string {
    // Mock token generation - use proper JWT in production
    return `auth_token_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logout(): void {
    // Clear token from storage
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
  }

  getCurrentUser(): User | null {
    const userData = localStorage.getItem("user_data");
    return userData ? JSON.parse(userData) : null;
  }

  saveUserSession(user: User, token: string): void {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user_data", JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("auth_token");
    return !!token;
  }
}

export const authService = new AuthService();
