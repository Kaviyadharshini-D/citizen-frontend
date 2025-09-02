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

// Mock data for TNEB (Tamil Nadu Electricity Board) department
const mockTNEBData = {
  departmentName: "TNEB - Tamil Nadu Electricity Board",
  totalEmployees: 45,
  totalIssues: 234,
  resolvedIssues: 198,
  pendingIssues: 36,
  avgResponseTime: 1.8,
  userSatisfaction: 4.6,
  budget: 8500000,
  spent: 7200000,
  efficiency: 89,
  powerOutages: 12,
  maintenanceCompleted: 156,
  newConnections: 89,
  revenue: 12500000,
  costSavings: 450000,
};

const mockEmployeeData = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Senior Engineer",
    issuesResolved: 28,
    avgResponseTime: 1.5,
    satisfaction: 4.8,
    efficiency: 94,
    specialization: "Power Distribution",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Field Engineer",
    issuesResolved: 32,
    avgResponseTime: 1.2,
    satisfaction: 4.9,
    efficiency: 96,
    specialization: "Line Maintenance",
  },
  {
    id: 3,
    name: "Arun Singh",
    role: "Supervisor",
    issuesResolved: 25,
    avgResponseTime: 1.8,
    satisfaction: 4.7,
    efficiency: 92,
    specialization: "Grid Operations",
  },
  {
    id: 4,
    name: "Meera Patel",
    role: "Technician",
    issuesResolved: 19,
    avgResponseTime: 2.1,
    satisfaction: 4.4,
    efficiency: 87,
    specialization: "Meter Reading",
  },
  {
    id: 5,
    name: "Suresh Reddy",
    role: "Senior Engineer",
    issuesResolved: 35,
    avgResponseTime: 1.6,
    satisfaction: 4.8,
    efficiency: 93,
    specialization: "Transformer Maintenance",
  },
  {
    id: 6,
    name: "Lakshmi Devi",
    role: "Field Officer",
    issuesResolved: 22,
    avgResponseTime: 1.9,
    satisfaction: 4.5,
    efficiency: 88,
    specialization: "Customer Service",
  },
];

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

const mockUserEngagementData = [
  {
    day: "Mon",
    activeUsers: 89,
    newIssues: 8,
    resolvedIssues: 7,
    satisfaction: 4.4,
    complaints: 2,
  },
  {
    day: "Tue",
    activeUsers: 92,
    newIssues: 9,
    resolvedIssues: 8,
    satisfaction: 4.5,
    complaints: 1,
  },
  {
    day: "Wed",
    activeUsers: 95,
    newIssues: 11,
    resolvedIssues: 10,
    satisfaction: 4.6,
    complaints: 1,
  },
  {
    day: "Thu",
    activeUsers: 88,
    newIssues: 7,
    resolvedIssues: 6,
    satisfaction: 4.3,
    complaints: 2,
  },
  {
    day: "Fri",
    activeUsers: 91,
    newIssues: 10,
    resolvedIssues: 9,
    satisfaction: 4.5,
    complaints: 1,
  },
  {
    day: "Sat",
    activeUsers: 76,
    newIssues: 6,
    resolvedIssues: 5,
    satisfaction: 4.2,
    complaints: 2,
  },
  {
    day: "Sun",
    activeUsers: 68,
    newIssues: 5,
    resolvedIssues: 4,
    satisfaction: 4.1,
    complaints: 1,
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

const mockRecentIssues = [
  {
    id: "TNEB001",
    title: "Power outage in Anna Nagar",
    category: "Power Outages",
    priority: "High",
    status: "In Progress",
    submitted: "2 hours ago",
    location: "Anna Nagar, Chennai",
  },
  {
    id: "TNEB002",
    title: "Transformer maintenance required",
    category: "Transformer Issues",
    priority: "Medium",
    status: "Pending",
    submitted: "4 hours ago",
    location: "T Nagar, Chennai",
  },
  {
    id: "TNEB003",
    title: "Line fault in Adyar",
    category: "Line Maintenance",
    priority: "High",
    status: "Resolved",
    submitted: "1 day ago",
    location: "Adyar, Chennai",
  },
  {
    id: "TNEB004",
    title: "Meter reading issue",
    category: "Meter Problems",
    priority: "Low",
    status: "In Progress",
    submitted: "1 day ago",
    location: "Mylapore, Chennai",
  },
  {
    id: "TNEB005",
    title: "New connection request",
    category: "Connection Issues",
    priority: "Medium",
    status: "Pending",
    submitted: "2 days ago",
    location: "Velachery, Chennai",
  },
];

export const DepartmentAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedArea, setSelectedArea] = useState("all");

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
          {mockTNEBData.departmentName} Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive analytics and performance metrics for TNEB operations
        </p>
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

        <Select value={selectedArea} onValueChange={setSelectedArea}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Area" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Areas</SelectItem>
            <SelectItem value="anna-nagar">Anna Nagar</SelectItem>
            <SelectItem value="t-nagar">T Nagar</SelectItem>
            <SelectItem value="adyar">Adyar</SelectItem>
            <SelectItem value="mylapore">Mylapore</SelectItem>
            <SelectItem value="velachery">Velachery</SelectItem>
          </SelectContent>
        </Select>
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
              {mockTNEBData.totalIssues}
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Resolved: {mockTNEBData.resolvedIssues} (
              {Math.round(
                (mockTNEBData.resolvedIssues / mockTNEBData.totalIssues) * 100,
              )}
              %)
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
              {mockTNEBData.avgResponseTime} days
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
              {mockTNEBData.userSatisfaction}/5
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
              {mockTNEBData.efficiency}%
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Target: 90%
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Analytics Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="employees">Team Analytics</TabsTrigger>
            <TabsTrigger value="issues">Issues Analytics</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    TNEB Issues Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly issues and resolution trends for TNEB
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
                    TNEB Issue Categories
                  </CardTitle>
                  <CardDescription>
                    Distribution by issue type specific to electricity
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
                  TNEB Performance Metrics
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
          </TabsContent>

          {/* Team Analytics Tab */}
          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  TNEB Team Performance Analytics
                </CardTitle>
                <CardDescription>
                  Individual performance metrics for TNEB team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockEmployeeData.map((employee, index) => (
                    <motion.div
                      key={employee.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {employee.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {employee.role}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {employee.specialization}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {employee.issuesResolved}
                            </div>
                            <div className="text-xs text-gray-500">
                              Issues Resolved
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {employee.avgResponseTime}d
                            </div>
                            <div className="text-xs text-gray-500">
                              Avg Response
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">
                              {employee.satisfaction}
                            </div>
                            <div className="text-xs text-gray-500">
                              Satisfaction
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={`text-2xl font-bold ${getEfficiencyColor(employee.efficiency)}`}
                            >
                              {employee.efficiency}%
                            </div>
                            <div className="text-xs text-gray-500">
                              Efficiency
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span>Efficiency Score</span>
                          <span>{employee.efficiency}%</span>
                        </div>
                        <Progress value={employee.efficiency} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-green-600" />
                  TNEB Team Comparison
                </CardTitle>
                <CardDescription>
                  Performance comparison across TNEB team members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockEmployeeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="issuesResolved"
                      fill="#8884d8"
                      name="Issues Resolved"
                    />
                    <Bar
                      dataKey="efficiency"
                      fill="#82ca9d"
                      name="Efficiency %"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Issues Analytics Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issues Resolution Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    TNEB Resolution Trend
                  </CardTitle>
                  <CardDescription>
                    Monthly resolution performance for TNEB issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockIssuesData}>
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

              {/* Power Outages Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Power Outages Analysis
                  </CardTitle>
                  <CardDescription>
                    Monthly power outage incidents and resolution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockIssuesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="powerOutages" fill="#ff6b6b" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent TNEB Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-600" />
                  Recent TNEB Issues
                </CardTitle>
                <CardDescription>
                  Latest electricity-related issues and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecentIssues.map((issue, index) => (
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
                          <Badge
                            className={getStatusColorForIssues(issue.status)}
                          >
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

          {/* Operations Tab */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Engagement */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    TNEB User Engagement
                  </CardTitle>
                  <CardDescription>
                    Daily user activity and satisfaction for electricity
                    services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockUserEngagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
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

              {/* Operational Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    TNEB Operational Metrics
                  </CardTitle>
                  <CardDescription>
                    Key operational performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {mockTNEBData.maintenanceCompleted}
                      </div>
                      <div className="text-sm text-blue-600">
                        Maintenance Completed
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {mockTNEBData.newConnections}
                      </div>
                      <div className="text-sm text-green-600">
                        New Connections
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        ₹{mockTNEBData.revenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-purple-600">
                        Revenue Generated
                      </div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{mockTNEBData.costSavings.toLocaleString()}
                      </div>
                      <div className="text-sm text-orange-600">
                        Cost Savings
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget and Financial Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  TNEB Budget Overview
                </CardTitle>
                <CardDescription>
                  Financial performance and budget utilization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      Budget Utilization
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {Math.round(
                        (mockTNEBData.spent / mockTNEBData.budget) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={(mockTNEBData.spent / mockTNEBData.budget) * 100}
                    className="h-3"
                  />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Total Budget:
                      </span>
                      <span className="ml-2 font-medium">
                        ₹{mockTNEBData.budget.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Amount Spent:
                      </span>
                      <span className="ml-2 font-medium">
                        ₹{mockTNEBData.spent.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Remaining:
                      </span>
                      <span className="ml-2 font-medium">
                        ₹
                        {(
                          mockTNEBData.budget - mockTNEBData.spent
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Efficiency:
                      </span>
                      <span className="ml-2 font-medium">
                        {mockTNEBData.efficiency}%
                      </span>
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
          <FileText className="h-4 w-4 mr-2" />
          Export TNEB Report
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Performance Review
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Configure Alerts
        </Button>
      </motion.div>
    </motion.div>
  );
};
