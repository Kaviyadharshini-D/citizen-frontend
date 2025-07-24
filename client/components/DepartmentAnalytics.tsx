import { Search, ChevronDown } from "lucide-react";

export function DepartmentAnalytics() {
  const departments = [
    { name: "Road Maintenance", issueCount: "450", resolutionTime: "3 days", satisfaction: 85 },
    { name: "Water Supply", issueCount: "300", resolutionTime: "4 days", satisfaction: 78 },
    { name: "Waste Management", issueCount: "250", resolutionTime: "2 days", satisfaction: 92 },
    { name: "Street Lighting", issueCount: "150", resolutionTime: "1 day", satisfaction: 95 },
    { name: "Public Safety", issueCount: "100", resolutionTime: "5 days", satisfaction: 70 },
  ];

  return (
    <div className="bg-white">
      {/* Section Header */}
      <div className="px-4 py-5">
        <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
          Department Analytics
        </h2>
      </div>

      {/* Search Bar */}
      <div className="px-4 pb-3">
        <div className="flex items-center bg-dashboard-accent rounded-lg">
          <div className="flex items-center justify-center pl-4">
            <Search size={20} className="text-dashboard-text-secondary" />
          </div>
          <input
            type="text"
            placeholder="Search departments"
            className="flex-1 bg-transparent px-2 py-3 text-dashboard-text-secondary placeholder:text-dashboard-text-secondary focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Controls */}
      <div className="px-3 pb-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-dashboard-accent rounded-lg px-4 py-2 cursor-pointer hover:bg-dashboard-border transition-colors">
            <span className="text-dashboard-text-primary text-sm font-medium">
              Sort by: Issue Count
            </span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center gap-2 bg-dashboard-accent rounded-lg px-4 py-2 cursor-pointer hover:bg-dashboard-border transition-colors">
            <span className="text-dashboard-text-primary text-sm font-medium">
              Filter: High Priority
            </span>
            <ChevronDown size={16} />
          </div>
          <div className="flex items-center gap-2 bg-dashboard-accent rounded-lg px-4 py-2 cursor-pointer hover:bg-dashboard-border transition-colors">
            <span className="text-dashboard-text-primary text-sm font-medium">
              Filter: Open
            </span>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="px-4 pb-3">
        <div className="border border-dashboard-border rounded-lg bg-dashboard-bg overflow-hidden">
          {/* Mobile Table - Stack on small screens */}
          <div className="block md:hidden">
            {departments.map((dept, index) => (
              <div key={index} className="bg-white border-t border-gray-200 first:border-t-0 p-4 space-y-2">
                <div className="font-medium text-dashboard-text-primary">{dept.name}</div>
                <div className="flex justify-between">
                  <span className="text-dashboard-text-secondary text-sm">Issues:</span>
                  <span className="text-dashboard-text-secondary text-sm">{dept.issueCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dashboard-text-secondary text-sm">Resolution:</span>
                  <span className="text-dashboard-text-secondary text-sm">{dept.resolutionTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-dashboard-text-secondary text-sm">Satisfaction:</span>
                  <div className="flex-1 bg-dashboard-border rounded-sm h-1">
                    <div
                      className="bg-dashboard-blue h-1 rounded-sm"
                      style={{ width: `${dept.satisfaction}%` }}
                    />
                  </div>
                  <span className="text-dashboard-text-primary text-sm font-medium">
                    {dept.satisfaction}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block">
            {/* Table Header */}
            <div className="bg-dashboard-bg border-b border-gray-200">
              <div className="grid grid-cols-4 gap-4">
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Department</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Issue Count</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Avg. Resolution Time</span>
                </div>
                <div className="px-4 py-3">
                  <span className="text-dashboard-text-primary text-sm font-medium">Satisfaction Rate</span>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="bg-white">
              {departments.map((dept, index) => (
                <div key={index} className="grid grid-cols-4 gap-4 border-t border-gray-200">
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-dashboard-text-primary text-sm">{dept.name}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-dashboard-text-secondary text-sm">{dept.issueCount}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center">
                    <span className="text-dashboard-text-secondary text-sm">{dept.resolutionTime}</span>
                  </div>
                  <div className="px-4 py-4 flex items-center gap-3">
                    <div className="flex-1 bg-dashboard-border rounded-sm h-1">
                      <div
                        className="bg-dashboard-blue h-1 rounded-sm"
                        style={{ width: `${dept.satisfaction}%` }}
                      />
                    </div>
                    <span className="text-dashboard-text-primary text-sm font-medium">
                      {dept.satisfaction}
                    </span>
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
