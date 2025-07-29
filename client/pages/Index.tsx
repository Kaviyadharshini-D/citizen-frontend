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

export default function Index() {
  const { user } = useUser();

  return (
    <Layout>
      <div className="bg-dashboard-bg min-h-screen">
        {user.role === 'Department' ? (
          <DepartmentDashboard />
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
