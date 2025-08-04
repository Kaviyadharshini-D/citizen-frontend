import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { DashboardHeader } from "../components/DashboardHeader";
import { RealtimeSummary } from "../components/RealtimeSummary";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { PanchayatBreakdown } from "../components/PanchayatBreakdown";
import { RealtimeLeaderboard } from "../components/RealtimeLeaderboard";
import { AIAlerts } from "../components/AIAlerts";
import { DepartmentDashboard } from "../components/DepartmentDashboard";
import { UserDashboard } from "../components/UserDashboard";
import { useUser } from "../context/UserContext";
import { fetchDepartmentDashboardData, DepartmentDashboardData } from "../data/dashboardData";

export default function Index() {
  const { user } = useUser();
  const [departmentData, setDepartmentData] = useState<DepartmentDashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch department dashboard data when user role is Department
  useEffect(() => {
    if (user.role === 'Department') {
      setLoading(true);
      fetchDepartmentDashboardData()
        .then(setDepartmentData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user.role]);

  return (
    <Layout>
      <div className="bg-dashboard-bg min-h-screen">
        {user.role === 'Department' ? (
          <DepartmentDashboard 
            data={departmentData!} 
            loading={loading || !departmentData} 
          />
        ) : user.role === 'Normal User' ? (
          <UserDashboard />
        ) : (
          <div className="max-w-[960px] mx-auto px-4 lg:px-0">
            {/* Header */}
            <DashboardHeader />

            {/* Real-time Summary */}
            <RealtimeSummary />

            {/* Department Analytics */}
            <DepartmentAnalytics />

            {/* Panchayat-level Breakdown */}
            <PanchayatBreakdown />

            {/* Real-time Leaderboard */}
            <RealtimeLeaderboard />

            {/* AI Alerts */}
            <AIAlerts />
          </div>
        )}
      </div>
    </Layout>
  );
}
