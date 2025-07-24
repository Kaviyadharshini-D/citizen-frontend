import { Bell } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="bg-white">
      {/* Header with title and notification */}
      <div className="flex justify-between items-start p-4">
        <div className="flex-1">
          <h1 className="text-dashboard-text-primary text-[32px] font-bold leading-10 mb-3">
            MLA Dashboard
          </h1>
          <p className="text-dashboard-text-secondary text-sm">
            Overview of civic issues and performance metrics
          </p>
        </div>
        
        <div className="flex items-center justify-center w-10 h-10 bg-dashboard-accent rounded-lg">
          <Bell size={20} className="text-dashboard-text-primary" />
        </div>
      </div>
    </div>
  );
}
