import React, { useState, useEffect } from "react";
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
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
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
  Lightbulb,
  Brain,
  Building,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ThumbsUp,
  Eye,
  Filter,
  Search,
  Download,
  Share2,
  Settings,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  RefreshCw,
} from "lucide-react";
import {
  useMLADashboard,
  useMLADashboardStats,
  useUpdateMLADashboard,
} from "../hooks/useApi";
import { useUser } from "../context/UserContext";
import { toast } from "sonner";
import { getMockMLADashboardData } from "../data/dashboardData";

// Fallback data for when API is not available
const fallbackData = {
  constituency: {
    name: "Thiruvananthapuram",
    total_voters: 125000,
    active_voters: 89000,
    total_panchayats: 15,
    total_wards: 120,
    area: "214.86 sq km",
    population: "957,730",
    literacy_rate: "94.2%",
  },
  stats: {
    total_issues: 156,
    resolved_issues: 142,
    pending_issues: 14,
    critical_issues: 3,
    avg_resolution_time: 1.8,
    user_satisfaction: 4.6,
    efficiency: 89,
    monthly_trends: [
      {
        month: "Jan",
        total: 42,
        resolved: 38,
        pending: 4,
        critical: 2,
        avg_resolution: 1.6,
        satisfaction: 4.4,
      },
      {
        month: "Feb",
        total: 38,
        resolved: 35,
        pending: 3,
        critical: 1,
        avg_resolution: 1.4,
        satisfaction: 4.5,
      },
      {
        month: "Mar",
        total: 45,
        resolved: 41,
        pending: 4,
        critical: 3,
        avg_resolution: 1.8,
        satisfaction: 4.3,
      },
      {
        month: "Apr",
        total: 52,
        resolved: 47,
        pending: 5,
        critical: 2,
        avg_resolution: 1.7,
        satisfaction: 4.6,
      },
      {
        month: "May",
        total: 48,
        resolved: 44,
        pending: 4,
        critical: 1,
        avg_resolution: 1.5,
        satisfaction: 4.7,
      },
      {
        month: "Jun",
        total: 41,
        resolved: 38,
        pending: 3,
        critical: 2,
        avg_resolution: 1.6,
        satisfaction: 4.5,
      },
    ],
    category_breakdown: [
      {
        name: "Roads & Transport",
        value: 35,
        color: "#ff6b6b",
        priority: "High",
        avg_resolution: 1.2,
      },
      {
        name: "Water Supply",
        value: 28,
        color: "#4ecdc4",
        priority: "Medium",
        avg_resolution: 1.8,
      },
      {
        name: "Electricity",
        value: 22,
        color: "#45b7d1",
        priority: "High",
        avg_resolution: 2.1,
      },
      {
        name: "Sanitation",
        value: 12,
        color: "#96ceb4",
        priority: "Low",
        avg_resolution: 1.5,
      },
      {
        name: "Healthcare",
        value: 8,
        color: "#feca57",
        priority: "Medium",
        avg_resolution: 2.5,
      },
    ],
    priority_distribution: [
      { priority: "High", count: 45, color: "#ff6b6b" },
      { priority: "Medium", count: 78, color: "#4ecdc4" },
      { priority: "Low", count: 33, color: "#96ceb4" },
    ],
    department_performance: [
      {
        name: "Roads & Transport",
        issues: 156,
        resolved: 142,
        pending: 14,
        avg_response: 2.1,
        satisfaction: 4.6,
        budget: 2500000,
        spent: 2100000,
      },
      {
        name: "Water Supply",
        issues: 89,
        resolved: 82,
        pending: 7,
        avg_response: 1.8,
        satisfaction: 4.7,
        budget: 1800000,
        spent: 1650000,
      },
      {
        name: "Electricity",
        issues: 67,
        resolved: 61,
        pending: 6,
        avg_response: 1.5,
        satisfaction: 4.8,
        budget: 1200000,
        spent: 1100000,
      },
      {
        name: "Sanitation",
        issues: 45,
        resolved: 42,
        pending: 3,
        avg_response: 1.9,
        satisfaction: 4.5,
        budget: 800000,
        spent: 750000,
      },
    ],
    recent_issues: [
      {
        id: "IS001",
        title: "Pothole on main road",
        category: "Roads & Transport",
        priority: "High",
        status: "In Progress",
        submitted: "2 hours ago",
        location: "Main Street, City Center",
      },
      {
        id: "IS002",
        title: "Water supply disruption",
        category: "Water Supply",
        priority: "Medium",
        status: "Pending",
        submitted: "4 hours ago",
        location: "Residential Area A",
      },
      {
        id: "IS003",
        title: "Street light malfunction",
        category: "Electricity",
        priority: "Low",
        status: "Resolved",
        submitted: "1 day ago",
        location: "Park Street",
      },
      {
        id: "IS004",
        title: "Garbage collection delay",
        category: "Sanitation",
        priority: "Medium",
        status: "In Progress",
        submitted: "1 day ago",
        location: "Market Area",
      },
      {
        id: "IS005",
        title: "Traffic signal issue",
        category: "Roads & Transport",
        priority: "High",
        status: "Pending",
        submitted: "2 days ago",
        location: "Central Junction",
      },
    ],
  },
};

export const MLADashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useUser();
  const constituencyId = user?.constituency_id || "64f1a2b3c4d5e6f7g8h9i0j1"; // Fallback ID

  // API hooks for real data
  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useMLADashboard(constituencyId);
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useMLADashboardStats(constituencyId);
  const updateDashboard = useUpdateMLADashboard();

  // Determine if we should use mock data
  const shouldUseMockData = dashboardError || statsError;

  // Get mock data if API fails
  const mockData = shouldUseMockData ? getMockMLADashboardData() : null;

  // Log when using mock data for debugging
  useEffect(() => {
    if (shouldUseMockData && mockData) {
      console.warn("MLA Dashboard: Using mock data due to API errors", {
        dashboardError: dashboardError?.message,
        statsError: statsError?.message,
        mockData: mockData.isMockData,
      });
    }
  }, [shouldUseMockData, mockData, dashboardError, statsError]);

  // Use real data or fallback to mock data
  const constituency =
    dashboardData?.data || mockData?.constituency || fallbackData.constituency;
  const stats = statsData?.data || mockData?.stats || fallbackData.stats;

  // Loading states
  const isLoading = dashboardLoading || statsLoading;
  const hasError = dashboardError || statsError;

  // Refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Refetch data
      window.location.reload(); // Simple refresh for now
    } catch (error) {
      toast.error("Failed to refresh data");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Update dashboard data function
  const handleUpdateDashboard = async (updates: any) => {
    try {
      await updateDashboard.mutateAsync({ constituencyId, data: updates });
      toast.success("Dashboard updated successfully");
    } catch (error) {
      toast.error("Failed to update dashboard");
    }
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 space-y-6"
      >
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
            ))}
          </div>

          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center"
      >
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {dashboardError?.message ||
              statsError?.message ||
              "An error occurred while loading the dashboard data."}
          </p>
          <Button
            onClick={handleRefresh}
            className="bg-red-600 hover:bg-red-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </motion.div>
    );
  }

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

  const getStatusColor = (status: string) => {
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

  const getAIPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-50";
      case "Medium":
        return "text-yellow-600 bg-yellow-50";
      case "Low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getAIImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "text-purple-600 bg-purple-50";
      case "Medium":
        return "text-blue-600 bg-blue-50";
      case "Low":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
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
          MLA Dashboard - {constituency.name}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive constituency overview with AI-powered insights and
          analytics
        </p>
      </motion.div>

      {/* Constituency Overview Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Voters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {constituency.total_voters.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Active: {constituency.active_voters.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Panchayats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">
              {constituency.total_panchayats}
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              Wards: {constituency.total_wards}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {constituency.area}
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              Population: {constituency.population}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Literacy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
              {constituency.literacy_rate}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Above state average
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={selectedDepartment}
          onValueChange={setSelectedDepartment}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="roads">Roads & Transport</SelectItem>
            <SelectItem value="water">Water Supply</SelectItem>
            <SelectItem value="electricity">Electricity</SelectItem>
            <SelectItem value="sanitation">Sanitation</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </motion.div>

      {/* Main Analytics Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="ai">AI Insights</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Issues Overview
                  </CardTitle>
                  <CardDescription>
                    Monthly issues and resolution trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.monthly_trends}>
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
                    <PieChartIcon className="h-5 w-5 text-green-600" />
                    Issue Categories
                  </CardTitle>
                  <CardDescription>
                    Distribution by issue type and priority
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={stats.category_breakdown}
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
                        {stats.category_breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Department Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Department Performance Overview
                </CardTitle>
                <CardDescription>
                  Key metrics across all departments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats.department_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="issues" fill="#8884d8" name="Total Issues" />
                    <Bar
                      dataKey="resolved"
                      fill="#82ca9d"
                      name="Resolved Issues"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Department Analytics
                </CardTitle>
                <CardDescription>
                  Comprehensive department performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.department_performance.map((dept, index) => (
                    <motion.div
                      key={dept.name}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {dept.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {dept.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Budget: ₹{dept.budget.toLocaleString()} | Spent: ₹
                              {dept.spent.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {dept.issues}
                            </div>
                            <div className="text-xs text-gray-500">
                              Total Issues
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {dept.resolved}
                            </div>
                            <div className="text-xs text-gray-500">
                              Resolved
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                              {dept.avg_response}d
                            </div>
                            <div className="text-xs text-gray-500">
                              Avg Response
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {dept.satisfaction}
                            </div>
                            <div className="text-xs text-gray-500">
                              Satisfaction
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Resolution Rate</span>
                          <span>
                            {Math.round((dept.resolved / dept.issues) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(dept.resolved / dept.issues) * 100}
                          className="h-2"
                        />
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>Budget Utilization</span>
                          <span>
                            {Math.round((dept.spent / dept.budget) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(dept.spent / dept.budget) * 100}
                          className="h-2"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RadarChart className="h-5 w-5 text-green-600" />
                  Department Performance Radar
                </CardTitle>
                <CardDescription>
                  Multi-dimensional performance comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={stats.department_performance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Resolution Rate"
                      dataKey="resolved"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Satisfaction"
                      dataKey="satisfaction"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues Resolution Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Resolution Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly resolution performance and satisfaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8884d8"
                        strokeWidth={2}
                        yAxisId="left"
                      />
                      <Line
                        type="monotone"
                        dataKey="resolved"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        yAxisId="left"
                      />
                      <Line
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#ffc658"
                        strokeWidth={2}
                        yAxisId="right"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Critical Issues Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Critical Issues
                  </CardTitle>
                  <CardDescription>
                    High-priority issues requiring attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="critical" fill="#ff6b6b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Issues Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Recent Issues
                </CardTitle>
                <CardDescription>
                  Latest issues and their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {stats.recent_issues.map((issue, index) => (
                    <motion.div
                      key={issue.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {issue.id}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {issue.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {issue.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(issue.priority)}>
                            {issue.priority}
                          </Badge>
                          <Badge className={getStatusColor(issue.status)}>
                            {issue.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {issue.submitted}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    User Engagement
                  </CardTitle>
                  <CardDescription>
                    Daily user activity and satisfaction trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="activeUsers"
                        stroke="#8884d8"
                        strokeWidth={2}
                        yAxisId="left"
                      />
                      <Line
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#82ca9d"
                        strokeWidth={2}
                        yAxisId="right"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Satisfaction Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Satisfaction Trends
                  </CardTitle>
                  <CardDescription>
                    User satisfaction and complaint patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={stats.monthly_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#ffc658"
                        fill="#ffc658"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* User Behavior Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  User Behavior Insights
                </CardTitle>
                <CardDescription>
                  Patterns and trends in user interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      Peak Hours
                    </div>
                    <div className="text-lg text-blue-800 dark:text-blue-200">
                      10 AM - 2 PM
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      Highest user activity during these hours
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      Most Active
                    </div>
                    <div className="text-lg text-green-800 dark:text-green-200">
                      Wednesday
                    </div>
                    <div className="text-sm text-green-600 dark:text-green-400 mt-2">
                      Peak day for issue submissions
                    </div>
                  </div>
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      Engagement
                    </div>
                    <div className="text-lg text-purple-800 dark:text-purple-200">
                      87%
                    </div>
                    <div className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                      Users return within 7 days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  AI-Powered Insights & Suggestions
                </CardTitle>
                <CardDescription>
                  Intelligent recommendations for constituency improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This section would typically fetch AI suggestions from an API */}
                  {/* For now, we'll use a placeholder or a simple list */}
                  <motion.div
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Optimize Response Time
                          </h4>
                          <Badge className={getAIPriorityColor("High")}>
                            High
                          </Badge>
                          <Badge className={getAIImpactColor("High")}>
                            Impact: High
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Department response time has increased by 15% this
                          month. Consider implementing automated workflows.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Implementation: 2-3 weeks</span>
                          <span>Cost: ₹50,000</span>
                          <span>Type: Performance</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Budget Reallocation
                          </h4>
                          <Badge className={getAIPriorityColor("Medium")}>
                            Medium
                          </Badge>
                          <Badge className={getAIImpactColor("Medium")}>
                            Impact: Medium
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Roads department has 16% budget remaining. Consider
                          reallocating to high-priority projects.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Implementation: 1 week</span>
                          <span>Cost: ₹0</span>
                          <span>Type: Budget</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Mobile App Enhancement
                          </h4>
                          <Badge className={getAIPriorityColor("Medium")}>
                            Medium
                          </Badge>
                          <Badge className={getAIImpactColor("High")}>
                            Impact: High
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          User engagement drops 40% on weekends. Consider 24/7
                          support and mobile notifications.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Implementation: 4-6 weeks</span>
                          <span>Cost: ₹200,000</span>
                          <span>Type: User Experience</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                            Smart City Integration
                          </h4>
                          <Badge className={getAIPriorityColor("Low")}>
                            Low
                          </Badge>
                          <Badge className={getAIImpactColor("High")}>
                            Impact: High
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          Implement IoT sensors for real-time monitoring of
                          water supply and electricity.
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Implementation: 3-4 months</span>
                          <span>Cost: ₹2,500,000</span>
                          <span>Type: Infrastructure</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* AI Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  AI Suggestions Performance
                </CardTitle>
                <CardDescription>
                  Impact of implemented AI recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">23</div>
                    <div className="text-sm text-green-600">Implemented</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-sm text-blue-600">Success Rate</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      ₹2.1M
                    </div>
                    <div className="text-sm text-purple-600">Cost Saved</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      34%
                    </div>
                    <div className="text-sm text-orange-600">
                      Efficiency Gain
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Action Items */}
      <motion.div variants={itemVariants} className="flex gap-4">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <Share2 className="h-4 w-4 mr-2" />
          Share Dashboard
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Review
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Customize
        </Button>
      </motion.div>
    </motion.div>
  );
};
export default MLADashboard;
