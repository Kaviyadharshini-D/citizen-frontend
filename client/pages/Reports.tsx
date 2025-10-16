import React, { useState } from "react";
import { Layout } from "../components/Layout";
import {
  useUserIssues,
  useUpdateIssueStatus,
  useAddFeedback,
} from "../hooks/useApi";
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
  Star,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

interface Issue {
  _id: string;
  title: string;
  detail: string;
  locality: string;
  status: string;
  priority?: string;
  category?: string;
  created_at: string;
  updated_at: string;
  handled_by?: string | { name: string; id: string };
  feedback?: string;
  images?: string[];
}

export default function Reports() {
  const { user } = useUser();
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number>(0);
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());

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
  const { data: issuesData, isLoading, error, refetch } = useUserIssues(userId);
  console.log(issuesData);
  // Mutations
  const updateStatusMutation = useUpdateIssueStatus();
  const addFeedbackMutation = useAddFeedback();

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold transition-all duration-150";

    let bgColor = "bg-slate-100";
    let textColor = "text-slate-700";
    let borderColor = "border-slate-200";

    switch (status.toLowerCase()) {
      case "completed":
        bgColor = "bg-green-50";
        textColor = "text-green-700";
        borderColor = "border-green-200";
        break;
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

  const getPriorityBadge = (priority: string) => {
    const baseClasses =
      "inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold";

    let bgColor = "bg-slate-100";
    let textColor = "text-slate-700";

    switch (priority?.toLowerCase()) {
      case "high":
        bgColor = "bg-red-100";
        textColor = "text-red-700";
        break;
      case "medium":
        bgColor = "bg-amber-100";
        textColor = "text-amber-700";
        break;
      case "low":
        bgColor = "bg-sky-100";
        textColor = "text-sky-700";
        break;
      default:
        bgColor = "bg-slate-100";
        textColor = "text-slate-700";
    }

    return (
      <div className={`${baseClasses} ${bgColor} ${textColor}`}>
        {priority?.toUpperCase() || "N/A"}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleExpanded = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const handleCompleteIssue = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsFeedbackOpen(true);
    setFeedbackText("");
    setFeedbackRating(0);
  };

  const handleSubmitFeedback = () => {
    if (!selectedIssue || !feedbackText.trim()) {
      toast.error("Please provide feedback before completing the issue");
      return;
    }

    // First add feedback
    addFeedbackMutation.mutate(
      {
        id: selectedIssue._id,
        feedback: feedbackText,
        satisfactionScore: feedbackRating,
      },
      {
        onSuccess: () => {
          // Then update status to completed
          updateStatusMutation.mutate(
            {
              id: selectedIssue._id,
              status: "completed",
            },
            {
              onSuccess: () => {
                setIsFeedbackOpen(false);
                setSelectedIssue(null);
                setFeedbackText("");
                setFeedbackRating(0);
                refetch();
                toast.success("Issue completed successfully!");
              },
            },
          );
        },
      },
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
                <Button onClick={() => refetch()} className="mt-4">
                  Try Again
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Get issues from API response
  console.log(issuesData);
  console.log(issuesData?.issues);
  const issues = issuesData?.issues || [];
  const safeIssues = Array.isArray(issues) ? issues : [];

  // Calculate stats
  const totalIssues = safeIssues.length;
  const resolvedIssues = safeIssues.filter(
    (issue) => issue.status === "resolved",
  ).length;
  const completedIssues = safeIssues.filter(
    (issue) => issue.status === "completed",
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
            <p className="text-lg text-slate-600">
              Track and manage your community issues
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">
                  {totalIssues}
                </div>
                <div className="text-slate-600 font-medium">Total Reports</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-emerald-600 mb-2">
                  {resolvedIssues}
                </div>
                <div className="text-slate-600 font-medium">Resolved</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {completedIssues}
                </div>
                <div className="text-slate-600 font-medium">Completed</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {activeIssues}
                </div>
                <div className="text-slate-600 font-medium">Active</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="space-y-4"
          >
            {safeIssues.length === 0 ? (
              <Card>
                <CardContent className="p-16 text-center">
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
                </CardContent>
              </Card>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {safeIssues.map((issue, index) => (
                  <motion.div
                    key={issue._id || index}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-10 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
                                <span className="text-sm font-bold text-slate-600">
                                  {`Q-${issue._id?.slice(-3).toUpperCase() || "N/A"}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(issue.status)}
                                {issue.priority &&
                                  getPriorityBadge(issue.priority)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleExpanded(issue._id)}
                                className="text-slate-500 hover:text-slate-700"
                              >
                                {expandedIssues.has(issue._id) ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                              {issue.status === "resolved" && (
                                <Button
                                  onClick={() => handleCompleteIssue(issue)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Title and Description */}
                          <div>
                            <h3 className="font-semibold text-slate-800 mb-2 text-lg">
                              {issue.title}
                            </h3>
                            <p className="text-slate-600 line-clamp-2">
                              {issue.detail}
                            </p>
                          </div>

                          {/* Meta Information */}
                          <div className="flex items-center gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{issue.locality || "N/A"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Reported {formatDateShort(issue.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                Updated {formatDateShort(issue.updatedAt)}
                              </span>
                            </div>
                            {issue.handled_by && (
                              <div className="flex items-center gap-1">
                                <Activity className="w-4 h-4" />
                                <span>
                                  Assigned to{" "}
                                  {typeof issue.handled_by === "string"
                                    ? issue.handled_by
                                    : issue.handled_by.name || "N/A"}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedIssues.has(issue._id) && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4 pt-4 border-t border-slate-200"
                              >
                                {/* Full Description */}
                                <div>
                                  <h4 className="font-semibold text-slate-800 mb-2">
                                    Full Description
                                  </h4>
                                  <p className="text-slate-600 whitespace-pre-wrap">
                                    {issue.detail}
                                  </p>
                                </div>

                                {/* Category */}
                                {issue.category && (
                                  <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">
                                      Category
                                    </h4>
                                    <Badge variant="outline">
                                      {issue.category}
                                    </Badge>
                                  </div>
                                )}

                                {/* Images */}
                                {issue.images && issue.images.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">
                                      Attached Images
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                      {issue.images.map((image, imgIndex) => (
                                        <img
                                          key={imgIndex}
                                          src={image}
                                          alt={`Issue image ${imgIndex + 1}`}
                                          className="w-full h-24 object-cover rounded-lg border border-slate-200"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Feedback */}
                                {issue.feedback && (
                                  <div>
                                    <h4 className="font-semibold text-slate-800 mb-2">
                                      Your Feedback
                                    </h4>
                                    <div className="bg-slate-50 p-3 rounded-lg">
                                      <p className="text-slate-600 whitespace-pre-wrap">
                                        {issue.feedback}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Timestamps */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-slate-700">
                                      Created:
                                    </span>{" "}
                                    <span className="text-slate-600">
                                      {formatDate(issue.created_at)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="font-medium text-slate-700">
                                      Last Updated:
                                    </span>{" "}
                                    <span className="text-slate-600">
                                      {formatDate(issue.updatedAt)}
                                    </span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Complete Issue & Provide Feedback
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Issue Summary */}
            {selectedIssue && (
              <div className="bg-slate-50 p-4 rounded-lg">
                <h3 className="font-semibold text-slate-800 mb-2">
                  {selectedIssue.title}
                </h3>
                <p className="text-slate-600 text-sm">{selectedIssue.detail}</p>
                <div className="mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-500">
                    {selectedIssue.locality}
                  </span>
                </div>
              </div>
            )}

            {/* Feedback Form */}
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Feedback *
                  </label>
                  <Textarea
                    placeholder="Please share your experience with the resolution of this issue. Was it resolved satisfactorily? Any additional comments?"
                    value={feedbackText}
                    onChange={(e) => {
                      console.log(
                        "Textarea onChange triggered:",
                        e.target.value,
                      );
                      setFeedbackText(e.target.value);
                    }}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Your feedback helps improve our services
                  </p>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Rate the Resolution
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setFeedbackRating(rating)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          rating <= feedbackRating
                            ? "bg-yellow-400 text-white"
                            : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                    <span className="text-sm text-slate-600 ml-2">
                      {feedbackRating > 0 &&
                        (feedbackRating === 1
                          ? "Poor"
                          : feedbackRating === 2
                            ? "Fair"
                            : feedbackRating === 3
                              ? "Good"
                              : feedbackRating === 4
                                ? "Very Good"
                                : "Excellent")}
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsFeedbackOpen(false);
                setSelectedIssue(null);
                setFeedbackText("");
                setFeedbackRating(0);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFeedback}
              disabled={
                !feedbackText.trim() ||
                addFeedbackMutation.isPending ||
                updateStatusMutation.isPending
              }
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {addFeedbackMutation.isPending ||
              updateStatusMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Issue
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
