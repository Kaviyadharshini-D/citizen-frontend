import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useConstituencyIssues } from "../hooks/useApi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Clock,
  Filter,
  MapPin,
  Calendar,
  ThumbsUp,
  FileText,
  CheckCircle,
  Activity,
} from "lucide-react";

type FilterType = "latest" | "upvotes" | "category";

export default function Issues() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Get user's constituency ID for API call
  const getConstituencyId = () => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const apiUser = JSON.parse(userData);
        return apiUser.constituency_id || "";
      } catch (error) {
        console.error("Error parsing user data:", error);
        return "";
      }
    }
    return "";
  };

  const constituencyId = getConstituencyId();

  // Fetch constituency issues
  const { data: constituencyIssuesData, isLoading: issuesLoading } =
    useConstituencyIssues(constituencyId);

  // Get issues from API response
  const allIssues =
    constituencyIssuesData?.issues?.issues ||
    constituencyIssuesData?.issues ||
    [];

  // Ensure allIssues is always an array
  const safeAllIssues = Array.isArray(allIssues) ? allIssues : [];

  // Filter and sort issues based on active filter
  const getFilteredIssues = () => {
    let filteredIssues = [...safeAllIssues];

    // Apply category filter if selected
    if (activeFilter === "category" && selectedCategory) {
      filteredIssues = filteredIssues.filter(
        (issue) =>
          issue.detail
            ?.toLowerCase()
            .includes(selectedCategory.toLowerCase()) ||
          issue.title?.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    // Apply sorting based on filter
    switch (activeFilter) {
      case "latest":
        filteredIssues.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "upvotes":
        filteredIssues.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
        break;
      case "category":
        // Already filtered by category, sort by latest
        filteredIssues.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
    }

    return filteredIssues;
  };

  const filteredIssues = getFilteredIssues();

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    if (filter !== "category") {
      setSelectedCategory("");
    }
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setActiveFilter("category");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200";

    let bgColor = "bg-slate-100";
    let textColor = "text-slate-700";
    let borderColor = "border-slate-200";

    switch (status?.toLowerCase()) {
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
        {status?.replace("_", " ").toUpperCase() || "PENDING"}
      </div>
    );
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

  const filterButtonVariants = {
    inactive: { scale: 1 },
    active: { scale: 1.05 },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
              Community Issues Feed
            </h1>
          </motion.div>

          {/* Stats Card */}

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
                {safeAllIssues.length}
              </div>
              <div className="text-slate-600 font-medium">Total Reports</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {
                  safeAllIssues.filter((issue) => issue.status === "resolved")
                    .length
                }
              </div>
              <div className="text-slate-600 font-medium">Resolved</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-amber-600 mb-2">
                {
                  safeAllIssues.filter(
                    (issue) =>
                      issue.status === "pending" ||
                      issue.status === "in_progress",
                  ).length
                }
              </div>
              <div className="text-slate-600 font-medium">Active</div>
            </div>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-2xl  p-6"
          >
            <div className="flex flex-wrap gap-4 mb-6">
              <motion.button
                variants={filterButtonVariants}
                whileHover="active"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("latest")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeFilter === "latest"
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Clock className="w-4 h-4" />
                Latest
              </motion.button>
              <motion.button
                variants={filterButtonVariants}
                whileHover="active"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("upvotes")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeFilter === "upvotes"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-200 border "
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Most Popular
              </motion.button>
              <motion.button
                variants={filterButtonVariants}
                whileHover="active"
                whileTap={{ scale: 0.95 }}
                onClick={() => handleFilterChange("category")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeFilter === "category"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                    : "bg-white text-slate-700 hover:bg-slate-200 border"
                }`}
              >
                <Filter className="w-4 h-4" />
                By Category
              </motion.button>
            </div>

            {/* Category Filter Dropdown */}
            <AnimatePresence>
              {activeFilter === "category" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full md:w-64 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="">Select a category...</option>
                    <option value="road">🚧 Road Issues</option>
                    <option value="water">💧 Water Supply</option>
                    <option value="electricity">⚡ Electricity</option>
                    <option value="sanitation">🧹 Sanitation</option>
                    <option value="healthcare">🏥 Healthcare</option>
                    <option value="education">📚 Education</option>
                    <option value="transportation">🚌 Transportation</option>
                  </select>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Feed Items */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {issuesLoading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="inline-flex items-center gap-3 text-slate-600">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-lg font-medium">
                    Loading community issues...
                  </span>
                </div>
              </motion.div>
            ) : filteredIssues.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="text-slate-500">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-xl font-semibold mb-2">
                    {activeFilter === "category" && selectedCategory
                      ? `No issues found for "${selectedCategory}"`
                      : "No issues found in your constituency"}
                  </h3>
                  <p className="text-slate-400">
                    {activeFilter === "category" && selectedCategory
                      ? "Try selecting a different category or check back later."
                      : "Be the first to report an issue in your area!"}
                  </p>
                </div>
              </motion.div>
            ) : (
              filteredIssues.map((issue, index) => (
                <motion.div
                  key={issue._id || index}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Content */}
                      <div className="flex-1 space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 mb-4">
                            {getStatusBadge(issue.status)}
                            <div className="flex items-center gap-2 text-slate-500">
                              <Calendar className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {formatDate(issue.created_at)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-600 mb-4">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              {issue.locality || "Location not specified"}
                            </span>
                          </div>

                          <h3 className="text-2xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors duration-200">
                            {issue.title}
                          </h3>

                          <p className="text-slate-600 leading-relaxed text-lg">
                            {issue.detail}
                          </p>
                        </div>

                        {/* Upvotes */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-xl border border-emerald-200">
                            <ThumbsUp className="w-4 h-4 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">
                              {issue.upvotes || 0} Upvotes
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Image placeholder - show if attachments exist */}
                      {issue.attachments && (
                        <div className="lg:w-80 flex-shrink-0">
                          <div className="w-full h-48 lg:h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                            <div className="text-center">
                              <div className="text-3xl mb-2">📷</div>
                              <span className="text-slate-500 font-medium">
                                Attachment
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
