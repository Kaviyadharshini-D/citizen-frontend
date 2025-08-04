import React from "react";
import { DepartmentDashboardData, Employee } from "../data/dashboardData";

interface DepartmentDashboardProps {
  data: DepartmentDashboardData;
  loading?: boolean;
}

export function DepartmentDashboard({
  data,
  loading = false,
}: DepartmentDashboardProps) {
  if (loading) {
    return (
      <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-6">
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const { title, description, summaryStats, employees } = data;

  return (
    <div className="max-w-[960px] mx-auto px-4 lg:px-0 py-4">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-3">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            {title}
          </h1>
        </div>
        <p className="text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
          {description}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-100 rounded-xl p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
              Total Queries
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            {summaryStats.totalQueries.toLocaleString()}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
              Query Solving Rate
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            {summaryStats.querySolvingRate}%
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-6">
          <div className="mb-2">
            <h3 className="text-base font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
              Average Resolution Time
            </h3>
          </div>
          <div className="text-2xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
            {summaryStats.averageResolutionTime}
          </div>
        </div>
      </div>

      {/* Employee Query Assignments Section */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900 font-['Plus_Jakarta_Sans']">
          Employee Query Assignments
        </h2>
      </div>

      {/* Table */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  Employee
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  Assigned Queries
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  Resolved Queries
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  Pending Queries
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee, index) => (
                <tr
                  key={employee.id}
                  className={index > 0 ? "border-t border-gray-200" : ""}
                >
                  <td className="p-4 text-sm text-gray-900 font-['Plus_Jakarta_Sans']">
                    {employee.name}
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
                    {employee.assignedQueries}
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
                    {employee.resolvedQueries}
                  </td>
                  <td className="p-4 text-sm text-gray-500 font-['Plus_Jakarta_Sans']">
                    {employee.pendingQueries}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-4 py-1 rounded-xl text-sm font-medium font-['Plus_Jakarta_Sans'] ${
                        employee.status === "Active"
                          ? "bg-green-100 text-green-900"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4 p-4">
          {employees.map((employee) => (
            <div
              key={employee.id}
              className="bg-white rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                  {employee.name}
                </h3>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-medium font-['Plus_Jakarta_Sans'] ${
                    employee.status === "Active"
                      ? "bg-green-100 text-green-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {employee.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 font-['Plus_Jakarta_Sans']">
                    Assigned
                  </div>
                  <div className="font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                    {employee.assignedQueries}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-['Plus_Jakarta_Sans']">
                    Resolved
                  </div>
                  <div className="font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                    {employee.resolvedQueries}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-['Plus_Jakarta_Sans']">
                    Pending
                  </div>
                  <div className="font-medium text-gray-900 font-['Plus_Jakarta_Sans']">
                    {employee.pendingQueries}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data freshness indicator */}
      <div className="mt-4 text-xs text-gray-400 text-center font-['Plus_Jakarta_Sans']">
        Last updated: {new Date(data.lastUpdated).toLocaleString()}
      </div>
    </div>
  );
}
