import React from "react";
import { DepartmentDashboardData, Employee } from "../data/dashboardData";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
  Target,
} from "lucide-react";

interface DepartmentDashboardProps {
  data: DepartmentDashboardData;
  loading?: boolean;
}

export function DepartmentDashboard({
  data,
  loading = false,
}: DepartmentDashboardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.4,
  //       ease: "easeOut" as const,
  //     },
  //   },
  // };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse"
        >
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-80 mb-4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 mb-3"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-20"></div>
              </div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
        </motion.div>
      </div>
    );
  }

  const { title, description, summaryStats, employees } = data;

  const summaryCards = [
    {
      title: "Total Queries",
      value: summaryStats.totalQueries.toLocaleString(),
      icon: Target,
      color: "from-blue-500 to-indigo-600",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Query Solving Rate",
      value: `${summaryStats.querySolvingRate}%`,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Resolution Time",
      value: summaryStats.averageResolutionTime,
      icon: Clock,
      color: "from-orange-500 to-red-600",
      change: "-15%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div /*variants={itemVariants}*/ className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 dark:from-slate-200 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4 transition-colors duration-300">
              {title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors duration-300">
              {description}
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div /*variants={itemVariants}*/ className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        card.changeType === "positive"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {card.change}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium transition-colors duration-300">
                      {card.title}
                    </div>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 text-3xl font-bold transition-colors duration-300">
                    {card.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Employee Query Assignments Section */}
        <motion.div /*variants={itemVariants}*/ className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
              Employee Query Assignments
            </h2>
          </div>
        </motion.div>

        {/* Table */}
        <motion.div /*variants={itemVariants}*/>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
                        Employee
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
                        Assigned Queries
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
                        Resolved Queries
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
                        Pending Queries
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors duration-300">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <motion.tr
                        key={employee.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${
                          index > 0
                            ? "border-t border-slate-200 dark:border-slate-700"
                            : ""
                        } hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200`}
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center">
                              <UserCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                                {employee.name}
                              </div>
                              <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                                Employee #{employee.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                              {employee.assignedQueries}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                              {employee.resolvedQueries}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                              {employee.pendingQueries}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span
                            className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                              employee.status === "Active"
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                                : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full mr-2 ${
                                employee.status === "Active"
                                  ? "bg-emerald-500"
                                  : "bg-slate-400"
                              }`}
                            />
                            {employee.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden p-6 space-y-4">
              {employees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                          {employee.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                          Employee #{employee.id}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        employee.status === "Active"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-slate-100 dark:bg-slate-600 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-500"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          employee.status === "Active"
                            ? "bg-emerald-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {employee.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
                          Assigned
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-lg transition-colors duration-300">
                        {employee.assignedQueries}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
                          Resolved
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-lg transition-colors duration-300">
                        {employee.resolvedQueries}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors duration-300">
                          Pending
                        </span>
                      </div>
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-lg transition-colors duration-300">
                        {employee.pendingQueries}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Data freshness indicator */}
        <motion.div /*variants={itemVariants}*/ className="mt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
            <Activity className="w-4 h-4" />
            <span>
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
