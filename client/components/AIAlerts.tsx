import { AlertTriangle } from "lucide-react";

export function AIAlerts() {
  return (
    <div className="bg-white">
      {/* Section Header */}
      <div className="px-4 py-5">
        <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
          AI Alerts
        </h2>
      </div>

      {/* Alert */}
      <div className="px-4 pb-3">
        <div className="bg-dashboard-bg p-3 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-dashboard-accent rounded-lg flex-shrink-0">
              <AlertTriangle size={24} className="text-dashboard-text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="mb-1">
                <h3 className="text-dashboard-text-primary text-base font-medium">
                  Alert: Suspicious Activity
                </h3>
              </div>
              <div className="mb-1">
                <p className="text-dashboard-text-secondary text-sm">
                  Possible misuse of the platform. User has submitted multiple issues with similar content.
                </p>
              </div>
              <div>
                <p className="text-dashboard-text-secondary text-sm">
                  Reported by: Ravi Kumar
                </p>
              </div>
            </div>

            <div className="flex-shrink-0">
              <button className="bg-dashboard-accent hover:bg-dashboard-border px-4 py-2 rounded-lg text-dashboard-text-primary text-sm font-medium transition-colors">
                Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
