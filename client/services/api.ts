import {
  LoginRequest,
  GoogleLoginRequest,
  SignupRequest,
  GoogleSignupRequest,
  ChangePasswordRequest,
  UpdateUserDetailsRequest,
  IssueFilter,
  PaginationParams,
  AuthResponse,
  UserProfileResponse,
  UserDetailsResponse,
  IssuesResponse,
  IssueResponse,
  ConstituenciesResponse,
  PanchayatsResponse,
  IssueStatisticsResponse,
  ApiResponse,
  Issue,
  Constituency,
  Panchayat,
  IssueStatistics,
} from "../types/api";

const API_BASE_URL = "http://localhost:3333/api";

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || errorData.message || `HTTP ${response.status}`,
      );
    }
    return response.json();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: this.getAuthHeaders(),
      ...options,
    };
    console.log(url);
    const response = await fetch(url, config);
    return this.handleResponse<T>(response);
  }

  // Authentication APIs
  async loginWithEmail(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async loginWithGoogle(data: GoogleLoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login/google", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signupWithEmail(data: SignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup/email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async signupWithGoogle(data: GoogleSignupRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup/google", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCurrentUser(): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/auth/me");
  }

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUserDetails(
    data: UpdateUserDetailsRequest,
  ): Promise<UserDetailsResponse> {
    return this.request<UserDetailsResponse>("/auth/user-details", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Issues APIs
  async createIssue(data: FormData): Promise<IssueResponse> {
    const token = localStorage.getItem("auth_token");
    const response = await fetch(`${API_BASE_URL}/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });
    return this.handleResponse<IssueResponse>(response);
  }

  async getIssues(filters?: IssueFilter): Promise<IssuesResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/issues?${queryString}` : "/issues";
    return this.request<IssuesResponse>(endpoint);
  }

  async getIssueById(id: string): Promise<IssueResponse> {
    return this.request<IssueResponse>(`/issues/${id}`);
  }

  async getIssuesByUserId(userId: string): Promise<IssuesResponse> {
    return this.request<IssuesResponse>(`/issues/user/${userId}`);
  }

  async getIssuesByConstituency(
    constituencyId: string,
  ): Promise<IssuesResponse> {
    try {
      const response = await this.request<any>(
        `/issues/constituency/${constituencyId}`,
      );
      return response;
    } catch (error) {
      console.error("Error fetching issues by constituency:", error);
      // Return empty response if API fails
      return {
        issues: [],
        total: 0,
        page: 1,
        limit: 0,
        totalPages: 0,
      };
    }
  }

  async updateIssue(id: string, data: Partial<Issue>): Promise<IssueResponse> {
    return this.request<IssueResponse>(`/issues/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async updateIssueStatus(id: string, status: string): Promise<IssueResponse> {
    return this.request<IssueResponse>(`/issues/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async assignIssue(id: string, handledBy: string): Promise<IssueResponse> {
    return this.request<IssueResponse>(`/issues/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ handled_by: handledBy }),
    });
  }

  async addFeedback(id: string, feedback: string): Promise<IssueResponse> {
    return this.request<IssueResponse>(`/issues/${id}/feedback`, {
      method: "POST",
      body: JSON.stringify({ feedback }),
    });
  }

  async deleteIssue(id: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/issues/${id}`, {
      method: "DELETE",
    });
  }

  async getIssueStatistics(): Promise<IssueStatisticsResponse> {
    return this.request<IssueStatisticsResponse>("/issues/statistics");
  }

  // Location APIs
  async getConstituencies(): Promise<{ constituencies: Constituency[] }> {
    try {
      const response =
        await this.request<ConstituenciesResponse>("/constituencies");

      // Check if response has the expected structure
      if (!response.data || !Array.isArray(response.data)) {
        console.warn("Unexpected API response structure:", response);
        throw new Error("Invalid API response structure");
      }

      // Transform the nested response structure to a simpler format
      const constituencies = response.data
        .map((item) => {
          if (!item) {
            console.warn("Invalid constituency item:", item);
            return null;
          }
          return {
            id: item._id,
            name: item.name,
            constituency_id: item.constituency_id,
            created_at: item.createdAt,
            updated_at: item.updatedAt,
          };
        })
        .filter(Boolean) as Constituency[];

      return { constituencies };
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn("API not available, using mock constituencies:", error);
      return Promise.resolve({
        constituencies: [
          { id: "1", name: "Thiruvananthapuram", constituency_id: "TVM001" },
          { id: "2", name: "Kollam", constituency_id: "KOL001" },
          { id: "3", name: "Pathanamthitta", constituency_id: "PAT001" },
          { id: "4", name: "Alappuzha", constituency_id: "ALA001" },
          { id: "5", name: "Kottayam", constituency_id: "KOT001" },
          { id: "6", name: "Idukki", constituency_id: "IDU001" },
          { id: "7", name: "Ernakulam", constituency_id: "ERN001" },
          { id: "8", name: "Thrissur", constituency_id: "THR001" },
          { id: "9", name: "Palakkad", constituency_id: "PAL001" },
          { id: "10", name: "Malappuram", constituency_id: "MAL001" },
        ] as Constituency[],
      });
    }
  }

  async getConstituencyById(
    id: string,
  ): Promise<{ constituency: Constituency }> {
    return this.request<{ constituency: Constituency }>(
      `/constituencies/${id}`,
    );
  }

  async getConstituencyInfo(id: string): Promise<{
    name: string;
    total_voters: number;
    active_voters: number;
    total_panchayats: number;
    total_wards: number;
  }> {
    try {
      console.log("Fetching constituency info for ID:", id);

      // First, get the constituency details
      const constituencyResponse = await this.request<{
        success: boolean;
        message: string;
        data: {
          _id: string;
          name: string;
          constituency_id: string;
          panchayats: Array<{
            _id: string;
            name: string;
            ward_list: Array<{
              _id: string;
              ward_id: string;
              ward_name: string;
            }>;
          }>;
        };
      }>(`/constituencies/${id}`);

      console.log("Constituency response:", constituencyResponse);

      if (!constituencyResponse.success || !constituencyResponse.data) {
        throw new Error("Failed to fetch constituency data");
      }

      const constituency = constituencyResponse.data;

      // Calculate total panchayats and wards from the constituency data
      const total_panchayats = constituency.panchayats?.length || 0;
      const total_wards =
        constituency.panchayats?.reduce((total, panchayat) => {
          return total + (panchayat.ward_list?.length || 0);
        }, 0) || 0;

      console.log(
        "Calculated panchayats:",
        total_panchayats,
        "wards:",
        total_wards,
      );

      // Try to get user counts - if these endpoints don't exist, we'll use fallback values
      let total_voters = 0;
      let active_voters = 0;

      try {
        // Get total voters (all users in this constituency)
        const totalVotersResponse = await this.request<{
          success: boolean;
          message: string;
          data: {
            total: number;
          };
        }>(`/users/count?constituency_id=${id}`);

        if (totalVotersResponse.success) {
          total_voters = totalVotersResponse.data.total;
        }
      } catch (userCountError) {
        console.warn(
          "User count endpoint not available, using fallback:",
          userCountError,
        );
        // Use fallback values based on constituency size
        total_voters = total_panchayats * 8000; // Rough estimate
      }

      try {
        // Get active voters (verified users in this constituency)
        const activeVotersResponse = await this.request<{
          success: boolean;
          message: string;
          data: {
            total: number;
          };
        }>(`/users/count?constituency_id=${id}&verified=true`);

        if (activeVotersResponse.success) {
          active_voters = activeVotersResponse.data.total;
        }
      } catch (activeCountError) {
        console.warn(
          "Active user count endpoint not available, using fallback:",
          activeCountError,
        );
        // Use fallback values - assume 70% of total voters are active
        active_voters = Math.round(total_voters * 0.7);
      }

      const result = {
        name: constituency.name,
        total_voters,
        active_voters,
        total_panchayats,
        total_wards,
      };

      console.log("Final constituency info:", result);
      return result;
    } catch (error) {
      console.error("Error fetching constituency info:", error);

      // Fallback to mock data if API is not available
      return Promise.resolve({
        name: "Thiruvananthapuram",
        total_voters: 125000,
        active_voters: 89000,
        total_panchayats: 15,
        total_wards: 120,
      });
    }
  }

  async getPanchayats(): Promise<PanchayatsResponse> {
    return this.request<PanchayatsResponse>("/panchayats");
  }

  async getPanchayatById(id: string): Promise<{ panchayat: Panchayat }> {
    return this.request<{ panchayat: Panchayat }>(`/panchayats/${id}`);
  }

  async getPanchayatsByConstituency(
    constituencyId: string,
  ): Promise<PanchayatsResponse> {
    return this.request<PanchayatsResponse>(
      `/panchayats/constituency/${constituencyId}`,
    );
  }

  // Helper method to get panchayats by constituency name
  async getPanchayatsByConstituencyName(
    constituencyName: string,
  ): Promise<PanchayatsResponse> {
    try {
      // First get all constituencies to find the ID
      const constituenciesResponse = await this.getConstituencies();
      const constituency = constituenciesResponse.constituencies.find(
        (c) => c.name === constituencyName,
      );

      if (!constituency) {
        throw new Error(`Constituency "${constituencyName}" not found`);
      }

      return this.getPanchayatsByConstituency(constituency.id);
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn("API not available, using mock data:", error);
      return this.getMockPanchayatsByConstituency(constituencyName);
    }
  }

  // Mock data fallback
  private getMockPanchayatsByConstituency(
    constituencyName: string,
  ): Promise<PanchayatsResponse> {
    const mockPanchayats = {
      Thiruvananthapuram: [
        {
          id: "1",
          name: "Kovalam Panchayat",
          panchayat_id: "KOV001",
          constituency_id: "TVM001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
          ],
        },
        {
          id: "2",
          name: "Vizhinjam Panchayat",
          panchayat_id: "VIZ001",
          constituency_id: "TVM001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
          ],
        },
        {
          id: "3",
          name: "Thiruvananthapuram Municipality",
          panchayat_id: "TVM002",
          constituency_id: "TVM001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
            { id: "6", name: "Ward 6" },
          ],
        },
      ],
      Kollam: [
        {
          id: "4",
          name: "Kollam Municipality",
          panchayat_id: "KOL001",
          constituency_id: "KOL001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
          ],
        },
        {
          id: "5",
          name: "Karunagappally Panchayat",
          panchayat_id: "KAR001",
          constituency_id: "KOL001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
          ],
        },
        {
          id: "6",
          name: "Kottarakkara Municipality",
          panchayat_id: "KOT001",
          constituency_id: "KOL001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
          ],
        },
      ],
      Pathanamthitta: [
        {
          id: "7",
          name: "Pathanamthitta Municipality",
          panchayat_id: "PAT001",
          constituency_id: "PAT001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
          ],
        },
        {
          id: "8",
          name: "Adoor Municipality",
          panchayat_id: "ADO001",
          constituency_id: "PAT001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
          ],
        },
        {
          id: "9",
          name: "Thiruvalla Municipality",
          panchayat_id: "TIR001",
          constituency_id: "PAT001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
          ],
        },
      ],
      Alappuzha: [
        {
          id: "10",
          name: "Alappuzha Municipality",
          panchayat_id: "ALA001",
          constituency_id: "ALA001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
          ],
        },
        {
          id: "11",
          name: "Cherthala Municipality",
          panchayat_id: "CHE001",
          constituency_id: "ALA001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
          ],
        },
      ],
      Kottayam: [
        {
          id: "12",
          name: "Kottayam Municipality",
          panchayat_id: "KOT002",
          constituency_id: "KOT001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
          ],
        },
        {
          id: "13",
          name: "Pala Municipality",
          panchayat_id: "PAL001",
          constituency_id: "KOT001",
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
          ],
        },
      ],
    };

    const panchayats =
      mockPanchayats[constituencyName as keyof typeof mockPanchayats] || [];

    // If no specific mock data for this constituency, provide a generic fallback
    if (panchayats.length === 0) {
      const fallbackPanchayats = [
        {
          id: "fallback1",
          name: `${constituencyName} Municipality`,
          panchayat_id: `${constituencyName.toUpperCase().substring(0, 3)}001`,
          constituency_id: `${constituencyName.toUpperCase().substring(0, 3)}001`,
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
            { id: "4", name: "Ward 4" },
            { id: "5", name: "Ward 5" },
          ],
        },
        {
          id: "fallback2",
          name: `${constituencyName} Panchayat`,
          panchayat_id: `${constituencyName.toUpperCase().substring(0, 3)}002`,
          constituency_id: `${constituencyName.toUpperCase().substring(0, 3)}001`,
          wards: [
            { id: "1", name: "Ward 1" },
            { id: "2", name: "Ward 2" },
            { id: "3", name: "Ward 3" },
          ],
        },
      ];

      return Promise.resolve({
        success: true,
        message: "Mock data loaded",
        data: fallbackPanchayats as unknown as Panchayat[],
      });
    }

    return Promise.resolve({
      success: true,
      message: "Mock data loaded",
      data: panchayats as unknown as Panchayat[],
    });
  }

  // Upvotes API
  async upvoteIssue(issueId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/upvotes/${issueId}`, {
      method: "POST",
    });
  }

  async removeUpvote(issueId: string): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/upvotes/${issueId}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; message: string }> {
    return this.request<{ status: string; message: string }>("/health");
  }
}

export const apiService = new ApiService();
