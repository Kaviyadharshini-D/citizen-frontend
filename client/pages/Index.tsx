import { Sidebar } from "../components/Sidebar";
import { DashboardHeader } from "../components/DashboardHeader";
import { RealtimeSummary } from "../components/RealtimeSummary";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { PanchayatBreakdown } from "../components/PanchayatBreakdown";
import { RealtimeLeaderboard } from "../components/RealtimeLeaderboard";
import { AIAlerts } from "../components/AIAlerts";

export default function Index() {
  return (
    <div className="flex min-h-screen bg-dashboard-bg">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 max-w-none">
        <div className="bg-dashboard-bg min-h-screen">
          <div className="max-w-[960px] mx-auto">
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
        </div>
      </div>
    </div>
  );
}
