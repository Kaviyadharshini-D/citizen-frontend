import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import MeetingDetailsDialog from "./MeetingDetailsDialog";
import {
  useMeetings,
  useUpdateMeeting,
  useDeleteMeeting,
} from "../hooks/useApi";
import { useUser } from "../context/UserContext";
import { Meeting } from "../types/api";
import { convertTo24Hour, convertTo12Hour } from "../lib/timeUtils";

interface ScheduledReview {
  id: string;
  meetingName: string;
  departments: string[];
  date: string;
  time: string;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

interface ScheduledReviewsProps {
  reviews?: ScheduledReview[];
  onEdit?: (review: ScheduledReview) => void;
  onDelete?: (reviewId: string) => void;
  onComplete?: (reviewId: string) => void;
}

export const ScheduledReviews: React.FC<ScheduledReviewsProps> = ({
  reviews = [],
  onEdit,
  onDelete,
  onComplete,
}) => {
  const { user } = useUser();
  const constituencyId = user?.constituency_id || "";

  // API hooks
  const { data: meetingsData, isLoading, error } = useMeetings(constituencyId);
  const updateMeetingMutation = useUpdateMeeting();
  const deleteMeetingMutation = useDeleteMeeting();

  const [selectedReview, setSelectedReview] = useState<Meeting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Transform API data to component format
  const scheduledReviews: Meeting[] = meetingsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Calendar className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const handleView = (review: Meeting) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleEdit = (review: Meeting) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleEditSubmit = (updatedReview: Meeting) => {
    if (onEdit) {
      onEdit(updatedReview as any);
    } else {
      // Convert time to 24-hour format before sending to API
      const time24Hour = convertTo24Hour(updatedReview.time);

      updateMeetingMutation.mutate({
        constituencyId,
        meetingId: updatedReview._id,
        data: {
          meetingName: updatedReview.meetingName,
          departments: updatedReview.departments,
          date: updatedReview.date,
          time: time24Hour,
          description: updatedReview.description,
        },
      });
    }
  };

  const handleDelete = (reviewId: string) => {
    if (onDelete) {
      onDelete(reviewId);
    } else {
      deleteMeetingMutation.mutate({
        constituencyId,
        meetingId: reviewId,
      });
    }
    setIsDialogOpen(false);
    setSelectedReview(null);
  };

  const handleComplete = (reviewId: string) => {
    if (onComplete) {
      onComplete(reviewId);
    } else {
      updateMeetingMutation.mutate({
        constituencyId,
        meetingId: reviewId,
        data: { status: "completed" },
      });
    }
    setIsDialogOpen(false);
    setSelectedReview(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedReview(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return convertTo12Hour(timeString);
  };

  const isUpcoming = (dateString: string) => {
    const reviewDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reviewDate >= today;
  };

  // Sort reviews: upcoming first, then by date
  const sortedReviews = [...scheduledReviews].sort((a, b) => {
    if (a.status !== b.status) {
      const statusOrder = { scheduled: 0, completed: 1, cancelled: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-medium">Loading meetings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertCircle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Failed to load meetings
          </h3>
          <p className="text-slate-600">
            {error instanceof Error ? error.message : "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Scheduled Reviews
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and track your scheduled review meetings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {
              scheduledReviews.filter((r) => r.status === "scheduled").length
            }{" "}
            Scheduled
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            {
              scheduledReviews.filter((r) => r.status === "completed").length
            }{" "}
            Completed
          </Badge>
        </div>
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {review.meetingName}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {review.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(review.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(review.status)}
                      {review.status.charAt(0).toUpperCase() +
                        review.status.slice(1)}
                    </span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Date and Time */}
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span
                      className={
                        isUpcoming(review.date)
                          ? "font-medium text-blue-600"
                          : ""
                      }
                    >
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(review.time)}</span>
                  </div>
                </div>

                {/* Departments */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Departments ({review.departments.length})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {review.departments.slice(0, 3).map((dept) => (
                      <Badge key={dept} variant="secondary" className="text-xs">
                        {dept}
                      </Badge>
                    ))}
                    {review.departments.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{review.departments.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(review)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    {review.status === "scheduled" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(review)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {review.status === "scheduled" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleComplete(review._id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(review._id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {scheduledReviews.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No scheduled reviews
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Schedule your first review meeting to get started.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Review
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Meeting Details Dialog */}
      {selectedReview && (
        <MeetingDetailsDialog
          review={selectedReview as any}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onEdit={handleEditSubmit as any}
          onDelete={handleDelete}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default ScheduledReviews;
