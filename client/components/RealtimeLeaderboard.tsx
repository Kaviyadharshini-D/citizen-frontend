import { useState } from "react";

export function RealtimeLeaderboard() {
  const [activeTab, setActiveTab] = useState("departments");

  const departmentData = [
    { name: "Road Maintenance", resolved: "400", rating: "4.5" },
    { name: "Water Supply", resolved: "280", rating: "4.2" },
    { name: "Waste Management", resolved: "230", rating: "4.8" },
    { name: "Street Lighting", resolved: "140", rating: "4.9" },
    { name: "Public Safety", resolved: "90", rating: "3.8" },
  ];

  return (
    <div className="bg-white">
      {/* Section Header */}
      <div className="px-4 py-5">
        <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
          Real-time Leaderboard
        </h2>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="border-b border-dashboard-border">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("departments")}
              className={`pb-4 border-b-2 text-sm font-bold ${
                activeTab === "departments"
                  ? "border-gray-300 text-dashboard-text-primary"
                  : "border-transparent text-dashboard-text-secondary"
              }`}
            >
              Departments
            </button>
            <button
              onClick={() => setActiveTab("officers")}
              className={`pb-4 border-b-2 text-sm font-bold ${
                activeTab === "officers"
                  ? "border-gray-300 text-dashboard-text-primary"
                  : "border-transparent text-dashboard-text-secondary"
              }`}
            >
              Officers
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 pb-3">
        <div className="border border-dashboard-border rounded-lg bg-dashboard-bg overflow-hidden">
          {/* Mobile Table - Stack on small screens */}
          <div className="block md:hidden">
            {departmentData.map((dept, index) => (
              <div key={index} className="bg-white border-t border-gray-200 first:border-t-0 p-4 space-y-2">
                <div className="font-medium text-dashboard-text-primary">{dept.name}</div>
                <div className="flex justify-between">
                  <span className="text-dashboard-text-secondary text-sm">Resolved:</span>
                  <span className="text-dashboard-text-secondary text-sm">{dept.resolved}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dashboard-text-secondary text-sm">Rating:</span>
                  <span className="text-dashboard-text-secondary text-sm">{dept.rating}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="bg-dashboard-bg border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Department</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Issues Resolved</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Avg. Rating</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white">
              {departmentData.map((dept, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 border-t border-gray-200">
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-dashboard-text-primary text-sm">{dept.name}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-dashboard-text-secondary text-sm">{dept.resolved}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-dashboard-text-secondary text-sm">{dept.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
