import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { DashboardHeader } from "../components/DashboardHeader";
import { RealtimeSummary } from "../components/RealtimeSummary";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { PanchayatBreakdown } from "../components/PanchayatBreakdown";
import { RealtimeLeaderboard } from "../components/RealtimeLeaderboard";
import { AIAlerts } from "../components/AIAlerts";
import { DepartmentDashboard } from "../components/DepartmentDashboard";
import { MLADashboard } from "../components/MLADashboard";
import UserDashboard from "../components/UserDashboard";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
import {
  fetchDepartmentDashboardData,
  DepartmentDashboardData,
} from "../data/dashboardData";
import {
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Activity,
  Users,
  Target,
} from "lucide-react";

export default function Index() {
  const { user } = useUser();
  const [departmentData, setDepartmentData] =
    useState<DepartmentDashboardData | null>(null);

  const [loading, setLoading] = useState(false);

  // Fetch department dashboard data when user role is Department
  useEffect(() => {
    if (user?.role === "dept" || user?.role === "dept_staff") {
      setLoading(true);
      fetchDepartmentDashboardData()
        .then(setDepartmentData)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user?.role]);

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  // Analytics data for MLA and ADMIN
  const summaryCards = [
    {
      title: "Total Queries",
      value: "1,234",
      icon: Activity,
      color: "from-blue-500 to-indigo-600",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Resolution Time",
      value: "3 days",
      icon: Clock,
      color: "from-emerald-500 to-teal-600",
      change: "-8%",
      changeType: "positive" as const,
    },
    {
      title: "Open Cases",
      value: "256",
      icon: AlertCircle,
      color: "from-orange-500 to-red-600",
      change: "+5%",
      changeType: "negative" as const,
    },
    {
      title: "Resolved Cases",
      value: "978",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-600",
      change: "+15%",
      changeType: "positive" as const,
    },
  ];

  const departmentEfficiency = [
    {
      department: "Water",
      responseTime: "2 days",
      closureRate: 95,
      color: "from-blue-500 to-cyan-600",
    },
    {
      department: "Roads",
      responseTime: "3 days",
      closureRate: 88,
      color: "from-orange-500 to-red-600",
    },
    {
      department: "Electricity",
      responseTime: "4 days",
      closureRate: 82,
      color: "from-yellow-500 to-orange-600",
    },
    {
      department: "Sanitation",
      responseTime: "2 days",
      closureRate: 90,
      color: "from-emerald-500 to-teal-600",
    },
    {
      department: "Other",
      responseTime: "5 days",
      closureRate: 75,
      color: "from-purple-500 to-pink-600",
    },
  ];

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">
              Loading dashboard...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // Determine which dashboard to show based on user role
  let dashboardContent;

  if (user.role === "dept" || user.role === "dept_staff") {
    dashboardContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <DepartmentDashboard
          data={departmentData!}
          loading={loading || !departmentData}
        />
      </motion.div>
    );
  } else if (user.role === "mlastaff") {
    dashboardContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MLADashboard />
      </motion.div>
    );
  } else if (user.role === "citizen") {
    dashboardContent = (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <UserDashboard />
      </motion.div>
    );
  } else if (user.role === "admin") {
    dashboardContent = (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 dark:from-slate-200 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4 transition-colors duration-300">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors duration-300">
              Comprehensive insights and performance metrics
            </p>
          </div>
        </motion.div>

        {/* Top Metrics Cards */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* Department-wise Queries */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Department-wise Queries
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Summary Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      Overall Performance
                    </h4>
                  </div>
                  <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-2">
                    87%
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                    Average closure rate across all departments
                  </div>
                </div>

                {/* Chart Area */}
                <div className="h-32 bg-gradient-to-t from-blue-500/20 to-transparent rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                    {departmentEfficiency.map((dept, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-8 bg-gradient-to-r ${dept.color} rounded-t-lg transition-all duration-500`}
                          style={{ height: `${dept.closureRate * 0.3}px` }}
                        />
                        <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">
                          {dept.department}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Department List */}
              <div className="mt-6 space-y-4">
                {departmentEfficiency.map((dept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 bg-gradient-to-r ${dept.color} rounded-full`}
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                        {dept.department}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                          {dept.responseTime}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                          Avg Response
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                          {dept.closureRate}%
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                          Closure Rate
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Analytics Sections */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Recent Activity
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  action: "New issue reported",
                  time: "2 min ago",
                  type: "issue",
                },
                {
                  action: "Issue resolved",
                  time: "1 hour ago",
                  type: "resolved",
                },
                {
                  action: "Department response",
                  time: "3 hours ago",
                  type: "response",
                },
                {
                  action: "New user registered",
                  time: "5 hours ago",
                  type: "user",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "issue"
                        ? "bg-orange-500"
                        : activity.type === "resolved"
                          ? "bg-emerald-500"
                          : activity.type === "response"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {activity.action}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Performance Metrics
              </h3>
            </div>
            <div className="space-y-4">
              {[
                { metric: "Response Rate", value: "94%", target: "90%" },
                {
                  metric: "Resolution Time",
                  value: "2.3 days",
                  target: "3 days",
                },
                {
                  metric: "User Satisfaction",
                  value: "4.8/5",
                  target: "4.5/5",
                },
                {
                  metric: "System Uptime",
                  value: "99.9%",
                  target: "99.5%",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {metric.metric}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      Target: {metric.target}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {metric.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  } else {
    // Fallback for unknown roles - show default dashboard
    dashboardContent = (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 lg:px-8 py-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <DashboardHeader />
        </motion.div>

        {/* Real-time Summary */}
        <motion.div variants={itemVariants}>
          <RealtimeSummary />
        </motion.div>

        {/* Department Analytics */}
        <motion.div variants={itemVariants}>
          <DepartmentAnalytics />
        </motion.div>

        {/* Panchayat-level Breakdown */}
        <motion.div variants={itemVariants}>
          <PanchayatBreakdown />
        </motion.div>

        {/* Real-time Leaderboard */}
        <motion.div variants={itemVariants}>
          <RealtimeLeaderboard />
        </motion.div>

        {/* AI Alerts */}
        <motion.div variants={itemVariants}>
          <AIAlerts />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {dashboardContent}
      </div>
    </Layout>
  );
}
