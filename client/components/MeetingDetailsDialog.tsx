import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";

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

interface MeetingDetailsDialogProps {
  review: ScheduledReview | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (review: ScheduledReview) => void;
  onDelete?: (reviewId: string) => void;
  onComplete?: (reviewId: string) => void;
}

const editMeetingSchema = z.object({
  meetingName: z.string().min(1, "Meeting name is required"),
  departments: z
    .array(z.string())
    .min(1, "At least one department must be selected"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  description: z.string().optional(),
});

type EditMeetingFormData = z.infer<typeof editMeetingSchema>;

const departments = [
  "Roads & Transport",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Education",
  "Healthcare",
  "Public Works",
  "Urban Development",
  "Revenue",
  "Police",
];

export const MeetingDetailsDialog: React.FC<MeetingDetailsDialogProps> = ({
  review,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onComplete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const form = useForm<EditMeetingFormData>({
    resolver: zodResolver(editMeetingSchema),
    defaultValues: {
      meetingName: "",
      departments: [],
      date: "",
      time: "",
      description: "",
    },
  });

  // Update form when review changes
  useEffect(() => {
    if (review) {
      form.reset({
        meetingName: review.meetingName,
        departments: review.departments,
        date: review.date,
        time: review.time,
        description: review.description || "",
      });
      setSelectedDepartments(review.departments);
    }
  }, [review, form]);

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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (review) {
      form.reset({
        meetingName: review.meetingName,
        departments: review.departments,
        date: review.date,
        time: review.time,
        description: review.description || "",
      });
      setSelectedDepartments(review.departments);
    }
  };

  const handleSaveEdit = (data: EditMeetingFormData) => {
    if (!review) return;

    const updatedReview: ScheduledReview = {
      ...review,
      meetingName: data.meetingName,
      departments: data.departments,
      date: data.date,
      time: data.time,
      description: data.description,
      updatedAt: new Date().toISOString(),
    };

    if (onEdit) {
      onEdit(updatedReview);
    }

    toast.success("Meeting details updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (!review) return;

    if (window.confirm("Are you sure you want to delete this meeting?")) {
      if (onDelete) {
        onDelete(review.id);
      }
      onClose();
    }
  };

  const handleComplete = () => {
    if (!review) return;

    if (onComplete) {
      onComplete(review.id);
    }
    onClose();
  };

  const handleDepartmentToggle = (dept: string) => {
    const updated = selectedDepartments.includes(dept)
      ? selectedDepartments.filter((d) => d !== dept)
      : [...selectedDepartments, dept];

    setSelectedDepartments(updated);
    form.setValue("departments", updated);
  };

  if (!review) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {isEditing ? "Edit Meeting" : "Meeting Details"}
                </DialogTitle>
                <DialogDescription>
                  {isEditing
                    ? "Update the meeting information below"
                    : "Review all details of this scheduled meeting"}
                </DialogDescription>
              </div>
            </div>
            <Badge className={getStatusColor(review.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(review.status)}
                {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
              </span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {isEditing ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSaveEdit)}
                className="space-y-4"
              >
                {/* Meeting Name */}
                <FormField
                  control={form.control}
                  name="meetingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Meeting Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter meeting name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Time
                        </FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Departments */}
                <FormField
                  control={form.control}
                  name="departments"
                  render={() => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Departments
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-lg">
                          {departments.map((dept) => (
                            <motion.div
                              key={dept}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                type="button"
                                variant={
                                  selectedDepartments.includes(dept)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                className="w-full justify-start text-xs"
                                onClick={() => handleDepartmentToggle(dept)}
                              >
                                {dept}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <textarea
                          className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add meeting description or agenda..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          ) : (
            <div className="space-y-6">
              {/* Meeting Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Meeting Name</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {review.meetingName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Date</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {formatTime(review.time)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-1">
                      <Users className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-500 mb-2">
                        Departments ({review.departments.length})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {review.departments.map((dept) => (
                          <Badge
                            key={dept}
                            variant="secondary"
                            className="text-xs"
                          >
                            {dept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {review.description && (
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                        <FileText className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">
                          Description
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                          {review.description}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDateTime(review.createdAt)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDateTime(review.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleDelete}
                >
                  <X className="h-3 w-3 mr-1" />
                  Delete
                </Button>
                {review.status === "scheduled" && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleComplete}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Mark Complete
                  </Button>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </Button>
                <Button
                  onClick={form.handleSubmit(handleSaveEdit)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                {review.status === "scheduled" && (
                  <Button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MeetingDetailsDialog;
