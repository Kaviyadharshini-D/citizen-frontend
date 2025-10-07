// client/data/adminDashboardData.ts
// Dashboard data with normalized structure

import { DashboardStats, ConstituencyStats, MLAStats } from '../lib/data/types';

// Mock dashboard statistics
export const mockDashboardStats: DashboardStats = {
  total_constituencies: 5,
  total_mlas: 3,
  active_mlas: 2,
  inactive_mlas: 1,
  total_issues: 150,
  pending_issues: 45,
  resolved_issues: 105,
  total_users: 2500,
  active_users: 1800
};

// Mock constituency statistics
export const mockConstituencyStats: ConstituencyStats[] = [
  {
    constituency_id: "c1",
    total_issues: 35,
    resolved_issues: 28,
    pending_issues: 7,
    avg_resolution_time_days: 5.2,
    satisfaction_rating: 4.3
  },
  {
    constituency_id: "c2",
    total_issues: 28,
    resolved_issues: 20,
    pending_issues: 8,
    avg_resolution_time_days: 6.8,
    satisfaction_rating: 3.9
  },
  {
    constituency_id: "c3",
    total_issues: 42,
    resolved_issues: 35,
    pending_issues: 7,
    avg_resolution_time_days: 4.1,
    satisfaction_rating: 4.5
  },
  {
    constituency_id: "c4",
    total_issues: 25,
    resolved_issues: 15,
    pending_issues: 10,
    avg_resolution_time_days: 7.2,
    satisfaction_rating: 3.7
  },
  {
    constituency_id: "c5",
    total_issues: 20,
    resolved_issues: 7,
    pending_issues: 13,
    avg_resolution_time_days: 8.5,
    satisfaction_rating: 3.2
  }
];

// Mock MLA statistics
export const mockMLAStats: MLAStats[] = [
  {
    mla_id: "m1",
    total_issues_handled: 35,
    resolved_issues: 28,
    pending_issues: 7,
    avg_response_time_hours: 12.5,
    satisfaction_rating: 4.3
  },
  {
    mla_id: "m2",
    total_issues_handled: 42,
    resolved_issues: 35,
    pending_issues: 7,
    avg_response_time_hours: 8.2,
    satisfaction_rating: 4.5
  },
  {
    mla_id: "m3",
    total_issues_handled: 28,
    resolved_issues: 20,
    pending_issues: 8,
    avg_response_time_hours: 18.7,
    satisfaction_rating: 3.9
  }
];

export async function fetchAdminOverviewData(): Promise<{
  dashboardStats: DashboardStats;
  constituencyStats: ConstituencyStats[];
  mlaStats: MLAStats[];
}> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return Promise.resolve({
    dashboardStats: mockDashboardStats,
    constituencyStats: mockConstituencyStats,
    mlaStats: mockMLAStats
  });
}

// Legacy interface for backward compatibility
export interface AdminOverviewData {
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

// Convert normalized data to legacy format
export function convertToLegacyFormat(stats: DashboardStats): AdminOverviewData {
  return {
    total_constituencies: stats.total_constituencies,
    total_mlas: stats.total_mlas,
    active_mlas: stats.active_mlas,
    inactive_mlas: stats.inactive_mlas,
    total_issues: stats.total_issues,
    pending_issues: stats.pending_issues,
    resolved_issues: stats.resolved_issues,
    total_users: stats.total_users,
    active_users: stats.active_users
  };
}