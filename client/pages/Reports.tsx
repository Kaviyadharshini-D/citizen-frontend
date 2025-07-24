import { Layout } from "../components/Layout";

export default function Reports() {
  const reportData = [
    {
      issueId: "#12345",
      category: "Road Maintenance",
      department: "Public Works", 
      status: "Resolved",
      dateReported: "2024-07-15",
      dateResolved: "2024-07-20"
    },
    {
      issueId: "#12346",
      category: "Water Supply",
      department: "Water Department",
      status: "In Progress", 
      dateReported: "2024-07-16",
      dateResolved: "-"
    },
    {
      issueId: "#12347",
      category: "Street Lighting",
      department: "Electricity Board",
      status: "Resolved",
      dateReported: "2024-07-17", 
      dateResolved: "2024-07-22"
    },
    {
      issueId: "#12348",
      category: "Garbage Collection",
      department: "Sanitation Department",
      status: "Pending",
      dateReported: "2024-07-18",
      dateResolved: "-"
    },
    {
      issueId: "#12349", 
      category: "Drainage Issues",
      department: "Public Works",
      status: "Resolved",
      dateReported: "2024-07-19",
      dateResolved: "2024-07-24"
    }
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center justify-center h-8 px-4 rounded-xl text-sm font-medium";
    const bgColor = "bg-gray-100"; // Using consistent background color as shown in Figma
    
    return (
      <div className={`${baseClasses} ${bgColor} text-dashboard-text-primary`}>
        {status}
      </div>
    );
  };

  return (
    <Layout>
      <div className="bg-dashboard-bg min-h-screen">
        <div className="max-w-[960px] mx-auto px-4 lg:px-0">
          {/* Header */}
          <div className="px-4 py-5">
            <h1 className="text-dashboard-text-primary text-[22px] font-bold leading-7">
              Report Preview
            </h1>
          </div>

          {/* Reports Table */}
          <div className="px-4 pb-3">
            <div className="border border-dashboard-border rounded-xl bg-gray-50 overflow-hidden">
              {/* Mobile Table - Stack on small screens */}
              <div className="block lg:hidden">
                {reportData.map((report, index) => (
                  <div key={index} className="bg-white border-t border-gray-200 first:border-t-0 p-4 space-y-3">
                    <div className="font-medium text-dashboard-text-primary">{report.issueId}</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-dashboard-text-secondary text-sm">Category:</span>
                        <span className="text-dashboard-text-secondary text-sm">{report.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dashboard-text-secondary text-sm">Department:</span>
                        <span className="text-dashboard-text-secondary text-sm">{report.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-dashboard-text-secondary text-sm">Status:</span>
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dashboard-text-secondary text-sm">Reported:</span>
                        <span className="text-dashboard-text-secondary text-sm">{report.dateReported}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dashboard-text-secondary text-sm">Resolved:</span>
                        <span className="text-dashboard-text-secondary text-sm">{report.dateResolved}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block">
                {/* Table Header */}
                <div className="bg-gray-50 border-b border-gray-200">
                  <div className="grid grid-cols-6 gap-4">
                    <div className="px-4 py-3">
                      <span className="text-dashboard-text-primary text-sm font-medium">Issue ID</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-dashboard-text-primary text-sm font-medium">Category</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-dashboard-text-primary text-sm font-medium">Department</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-dashboard-text-primary text-sm font-medium">Status</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-dashboard-text-primary text-sm font-medium">Date Reported</span>
                    </div>
                    <div className="px-4 py-3">
                      <span className="text-dashboard-text-primary text-sm font-medium">Date Resolved</span>
                    </div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="bg-white">
                  {reportData.map((report, index) => (
                    <div key={index} className="grid grid-cols-6 gap-4 border-t border-gray-200 h-18">
                      <div className="px-4 py-4 flex items-center">
                        <span className="text-dashboard-text-primary text-sm">{report.issueId}</span>
                      </div>
                      <div className="px-4 py-4 flex items-center">
                        <span className="text-dashboard-text-secondary text-sm">{report.category}</span>
                      </div>
                      <div className="px-4 py-4 flex items-center">
                        <span className="text-dashboard-text-secondary text-sm">{report.department}</span>
                      </div>
                      <div className="px-4 py-4 flex items-center">
                        {getStatusBadge(report.status)}
                      </div>
                      <div className="px-4 py-4 flex items-center">
                        <span className="text-dashboard-text-secondary text-sm">{report.dateReported}</span>
                      </div>
                      <div className="px-4 py-4 flex items-center">
                        <span className="text-dashboard-text-secondary text-sm">{report.dateResolved}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
