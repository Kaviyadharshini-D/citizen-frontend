import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Clock, Users, FileText } from "lucide-react";
import { toast } from "sonner";

const scheduleReviewSchema = z.object({
  meetingName: z.string().min(1, "Meeting name is required"),
  departments: z
    .array(z.string())
    .min(1, "At least one department must be selected"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  description: z.string().optional(),
});

type ScheduleReviewFormData = z.infer<typeof scheduleReviewSchema>;

interface ScheduleReviewFormProps {
  trigger?: React.ReactNode;
  onSchedule?: (data: ScheduleReviewFormData) => void;
}

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

export const ScheduleReviewForm: React.FC<ScheduleReviewFormProps> = ({
  trigger,
  onSchedule,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const form = useForm<ScheduleReviewFormData>({
    resolver: zodResolver(scheduleReviewSchema),
    defaultValues: {
      meetingName: "",
      departments: [],
      date: "",
      time: "",
      description: "",
    },
  });

  const onSubmit = (data: ScheduleReviewFormData) => {
    try {
      // Here you would typically send the data to your API
      console.log("Scheduling review with data:", data);

      if (onSchedule) {
        onSchedule(data);
      }

      toast.success("Review meeting scheduled successfully!");
      setOpen(false);
      form.reset();
      setSelectedDepartments([]);
    } catch (error) {
      toast.error("Failed to schedule review meeting");
      console.error("Error scheduling review:", error);
    }
  };

  const handleDepartmentToggle = (dept: string) => {
    const updated = selectedDepartments.includes(dept)
      ? selectedDepartments.filter((d) => d !== dept)
      : [...selectedDepartments, dept];

    setSelectedDepartments(updated);
    form.setValue("departments", updated);
  };

  const defaultTrigger = (
    <Button variant="outline" className="flex items-center gap-2">
      <Calendar className="h-4 w-4" />
      Schedule Review
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Schedule Review Meeting
          </DialogTitle>
          <DialogDescription>
            Schedule a review meeting with selected departments to discuss
            performance metrics and action items.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input
                        placeholder="e.g., Monthly Performance Review"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Departments */}
              <FormField
                control={form.control}
                name="departments"
                render={() => (
                  <FormItem className="md:col-span-2">
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
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <textarea
                        className="w-full min-h-[80px] p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Add any additional notes or agenda items for the meeting..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Schedule Meeting
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleReviewForm;
