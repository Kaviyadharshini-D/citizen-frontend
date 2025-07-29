import { Layout } from "../components/Layout";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { useUser } from "../context/UserContext";

export default function Analytics() {
  const { user } = useUser();

  // Show Department-specific analytics for Department role
  if (user.role === 'Department') {
    return (
      <Layout>
        <div className="bg-dashboard-bg min-h-screen">
          <DepartmentAnalytics />
        </div>
      </Layout>
    );
  }

  // Show default analytics for other roles
  const summaryCards = [
    { title: "Total Queries", value: "1,234" },
    { title: "Avg Resolution Time", value: "3 days" },
    { title: "Open Cases", value: "256" },
    { title: "Resolved Cases", value: "978" },
  ];

  const departmentEfficiency = [
    { department: "Water", responseTime: "2 days", closureRate: 95 },
    { department: "Roads", responseTime: "3 days", closureRate: 88 },
    { department: "Electricity", responseTime: "4 days", closureRate: 82 },
    { department: "Sanitation", responseTime: "2 days", closureRate: 90 },
    { department: "Other", responseTime: "5 days", closureRate: 75 },
  ];

  return (
    <Layout>
      <div className="bg-dashboard-bg min-h-screen">
        <div className="max-w-[960px] mx-auto px-4 lg:px-0">
          {/* Top Metrics Cards */}
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {summaryCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-dashboard-accent rounded-lg p-6 min-w-[158px]"
                >
                  <div className="mb-2">
                    <div className="text-dashboard-text-primary text-base font-medium">
                      {card.title}
                    </div>
                  </div>
                  <div className="text-dashboard-text-primary text-2xl font-bold leading-7">
                    {card.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department-wise Queries Section */}
          <div className="bg-white mb-6">
            <div className="px-4 py-5">
              <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
                Department-wise Queries
              </h2>
            </div>
            
            <div className="px-4 pb-6">
              <div className="border border-dashboard-border rounded-lg p-6 bg-white">
                <div className="mb-2">
                  <div className="text-dashboard-text-primary text-base font-medium">
                    Queries by Department
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-dashboard-text-primary text-[32px] font-bold leading-10">
                    1,234
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-dashboard-text-secondary text-base">
                    Total
                  </div>
                </div>
                
                {/* Chart Area */}
                <div className="h-40 bg-gradient-to-t from-dashboard-accent/20 to-transparent rounded-lg mb-8 relative overflow-hidden">
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 400 160" 
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(232, 237, 242)" stopOpacity="1"/>
                        <stop offset="50%" stopColor="rgb(232, 237, 242)" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,120 C 50,120 50,40 100,40 C 150,40 150,80 200,80 C 250,80 250,100 300,100 C 350,100 350,20 400,20 L 400,160 L 0,160 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 0,120 C 50,120 50,40 100,40 C 150,40 150,80 200,80 C 250,80 250,100 300,100 C 350,100 350,20 400,20"
                      stroke="rgb(77, 115, 153)"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
                
                {/* Chart Labels */}
                <div className="flex justify-between text-dashboard-text-secondary text-sm font-bold">
                  <span>Water</span>
                  <span>Roads</span>
                  <span>Electricity</span>
                  <span>Sanitation</span>
                  <span>Other</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly/Monthly Performance Trends */}
          <div className="bg-white mb-6">
            <div className="px-4 py-5">
              <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
                Weekly/Monthly Performance Trends
              </h2>
            </div>
            
            <div className="px-4 pb-6">
              <div className="border border-dashboard-border rounded-lg p-6 bg-white">
                <div className="mb-2">
                  <div className="text-dashboard-text-primary text-base font-medium">
                    Performance Trends
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-dashboard-text-primary text-[32px] font-bold leading-10">
                    +15%
                  </div>
                </div>
                <div className="mb-4 flex items-center gap-1">
                  <span className="text-dashboard-text-secondary text-base">
                    Last 30 Days
                  </span>
                  <span className="text-green-600 text-base font-medium">
                    +15%
                  </span>
                </div>
                
                {/* Chart Area */}
                <div className="h-40 bg-gradient-to-t from-dashboard-accent/20 to-transparent rounded-lg mb-8 relative overflow-hidden">
                  <svg 
                    className="w-full h-full" 
                    viewBox="0 0 400 160" 
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(232, 237, 242)" stopOpacity="1"/>
                        <stop offset="50%" stopColor="rgb(232, 237, 242)" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,120 C 50,120 50,40 100,40 C 150,40 150,80 200,80 C 250,80 250,100 300,100 C 350,100 350,20 400,20 L 400,160 L 0,160 Z"
                      fill="url(#trendGradient)"
                    />
                    <path
                      d="M 0,120 C 50,120 50,40 100,40 C 150,40 150,80 200,80 C 250,80 250,100 300,100 C 350,100 350,20 400,20"
                      stroke="rgb(77, 115, 153)"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
                
                {/* Chart Labels */}
                <div className="flex justify-between text-dashboard-text-secondary text-sm font-bold">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Efficiency Leaderboard */}
          <div className="bg-white mb-6">
            <div className="px-4 py-5">
              <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
                Department Efficiency Leaderboard
              </h2>
            </div>
            
            <div className="px-4 pb-3">
              <div className="border border-dashboard-border rounded-lg bg-dashboard-bg overflow-hidden">
                {/* Mobile Table - Stack on small screens */}
                <div className="block md:hidden">
                  {departmentEfficiency.map((dept, index) => (
                    <div key={index} className="bg-white border-t border-gray-200 first:border-t-0 p-4 space-y-2">
                      <div className="font-medium text-dashboard-text-primary">{dept.department}</div>
                      <div className="flex justify-between">
                        <span className="text-dashboard-text-secondary text-sm">Response Time:</span>
                        <span className="text-dashboard-text-secondary text-sm">{dept.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-dashboard-text-secondary text-sm">Closure Rate:</span>
                        <div className="flex-1 bg-dashboard-border rounded-sm h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-sm"
                            style={{ width: `${dept.closureRate}%` }}
                          />
                        </div>
                        <span className="text-dashboard-text-primary text-sm font-medium">
                          {dept.closureRate}
                        </span>
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
                        <span className="text-dashboard-text-primary text-sm font-medium">Avg. Response Time</span>
                      </div>
                      <div className="px-4 py-3">
                        <span className="text-dashboard-text-primary text-sm font-medium">Closure Rate</span>
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="bg-white">
                    {departmentEfficiency.map((dept, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4 border-t border-gray-200">
                        <div className="px-4 py-4 flex items-center">
                          <span className="text-dashboard-text-primary text-sm">{dept.department}</span>
                        </div>
                        <div className="px-4 py-4 flex items-center">
                          <span className="text-dashboard-text-secondary text-sm">{dept.responseTime}</span>
                        </div>
                        <div className="px-4 py-4 flex items-center gap-3">
                          <div className="flex-1 bg-dashboard-border rounded-sm h-1">
                            <div 
                              className="bg-blue-500 h-1 rounded-sm"
                              style={{ width: `${dept.closureRate}%` }}
                            />
                          </div>
                          <span className="text-dashboard-text-primary text-sm font-medium">
                            {dept.closureRate}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panchayat-level Breakdown */}
          <div className="bg-white mb-6">
            <div className="px-4 py-5">
              <h2 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
                Panchayat-level Breakdown
              </h2>
            </div>
            
            <div className="px-4 pb-3">
              <div className="rounded-lg overflow-hidden">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ade6f7aba196df02cb12aac9165fcb93cb938971?width=1752"
                  alt="Ward 14 Banglakar map"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
