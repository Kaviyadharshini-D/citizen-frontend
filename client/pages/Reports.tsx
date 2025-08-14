import React from "react";
import { Layout } from "../components/Layout";
import { useUserIssues } from "../hooks/useApi";
import { useUser } from "../context/UserContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Eye,
  Activity,
} from "lucide-react";

export default function Reports() {
  const { user } = useUser();

  // Get user ID from localStorage
  const getUserId = () => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const apiUser = JSON.parse(userData);
        return apiUser.id || "";
      } catch (error) {
        console.error("Error parsing user data:", error);
        return "";
      }
    }
    return "";
  };

  const userId = getUserId();

  // Fetch user's issues from API
  const { data: issuesData, isLoading, error } = useUserIssues(userId);

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150";

    let bgColor = "bg-slate-100";
    let textColor = "text-slate-700";
    let borderColor = "border-slate-200";

    switch (status.toLowerCase()) {
      case "resolved":
        bgColor = "bg-emerald-50";
        textColor = "text-emerald-700";
        borderColor = "border-emerald-200";
        break;
      case "in_progress":
        bgColor = "bg-blue-50";
        textColor = "text-blue-700";
        borderColor = "border-blue-200";
        break;
      case "pending":
        bgColor = "bg-amber-50";
        textColor = "text-amber-700";
        borderColor = "border-amber-200";
        break;
      case "rejected":
        bgColor = "bg-red-50";
        textColor = "text-red-700";
        borderColor = "border-red-200";
        break;
      default:
        bgColor = "bg-slate-50";
        textColor = "text-slate-700";
        borderColor = "border-slate-200";
    }

    return (
      <div
        className={`${baseClasses} ${bgColor} ${textColor} ${borderColor} border`}
      >
        {status.replace("_", " ").toUpperCase()}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  // Show loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                My Reports
              </h1>
              <p className="text-lg text-slate-600">
                Tracking your community contributions
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center"
            >
              <div className="inline-flex items-center gap-3 text-slate-600">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg font-medium">
                  Loading your reports...
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                My Reports
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-16 text-center"
            >
              <div className="text-red-500 mb-4">
                <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  Error loading reports
                </h3>
                <p className="text-slate-600">
                  {error instanceof Error
                    ? error.message
                    : "Please try again later"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Get issues from API response
  const issues = issuesData?.issues?.issues || [];
  const safeIssues = Array.isArray(issues) ? issues : [];

  // Calculate stats
  const totalIssues = safeIssues.length;
  const resolvedIssues = safeIssues.filter(
    (issue) => issue.status === "resolved",
  ).length;
  const activeIssues = safeIssues.filter(
    (issue) => issue.status === "pending" || issue.status === "in_progress",
  ).length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              My Reports
            </h1>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-slate-800 mb-2">
                {totalIssues}
              </div>
              <div className="text-slate-600 font-medium">Total Reports</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {resolvedIssues}
              </div>
              <div className="text-slate-600 font-medium">Resolved</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {activeIssues}
              </div>
              <div className="text-slate-600 font-medium">Active</div>
            </div>
          </motion.div>

          {/* Reports Table */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden"
          >
            {safeIssues.length === 0 ? (
              <div className="p-16 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">
                  No reports found
                </h3>
                <p className="text-slate-600 mb-6">
                  You haven't submitted any issues yet. Start making a
                  difference in your community!
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.1 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-150"
                >
                  Report Your First Issue
                </motion.button>
              </div>
            ) : (
              <>
                {/* Mobile Cards */}
                <div className="block lg:hidden">
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-slate-200"
                  >
                    {safeIssues.map((issue, index) => (
                      <motion.div
                        key={issue._id || index}
                        variants={itemVariants}
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.1 }}
                        className="p-6 hover:bg-slate-50 transition-all duration-150"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-600">
                                  #{issue._id?.slice(-6) || "N/A"}
                                </span>
                              </div>
                              {getStatusBadge(issue.status)}
                            </div>
                            <div className="flex items-center gap-2 text-slate-500">
                              <Calendar className="w-4 h-4" />
                              <span className="text-xs font-medium">
                                {formatDate(issue.created_at)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-slate-800 mb-2">
                              {issue.title}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {issue.detail}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{issue.locality || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                Updated {formatDate(issue.updated_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block">
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <div className="grid grid-cols-6 gap-4 px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 text-sm font-semibold">
                          Issue ID
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-700 text-sm font-semibold">
                          Title
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 text-sm font-semibold">
                          Location
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-700 text-sm font-semibold">
                          Status
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 text-sm font-semibold">
                          Reported
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-700 text-sm font-semibold">
                          Updated
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="divide-y divide-slate-200"
                  >
                    {safeIssues.map((issue, index) => (
                      <motion.div
                        key={issue._id || index}
                        variants={itemVariants}
                        whileHover={{ backgroundColor: "#f8fafc" }}
                        transition={{ duration: 0.1 }}
                        className="grid grid-cols-6 gap-4 px-6 py-4 transition-all duration-150"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-600">
                              #{issue._id?.slice(-6) || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium text-slate-800 text-sm">
                              {issue.title}
                            </div>
                            <div className="text-slate-500 text-xs line-clamp-1">
                              {issue.detail}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-slate-600 text-sm">
                            {issue.locality || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {getStatusBadge(issue.status)}
                        </div>
                        <div className="flex items-center">
                          <span className="text-slate-600 text-sm">
                            {formatDate(issue.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-slate-600 text-sm">
                            {formatDate(issue.updated_at)}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
