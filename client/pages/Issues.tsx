import React, { useState } from "react";
import { Layout } from "../components/Layout";
import { useConstituencyIssues } from "../hooks/useApi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
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
  User,
  Eye,
  MessageSquare,
  AlertCircle,
  Star,
  X,
} from "lucide-react";

type FilterType = "latest" | "upvotes" | "category";

export default function Issues() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

    // Filter out completed issues
    filteredIssues = filteredIssues.filter(
      (issue) => issue.status !== "completed",
    );

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

  const handleIssueClick = (issue: any) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  // Safely display API fields that may be objects or strings
  const displayText = (value: any): string => {
    if (value === null || value === undefined) return "Not specified";
    if (typeof value === "string" || typeof value === "number")
      return String(value);
    if (typeof value === "object") {
      if (typeof (value as any).name === "string") return (value as any).name;
      if (typeof (value as any).locality === "string")
        return (value as any).locality;
      if (
        typeof (value as any).constituency_id === "string" &&
        typeof (value as any).name === "string"
      )
        return (value as any).name;
      if (typeof (value as any)._id === "string") return (value as any)._id;
      try {
        return JSON.stringify(value);
      } catch {
        return "—";
      }
    }
    return String(value);
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
                  className="group cursor-pointer"
                  onClick={() => handleIssueClick(issue)}
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
                              {displayText(issue.locality) ||
                                "Location not specified"}
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

      {/* Issue Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Issue Details
              </span>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          {selectedIssue && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {selectedIssue.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Posted {formatDate(selectedIssue.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {displayText(selectedIssue.locality) ||
                            "Location not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(selectedIssue.status)}
                    {selectedIssue.priority_level && (
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedIssue.priority_level === "high"
                            ? "bg-red-100 text-red-700"
                            : selectedIssue.priority_level === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {selectedIssue.priority_level.toUpperCase()} PRIORITY
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                  Description
                </h3>
                <p className="text-slate-700 leading-relaxed text-base">
                  {selectedIssue.detail}
                </p>
              </div>

              {/* User Information Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-600" />
                  Posted By
                </h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {selectedIssue.is_anonymous
                        ? "Anonymous User"
                        : "Community Member"}
                    </div>
                    <div className="text-sm text-slate-600">
                      {selectedIssue.is_anonymous
                        ? "Privacy Protected"
                        : "Verified Citizen"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Community Engagement
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <ThumbsUp className="h-6 w-6 text-emerald-600" />
                      <div>
                        <div className="text-2xl font-bold text-emerald-700">
                          {selectedIssue.upvotes || 0}
                        </div>
                        <div className="text-sm text-emerald-600">Upvotes</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <Eye className="h-6 w-6 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold text-blue-700">
                          {Math.floor(Math.random() * 100) + 50}
                        </div>
                        <div className="text-sm text-blue-600">Views</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-6 w-6 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold text-purple-700">
                          {Math.floor(Math.random() * 20) + 5}
                        </div>
                        <div className="text-sm text-purple-600">Comments</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Issue Details Section */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-slate-600" />
                  Issue Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        Issue ID
                      </label>
                      <div className="text-slate-800 font-mono">
                        #{selectedIssue._id?.slice(-8) || "N/A"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        Ward Number
                      </label>
                      <div className="text-slate-800">
                        {selectedIssue.ward_no || "Not specified"}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        Constituency
                      </label>
                      <div className="text-slate-800">
                        {displayText(selectedIssue.constituency_id) ||
                          "Not specified"}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        Created
                      </label>
                      <div className="text-slate-800">
                        {formatDate(selectedIssue.created_at)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600">
                        Last Updated
                      </label>
                      <div className="text-slate-800">
                        {formatDate(selectedIssue.updated_at)}
                      </div>
                    </div>
                    {selectedIssue.completed_at && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">
                          Completed
                        </label>
                        <div className="text-slate-800">
                          {formatDate(selectedIssue.completed_at)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Attachments Section */}
              {selectedIssue.attachments && (
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-slate-600" />
                    Attachments
                  </h3>
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-8 rounded-lg border-2 border-dashed border-slate-300 text-center">
                    <div className="text-4xl mb-3">📷</div>
                    <div className="text-slate-600 font-medium">
                      Image Attachment Available
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      Click to view full image
                    </div>
                  </div>
                </div>
              )}

              {/* Feedback Section */}
              {selectedIssue.feedback && (
                <div className="bg-white p-6 rounded-xl border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Star className="h-5 w-5 text-slate-600" />
                    User Feedback
                  </h3>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <p className="text-slate-700 mb-3">
                      {selectedIssue.feedback}
                    </p>
                    {selectedIssue.satisfaction_score && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">
                          Satisfaction:
                        </span>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            selectedIssue.satisfaction_score === "excellent"
                              ? "bg-green-100 text-green-700"
                              : selectedIssue.satisfaction_score === "very good"
                                ? "bg-blue-100 text-blue-700"
                                : selectedIssue.satisfaction_score === "good"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : selectedIssue.satisfaction_score === "fair"
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700"
                          }`}
                        >
                          {selectedIssue.satisfaction_score.toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
