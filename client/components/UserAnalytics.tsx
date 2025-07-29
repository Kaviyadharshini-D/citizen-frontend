import React from 'react';

interface DepartmentStat {
  department: string;
  totalIssues: number;
  resolutionRate: number;
}

const departmentStats: DepartmentStat[] = [
  {
    department: "Public Works",
    totalIssues: 50,
    resolutionRate: 75
  },
  {
    department: "Water Supply",
    totalIssues: 30,
    resolutionRate: 60
  },
  {
    department: "Electricity Board",
    totalIssues: 25,
    resolutionRate: 80
  },
  {
    department: "Sanitation",
    totalIssues: 20,
    resolutionRate: 50
  }
];

export function UserAnalytics() {
  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 px-4">
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-sans">
              Total Queries Submitted
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-sans">
            125
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-sans">
              Queries Resolved
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-sans">
            85
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-sans">
              Queries Pending
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-sans">
            40
          </div>
        </div>
      </div>

      {/* Query Status Section */}
      <div className="mb-8">
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-sans">
            Query Status
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6">
          {/* Queries by Category Chart */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-base font-medium text-gray-900 font-sans mb-6">
              Queries by Category
            </h3>
            <div className="flex items-end justify-center gap-6 h-44 mb-6">
              {["Roads", "Water", "Electricity", "Sanitation", "Other"].map((category, index) => {
                const heights = [137, 120, 100, 90, 80];
                return (
                  <div key={category} className="flex flex-col items-center gap-6">
                    <div 
                      className="w-8 bg-blue-50 border-t-2 border-gray-500"
                      style={{ height: `${heights[index]}px` }}
                    />
                    <div className="text-xs font-bold text-blue-700 font-sans text-center">
                      {category}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Queries by Panchayat Chart */}
          <div className="border border-gray-300 rounded-lg p-6">
            <h3 className="text-base font-medium text-gray-900 font-sans mb-6">
              Queries by Panchayat
            </h3>
            <div className="flex items-end justify-center gap-6 h-44 mb-6">
              {["Panchayat A", "Panchayat B", "Panchayat C", "Panchayat D"].map((panchayat, index) => {
                const heights = [117, 100, 85, 70];
                return (
                  <div key={panchayat} className="flex flex-col items-center gap-6 flex-1">
                    <div 
                      className="w-full bg-blue-50 border-t-2 border-gray-500"
                      style={{ height: `${heights[index]}px` }}
                    />
                    <div className="text-xs font-bold text-blue-700 font-sans text-center">
                      {panchayat}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Department Statistics Section */}
      <div className="mb-8">
        <div className="px-4 mb-6">
          <h2 className="text-xl font-bold text-gray-900 font-sans">
            Department Statistics
          </h2>
        </div>

        <div className="px-4">
          <div className="border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              {/* Table Header */}
              <div className="bg-gray-50">
                <div className="grid grid-cols-3 gap-4">
                  <div className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 font-sans">Department</span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 font-sans">Total Issues</span>
                  </div>
                  <div className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900 font-sans">Resolution Rate</span>
                  </div>
                </div>
              </div>

              {/* Table Body */}
              <div className="bg-gray-50">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 border-t border-gray-200">
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-gray-900 font-sans">{dept.department}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center">
                      <span className="text-sm text-blue-700 font-sans">{dept.totalIssues}</span>
                    </div>
                    <div className="px-4 py-4 flex items-center gap-3">
                      <div className="flex-1 bg-gray-300 rounded-sm h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-sm"
                          style={{ width: `${dept.resolutionRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 font-sans">
                        {dept.resolutionRate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 p-4">
              {departmentStats.map((dept, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-gray-900 font-sans">
                      {dept.department}
                    </h3>
                    <span className="text-sm text-blue-700 font-sans">
                      {dept.totalIssues} issues
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 font-sans">Resolution Rate:</span>
                    <div className="flex-1 bg-gray-300 rounded-sm h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-sm"
                        style={{ width: `${dept.resolutionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 font-sans">
                      {dept.resolutionRate}%
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
