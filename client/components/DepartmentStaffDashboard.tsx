import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Target,
  Calendar,
  Star,
  Activity,
  Zap,
  Building,
  Zap as ElectricityIcon,
  Settings,
} from "lucide-react";
import {
  useDepartmentIssues,
  useAssignIssue,
  useDepartmentEmployees,
  useUpdateIssueStatus,
} from "../hooks/useApi";
import { useUser } from "../context/UserContext";
import { Issue, Employee } from "../types/api";

// Mock data for staff metrics
const mockStaffData = {
  totalIssues: 45,
  resolvedIssues: 38,
  pendingIssues: 7,
  avgResponseTime: 1.2,
  userSatisfaction: 4.7,
  efficiency: 92,
  assignedIssues: 12,
  inProgressIssues: 3,
};

// Mock data for department analytics (same as DepartmentAnalytics)
const mockIssuesData = [
  {
    month: "Jan",
    total: 42,
    resolved: 38,
    pending: 4,
    critical: 2,
    avgResolution: 1.6,
    satisfaction: 4.4,
    powerOutages: 3,
  },
  {
    month: "Feb",
    total: 38,
    resolved: 35,
    pending: 3,
    critical: 1,
    avgResolution: 1.4,
    satisfaction: 4.5,
    powerOutages: 2,
  },
  {
    month: "Mar",
    total: 45,
    resolved: 41,
    pending: 4,
    critical: 3,
    avgResolution: 1.8,
    satisfaction: 4.3,
    powerOutages: 4,
  },
  {
    month: "Apr",
    total: 52,
    resolved: 47,
    pending: 5,
    critical: 2,
    avgResolution: 1.7,
    satisfaction: 4.6,
    powerOutages: 3,
  },
  {
    month: "May",
    total: 48,
    resolved: 44,
    pending: 4,
    critical: 1,
    avgResolution: 1.5,
    satisfaction: 4.7,
    powerOutages: 2,
  },
  {
    month: "Jun",
    total: 41,
    resolved: 38,
    pending: 3,
    critical: 2,
    avgResolution: 1.6,
    satisfaction: 4.5,
    powerOutages: 3,
  },
];

const mockCategoryData = [
  {
    name: "Power Outages",
    value: 35,
    color: "#ff6b6b",
    priority: "High",
    avgResolution: 1.2,
  },
  {
    name: "Line Maintenance",
    value: 28,
    color: "#4ecdc4",
    priority: "Medium",
    avgResolution: 1.8,
  },
  {
    name: "Transformer Issues",
    value: 22,
    color: "#45b7d1",
    priority: "High",
    avgResolution: 2.1,
  },
  {
    name: "Meter Problems",
    value: 12,
    color: "#96ceb4",
    priority: "Low",
    avgResolution: 1.5,
  },
  {
    name: "Connection Issues",
    value: 3,
    color: "#feca57",
    priority: "Medium",
    avgResolution: 2.5,
  },
];

const mockPerformanceMetrics = [
  {
    metric: "Response Time",
    current: 1.8,
    target: 1.5,
    unit: "days",
    status: "warning",
  },
  {
    metric: "Resolution Rate",
    current: 85,
    target: 90,
    unit: "%",
    status: "warning",
  },
  {
    metric: "User Satisfaction",
    current: 4.6,
    target: 4.8,
    unit: "stars",
    status: "good",
  },
  {
    metric: "Efficiency Score",
    current: 89,
    target: 90,
    unit: "%",
    status: "good",
  },
];

const mockAssignedIssues = [
  {
    id: "Q-001",
    title: "Power outage in Anna Nagar",
    priority: "High",
    status: "In Progress",
    assignedDate: "2 days ago",
    location: "Anna Nagar, Chennai",
    description: "Complete power outage affecting 50+ households",
  },
  {
    id: "Q-002",
    title: "Transformer maintenance required",
    priority: "Medium",
    status: "Pending",
    assignedDate: "1 day ago",
    location: "T Nagar, Chennai",
    description: "Transformer needs routine maintenance",
  },
  {
    id: "Q-003",
    title: "Line fault in Adyar",
    priority: "High",
    status: "Resolved",
    assignedDate: "3 days ago",
    location: "Adyar, Chennai",
    description: "Power line fault causing intermittent outages",
  },
];

export const DepartmentStaffDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedArea, setSelectedArea] = useState("all");
  const [editOpen, setEditOpen] = useState(false);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { user } = useUser();
  const departmentId = user?.department_id || "default";

  // Fetch department issues using React Query
  const {
    data: issuesData,
    isLoading: issuesLoading,
    error: issuesError,
    refetch: refetchIssues,
  } = useDepartmentIssues(departmentId);

  // Status update mutation
  const updateStatusMutation = useUpdateIssueStatus();

  // Transform API issues to component format
  const realIssues = React.useMemo(() => {
    if (!issuesData?.issues) return [];
    return issuesData.issues.map((issue: Issue) => {
      // Format ID as Q-XXX (last 3 digits in caps)
      const issueId = issue._id || (issue as any).id;
      const lastThreeDigits = issueId.slice(-3).toUpperCase();
      const formattedId = `Q-${lastThreeDigits}`;

      return {
        id: formattedId,
        originalId: issueId,
        title: issue.title,
        detail: issue.detail,
        locality: issue.locality,
        priority:
          issue.priority_level === "high"
            ? "High"
            : issue.priority_level === "normal"
              ? "Medium"
              : "Low",
        status:
          issue.status === "pending"
            ? "Pending"
            : issue.status === "in_progress"
              ? "In Progress"
              : "Resolved",
        category: "General",
        submitted: issue.created_at
          ? new Date(issue.created_at).toLocaleDateString()
          : "Unknown",
        location: issue.locality,
        handled_by: issue.handled_by,
        originalIssue: issue,
      };
    });
  }, [issuesData]);

  // Filter issues assigned to current staff member
  const assignedIssues = React.useMemo(() => {
    if (!realIssues || !user?.id) return [];
    return realIssues.filter((issue) => {
      // Check if issue is assigned to current user
      const handledBy = issue.handled_by;
      if (typeof handledBy === "string") {
        return handledBy === user.id;
      } else if (handledBy && typeof handledBy === "object") {
        // Check both _id and id properties
        return handledBy._id === user.id || handledBy.id === user.id;
      }
      return false;
    });
  }, [realIssues, user?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColorForIssues = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return "text-green-600";
    if (efficiency >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <motion.div
      className="space-y-6 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Staff Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personal performance metrics and assigned issues
        </p>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <ElectricityIcon className="h-4 w-4" />
              Total Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {mockStaffData.totalIssues}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Assigned: {mockStaffData.assignedIssues}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {mockStaffData.avgResponseTime} days
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Target: 1.5 days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {mockStaffData.userSatisfaction}/5
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              +0.2 from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {mockStaffData.efficiency}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Target: 90%
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assigned">Assigned Issues</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Same as Department Head */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Department Issues Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly issues and resolution trends for your department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockIssuesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="resolved"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Category Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-green-600" />
                    Issue Categories
                  </CardTitle>
                  <CardDescription>
                    Distribution by issue type in your department
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Department Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key performance indicators vs targets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockPerformanceMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {metric.metric}
                        </span>
                        <Badge className={getStatusColor(metric.status)}>
                          {metric.status === "good"
                            ? "On Track"
                            : metric.status === "warning"
                              ? "Needs Attention"
                              : "Critical"}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold">
                        {metric.current}
                        {metric.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Target: {metric.target}
                        {metric.unit}
                      </div>
                      <Progress
                        value={(metric.current / metric.target) * 100}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Issues Table */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Recent Issues
              </h3>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        ID
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Title
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Priority
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Assigned To
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuesLoading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="ml-2 text-gray-600 dark:text-gray-400">
                              Loading issues...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : issuesError ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                              Failed to Load Issues
                            </h3>
                            <p className="text-red-600 dark:text-red-400 mb-4">
                              {issuesError instanceof Error
                                ? issuesError.message
                                : "An error occurred while loading issues."}
                            </p>
                            <Button
                              onClick={() => refetchIssues()}
                              variant="outline"
                            >
                              Try Again
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      realIssues
                        .filter(
                          (q) =>
                            q.status === "Pending" ||
                            q.status === "In Progress",
                        )
                        .sort((a, b) => {
                          // Pending first, then In Progress
                          const order = {
                            Pending: 0,
                            "In Progress": 1,
                            Resolved: 2,
                          } as const;
                          if (order[a.status] !== order[b.status]) {
                            return order[a.status] - order[b.status];
                          }
                          // Within same status, sort by priority High > Medium > Low
                          const pOrder = {
                            High: 0,
                            Medium: 1,
                            Low: 2,
                          } as const;
                          return pOrder[a.priority] - pOrder[b.priority];
                        })
                        .map((q) => (
                          <tr
                            key={q.id}
                            className="border-t border-slate-200 dark:border-slate-700"
                          >
                            <td className="p-6 text-slate-800 dark:text-slate-200">
                              {q.id}
                            </td>
                            <td className="p-6 text-slate-800 dark:text-slate-200">
                              {q.title}
                            </td>
                            <td className="p-6">
                              <Badge
                                className={
                                  q.priority === "High"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                    : q.priority === "Medium"
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                      : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                                }
                              >
                                {q.priority}
                              </Badge>
                            </td>
                            <td className="p-6">
                              <Badge
                                className={
                                  q.status === "Pending"
                                    ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                    : q.status === "In Progress"
                                      ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                }
                              >
                                {q.status}
                              </Badge>
                            </td>
                            <td className="p-6 text-slate-700 dark:text-slate-300">
                              {q.handled_by
                                ? typeof q.handled_by === "string"
                                  ? q.handled_by
                                  : q.handled_by.name || "—"
                                : "—"}
                            </td>
                            <td className="p-6">
                              <span className="text-slate-400">—</span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Assigned Issues Tab */}
          <TabsContent value="assigned" className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Your Assigned Issues
              </h3>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-700">
                    <tr>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        ID
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Title
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Priority
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Status
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Assigned Date
                      </th>
                      <th className="text-left p-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedIssues.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="text-center">
                            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                              No Assigned Issues
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              You don't have any assigned issues at the moment.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      assignedIssues.map((issue) => (
                        <tr
                          key={issue.id}
                          className="border-t border-slate-200 dark:border-slate-700"
                        >
                          <td className="p-6 text-slate-800 dark:text-slate-200">
                            {issue.id}
                          </td>
                          <td className="p-6 text-slate-800 dark:text-slate-200">
                            {issue.title}
                          </td>
                          <td className="p-6">
                            <Badge
                              className={
                                issue.priority === "High"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : issue.priority === "Medium"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                    : "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
                              }
                            >
                              {issue.priority}
                            </Badge>
                          </td>
                          <td className="p-6">
                            <Badge
                              className={
                                issue.status === "Pending"
                                  ? "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                  : issue.status === "In Progress"
                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              }
                            >
                              {issue.status}
                            </Badge>
                          </td>
                          <td className="p-6 text-slate-700 dark:text-slate-300">
                            {issue.submitted}
                          </td>
                          <td className="p-6">
                            {issue.status === "Resolved" ? (
                              <span className="text-slate-400">—</span>
                            ) : (
                              <Dialog
                                open={editOpen && editingIssueId === issue.id}
                                onOpenChange={(o) => {
                                  if (!o) {
                                    setEditOpen(false);
                                    setEditingIssueId(null);
                                    setSelectedStatus("");
                                  }
                                }}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setEditingIssueId(issue.id);
                                      setSelectedStatus(issue.status);
                                      setEditOpen(true);
                                    }}
                                  >
                                    Update Status
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>
                                      Update Issue Status
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="text-sm mb-2">
                                        Current Status:{" "}
                                        <Badge
                                          className={getStatusColorForIssues(
                                            issue.status,
                                          )}
                                        >
                                          {issue.status}
                                        </Badge>
                                      </div>
                                      <div className="text-sm mb-2">
                                        Select new status
                                      </div>
                                      <Select
                                        value={selectedStatus}
                                        onValueChange={setSelectedStatus}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue placeholder="Choose status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="Pending">
                                            Pending
                                          </SelectItem>
                                          <SelectItem value="In Progress">
                                            In Progress
                                          </SelectItem>
                                          <SelectItem value="Resolved">
                                            Resolved
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      onClick={() => {
                                        if (!editingIssueId || !selectedStatus)
                                          return;

                                        // Find the original issue
                                        const issueItem = assignedIssues.find(
                                          (q) => q.id === editingIssueId,
                                        );
                                        if (!issueItem) return;

                                        // Call the status update API using original ID
                                        updateStatusMutation.mutate(
                                          {
                                            id: issueItem.originalId,
                                            status: selectedStatus
                                              .toLowerCase()
                                              .replace(" ", "_"),
                                          },
                                          {
                                            onSuccess: () => {
                                              setEditOpen(false);
                                              setEditingIssueId(null);
                                              setSelectedStatus("");
                                              // Refetch issues to get updated data
                                              refetchIssues();
                                            },
                                          },
                                        );
                                      }}
                                      disabled={
                                        !selectedStatus ||
                                        selectedStatus === issue.status ||
                                        updateStatusMutation.isPending
                                      }
                                    >
                                      {updateStatusMutation.isPending
                                        ? "Updating..."
                                        : "Update Status"}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};
