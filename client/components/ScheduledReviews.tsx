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
  const [scheduledReviews, setScheduledReviews] =
    useState<ScheduledReview[]>(reviews);
  const [selectedReview, setSelectedReview] = useState<ScheduledReview | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    if (reviews.length === 0) {
      const mockReviews: ScheduledReview[] = [
        {
          id: "1",
          meetingName: "Monthly Performance Review",
          departments: ["Roads & Transport", "Water Supply", "Electricity"],
          date: "2024-01-15",
          time: "10:00",
          description:
            "Review monthly performance metrics and discuss upcoming projects.",
          status: "scheduled",
          createdAt: "2024-01-10T09:00:00Z",
          updatedAt: "2024-01-10T09:00:00Z",
        },
        {
          id: "2",
          meetingName: "Quarterly Budget Review",
          departments: [
            "Sanitation",
            "Education",
            "Healthcare",
            "Public Works",
          ],
          date: "2024-01-20",
          time: "14:00",
          description:
            "Quarterly budget allocation review and expenditure analysis.",
          status: "scheduled",
          createdAt: "2024-01-12T11:00:00Z",
          updatedAt: "2024-01-12T11:00:00Z",
        },
        {
          id: "3",
          meetingName: "Emergency Response Meeting",
          departments: ["Police", "Urban Development", "Revenue"],
          date: "2024-01-08",
          time: "09:30",
          description:
            "Emergency response coordination and disaster preparedness review.",
          status: "completed",
          createdAt: "2024-01-05T08:00:00Z",
          updatedAt: "2024-01-08T12:00:00Z",
        },
      ];
      setScheduledReviews(mockReviews);
    }
  }, [reviews]);

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

  const handleView = (review: ScheduledReview) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleEdit = (review: ScheduledReview) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };

  const handleEditSubmit = (updatedReview: ScheduledReview) => {
    if (onEdit) {
      onEdit(updatedReview);
    } else {
      setScheduledReviews((prev) =>
        prev.map((r) => (r.id === updatedReview.id ? updatedReview : r)),
      );
      toast.success("Meeting details updated successfully");
    }
  };

  const handleDelete = (reviewId: string) => {
    if (onDelete) {
      onDelete(reviewId);
    } else {
      setScheduledReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success("Review meeting deleted successfully");
    }
    setIsDialogOpen(false);
    setSelectedReview(null);
  };

  const handleComplete = (reviewId: string) => {
    if (onComplete) {
      onComplete(reviewId);
    } else {
      setScheduledReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, status: "completed" as const } : r,
        ),
      );
      toast.success("Review meeting marked as completed");
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
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
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
            key={review.id}
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
                        onClick={() => handleComplete(review.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(review.id)}
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
      <MeetingDetailsDialog
        review={selectedReview}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onEdit={handleEditSubmit}
        onDelete={handleDelete}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default ScheduledReviews;
