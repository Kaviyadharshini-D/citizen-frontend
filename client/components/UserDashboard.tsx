import React, { useState } from "react";
import { useCreateIssue, useConstituencyIssues } from "../hooks/useApi";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Upload,
  X,
  MapPin,
  Calendar,
  ThumbsUp,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  Filter,
  Send,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

interface FormData {
  title: string;
  description: string;
  location: string;
}

export default function UserDashboard() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitAnonymously, setSubmitAnonymously] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "latest" | "upvotes" | "category"
  >("latest");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Get user's constituency name for display
  const getUserConstituency = () => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const apiUser = JSON.parse(userData);
        return apiUser.constituency_name || "Your Constituency";
      } catch (error) {
        console.error("Error parsing user data:", error);
        return "Your Constituency";
      }
    }
    return "Your Constituency";
  };

  const userConstituency = getUserConstituency();

  // Get constituency ID for API call
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

  // Create issue mutation
  const createIssueMutation = useCreateIssue();

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

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") ||
        file.type === "application/pdf" ||
        file.size <= 5 * 1024 * 1024, // 5MB limit
    );

    if (validFiles.length !== files.length) {
      toast.error("Please select only images or PDFs under 5MB");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a title for your issue");
      return false;
    }
    if (formData.title.length < 5) {
      toast.error("Title must be at least 5 characters long");
      return false;
    }
    if (formData.title.length > 200) {
      toast.error("Title must be less than 200 characters");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Please describe your issue");
      return false;
    }
    if (formData.description.length < 10) {
      toast.error("Description must be at least 10 characters long");
      return false;
    }
    if (formData.description.length > 2000) {
      toast.error("Description must be less than 2000 characters");
      return false;
    }
    if (!formData.location.trim()) {
      toast.error("Please specify the location");
      return false;
    }
    if (formData.location.length < 3) {
      toast.error("Location must be at least 3 characters long");
      return false;
    }
    if (formData.location.length > 200) {
      toast.error("Location must be less than 200 characters");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for file upload with correct field names matching backend schema
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("detail", formData.description); // Backend expects 'detail'
      formDataToSend.append("locality", formData.location); // Backend expects 'locality'
      formDataToSend.append("is_anonymous", submitAnonymously.toString()); // Backend expects 'is_anonymous'

      // Add files as attachments (optional)
      selectedFiles.forEach((file, index) => {
        formDataToSend.append(`attachments`, file); // Backend expects 'attachments'
      });

      await createIssueMutation.mutateAsync(formDataToSend);

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
      });
      setSelectedFiles([]);
      setSubmitAnonymously(false);

      toast.success(
        "Issue submitted successfully! Your issue has been submitted and is under review.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: "latest" | "upvotes" | "category") => {
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
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      <div className="h-full max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-6 flex-shrink-0"
        >
          <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
            Community Dashboard
          </h1>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 min-h-0">
          {/* Issue Submission Form - Fixed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:w-1/2 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col min-h-0"
          >
            {/* Header - Fixed */}
            <div className="p-6 lg:p-8 flex-shrink-0 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
                    Report an Issue
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Help improve your community
                  </p>
                </div>
              </div>
            </div>

            {/* Form Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Issue Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Brief description of the issue..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    maxLength={200}
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {formData.title.length}/200 characters
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide detailed information about the issue..."
                    rows={3}
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-sm"
                    maxLength={2000}
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {formData.description.length}/2000 characters
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Specific location or address..."
                    className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-slate-300 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    maxLength={200}
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Attachments (Optional)
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 lg:p-6 text-center hover:border-blue-400 transition-colors duration-200">
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-6 h-6 lg:w-8 lg:h-8 text-slate-400" />
                        <span className="text-slate-600 font-medium text-sm">
                          Click to upload files
                        </span>
                        <span className="text-xs text-slate-500">
                          Images or PDFs, max 5MB each
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* Selected Files */}
                  {selectedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-50 rounded-lg p-2 lg:p-3"
                        >
                          <div className="flex items-center gap-2">
                            {file.type.startsWith("image/") ? (
                              <ImageIcon className="w-4 h-4 text-blue-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-blue-500" />
                            )}
                            <span className="text-sm font-medium text-slate-700 truncate">
                              {file.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anonymous Submission */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={submitAnonymously}
                    onChange={(e) => setSubmitAnonymously(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="anonymous" className="text-sm text-slate-700">
                    Submit anonymously
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 lg:py-3 px-4 lg:px-6 rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Issue
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Issue Feed - Scrollable */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="lg:w-1/2 bg-white rounded-2xl shadow-lg border border-slate-200 flex flex-col min-h-0"
          >
            {/* Header - Fixed */}
            <div className="p-6 lg:p-8 flex-shrink-0 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-bold text-slate-800">
                    Community Issues
                  </h2>
                  <p className="text-slate-600 text-sm">
                    {filteredIssues.length} issue
                    {filteredIssues.length !== 1 ? "s" : ""} in{" "}
                    {userConstituency}
                  </p>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 lg:gap-3">
                <motion.button
                  variants={filterButtonVariants}
                  whileHover="active"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange("latest")}
                  className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeFilter === "latest"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Clock className="w-3 h-3 lg:w-4 lg:h-4" />
                  Latest
                </motion.button>
                <motion.button
                  variants={filterButtonVariants}
                  whileHover="active"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange("upvotes")}
                  className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeFilter === "upvotes"
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4" />
                  Most Popular
                </motion.button>
                <motion.button
                  variants={filterButtonVariants}
                  whileHover="active"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFilterChange("category")}
                  className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeFilter === "category"
                      ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <Filter className="w-3 h-3 lg:w-4 lg:h-4" />
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
                    className="overflow-hidden mt-4"
                  >
                    <select
                      value={selectedCategory}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 lg:px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
            </div>

            {/* Issues List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 pt-4 lg:pt-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3 lg:space-y-4"
              >
                {issuesLoading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="inline-flex items-center gap-3 text-slate-600">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-medium text-sm">
                        Loading issues...
                      </span>
                    </div>
                  </motion.div>
                ) : filteredIssues.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="text-slate-500">
                      <div className="text-4xl mb-2">📭</div>
                      <h3 className="font-semibold mb-1 text-sm">
                        {activeFilter === "category" && selectedCategory
                          ? `No issues found for "${selectedCategory}"`
                          : "No issues found"}
                      </h3>
                      <p className="text-xs text-slate-400">
                        {activeFilter === "category" && selectedCategory
                          ? "Try selecting a different category"
                          : "Be the first to report an issue!"}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  filteredIssues.map((issue, index) => (
                    <motion.div
                      key={issue._id || index}
                      variants={itemVariants}
                      whileHover={{ y: -2, transition: { duration: 0.2 } }}
                      className="bg-slate-50 rounded-xl p-3 lg:p-4 hover:bg-slate-100 transition-all duration-200 border border-slate-200"
                    >
                      <div className="space-y-2 lg:space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(issue.status)}
                            <div className="flex items-center gap-1 text-slate-500">
                              <Calendar className="w-3 h-3" />
                              <span className="text-xs font-medium">
                                {formatDate(issue.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600">
                            <ThumbsUp className="w-3 h-3" />
                            <span className="text-xs font-semibold">
                              {issue.upvotes || 0}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 leading-tight text-sm lg:text-base">
                          {issue.title}
                        </h3>

                        <p className="text-xs lg:text-sm text-slate-600 line-clamp-2">
                          {issue.detail}
                        </p>

                        <div className="flex items-center gap-2 text-slate-500">
                          <MapPin className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {issue.locality || "Location not specified"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
