// client/lib/data/api.ts
// API service layer for backend integration

import { 
  Constituency, 
  MLA, 
  Party, 
  Department, 
  Issue, 
  User,
  DashboardStats,
  ConstituencyStats,
  MLAStats,
  ApiResponse,
  PaginatedResponse,
  QueryParams,
  CreateConstituencyData,
  UpdateConstituencyData,
  CreateMLAData,
  UpdateMLAData
} from './types';

// API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const API_VERSION = 'v1';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/${API_VERSION}`;
  }

  // Generic HTTP methods
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  private async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.request<T>(url, { method: 'GET' });
  }

  private async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  private async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Constituency API methods
  async getConstituencies(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Constituency>>> {
    return this.get<PaginatedResponse<Constituency>>('/constituencies', params);
  }

  async getConstituencyById(id: string): Promise<ApiResponse<Constituency>> {
    return this.get<Constituency>(`/constituencies/${id}`);
  }

  async createConstituency(data: CreateConstituencyData): Promise<ApiResponse<Constituency>> {
    return this.post<Constituency>('/constituencies', data);
  }

  async updateConstituency(id: string, data: UpdateConstituencyData): Promise<ApiResponse<Constituency>> {
    return this.put<Constituency>(`/constituencies/${id}`, data);
  }

  async deleteConstituency(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/constituencies/${id}`);
  }

  async getConstituencyStats(id: string): Promise<ApiResponse<ConstituencyStats>> {
    return this.get<ConstituencyStats>(`/constituencies/${id}/stats`);
  }

  // MLA API methods
  async getMLAs(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<MLA>>> {
    return this.get<PaginatedResponse<MLA>>('/mlas', params);
  }

  async getMLAById(id: string): Promise<ApiResponse<MLA>> {
    return this.get<MLA>(`/mlas/${id}`);
  }

  async createMLA(data: CreateMLAData): Promise<ApiResponse<MLA>> {
    return this.post<MLA>('/mlas', data);
  }

  async updateMLA(id: string, data: UpdateMLAData): Promise<ApiResponse<MLA>> {
    return this.put<MLA>(`/mlas/${id}`, data);
  }

  async deleteMLA(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/mlas/${id}`);
  }

  async getMLAsByConstituency(constituencyId: string): Promise<ApiResponse<MLA[]>> {
    return this.get<MLA[]>(`/constituencies/${constituencyId}/mlas`);
  }

  async getMLAStats(id: string): Promise<ApiResponse<MLAStats>> {
    return this.get<MLAStats>(`/mlas/${id}/stats`);
  }

  // Party API methods
  async getParties(): Promise<ApiResponse<Party[]>> {
    return this.get<Party[]>('/parties');
  }

  async getPartyById(id: string): Promise<ApiResponse<Party>> {
    return this.get<Party>(`/parties/${id}`);
  }

  async createParty(data: Partial<Party>): Promise<ApiResponse<Party>> {
    return this.post<Party>('/parties', data);
  }

  async updateParty(id: string, data: Partial<Party>): Promise<ApiResponse<Party>> {
    return this.put<Party>(`/parties/${id}`, data);
  }

  async deleteParty(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/parties/${id}`);
  }

  // Dashboard API methods
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return this.get<DashboardStats>('/dashboard/stats');
  }

  async getAllConstituencyStats(): Promise<ApiResponse<ConstituencyStats[]>> {
    return this.get<ConstituencyStats[]>('/constituencies/stats');
  }

  async getAllMLAStats(): Promise<ApiResponse<MLAStats[]>> {
    return this.get<MLAStats[]>('/mlas/stats');
  }

  // Department API methods
  async getDepartments(): Promise<ApiResponse<Department[]>> {
    return this.get<Department[]>('/departments');
  }

  async getDepartmentById(id: string): Promise<ApiResponse<Department>> {
    return this.get<Department>(`/departments/${id}`);
  }

  // Issue API methods
  async getIssues(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Issue>>> {
    return this.get<PaginatedResponse<Issue>>('/issues', params);
  }

  async getIssueById(id: string): Promise<ApiResponse<Issue>> {
    return this.get<Issue>(`/issues/${id}`);
  }

  async createIssue(data: FormData): Promise<ApiResponse<Issue>> {
    return this.request<Issue>('/issues', {
      method: 'POST',
      body: data,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async updateIssue(id: string, data: Partial<Issue>): Promise<ApiResponse<Issue>> {
    return this.put<Issue>(`/issues/${id}`, data);
  }

  async deleteIssue(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/issues/${id}`);
  }

  // User API methods
  async getUsers(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    return this.get<PaginatedResponse<User>>('/users', params);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${id}`);
  }

  // Bulk operations
  async bulkDeleteConstituencies(ids: string[]): Promise<ApiResponse<void>> {
    return this.post<void>('/constituencies/bulk-delete', { ids });
  }

  async bulkDeleteMLAs(ids: string[]): Promise<ApiResponse<void>> {
    return this.post<void>('/mlas/bulk-delete', { ids });
  }

  async bulkAssignMLA(constituencyIds: string[], mlaId: string): Promise<ApiResponse<void>> {
    return this.post<void>('/mlas/bulk-assign', { constituency_ids: constituencyIds, mla_id: mlaId });
  }

  // Export/Import
  async exportConstituencies(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/constituencies/export?format=${format}`);
    return response.blob();
  }

  async exportMLAs(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/mlas/export?format=${format}`);
    return response.blob();
  }

  async importConstituencies(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<{ imported: number; errors: string[] }>('/constituencies/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async importMLAs(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request<{ imported: number; errors: string[] }>('/mlas/import', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();



