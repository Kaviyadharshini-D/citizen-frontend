import React from "react";
import { Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { DashboardHeader } from "../components/DashboardHeader";
import { RealtimeSummary } from "../components/RealtimeSummary";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { PanchayatBreakdown } from "../components/PanchayatBreakdown";
import { RealtimeLeaderboard } from "../components/RealtimeLeaderboard";
import { AIAlerts } from "../components/AIAlerts";
import { MLADashboard } from "../components/MLADashboard";
import UserDashboard from "../components/UserDashboard";
import { useUser } from "../context/UserContext";
import { motion } from "framer-motion";
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

  // Redirect admins to dedicated admin dashboard to avoid duplicate dashboards
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Redirect department users to dedicated dashboard
  if (user.role === "dept" || user.role === "dept_staff") {
    return <Navigate to="/dashboard" replace />;
  }

  // Determine which dashboard to show based on user role
  let dashboardContent;

  if (user.role === "mlastaff") {
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
