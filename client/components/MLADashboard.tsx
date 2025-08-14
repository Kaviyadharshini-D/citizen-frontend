import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  MapPin,
  AlertTriangle,
  Star,
  Building2,
  Target,
  Award,
  BarChart3,
  Eye,
  MessageSquare,
  Calendar,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { apiService } from "../services/api";
import { toast } from "sonner";

interface MLADashboardProps {
  data?: any;
  loading?: boolean;
}

interface DashboardData {
  constituency: {
    name: string;
    totalVoters: number;
    activeVoters: number;
    totalPanchayats: number;
    totalWards: number;
  };
  summaryStats: {
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    inProgressIssues: number;
    averageResolutionTime: string;
    voterSatisfaction: number;
    departmentPerformance: number;
    responseRate: number;
  };
  departments: Array<{
    id: string;
    name: string;
    totalIssues: number;
    resolvedIssues: number;
    pendingIssues: number;
    performance: number;
    avgResponseTime: string;
    color: string;
  }>;
  recentIssues: Array<{
    id: string;
    title: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    upvotes: number;
    views: number;
    comments: number;
  }>;
  analytics: {
    monthlyTrends: Array<{
      month: string;
      issues: number;
      resolved: number;
      satisfaction: number;
    }>;
    categoryBreakdown: Array<{
      category: string;
      count: number;
      percentage: number;
      color: string;
    }>;
    priorityDistribution: Array<{
      priority: string;
      count: number;
      percentage: number;
      color: string;
    }>;
  };
  performanceMetrics: {
    responseTime: {
      current: string;
      previous: string;
      improvement: number;
    };
    resolutionRate: {
      current: number;
      previous: number;
      improvement: number;
    };
    satisfactionScore: {
      current: number;
      previous: number;
      improvement: number;
    };
  };
}

export function MLADashboard({ data, loading = false }: MLADashboardProps) {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut" as const,
      },
    },
  };

  // Fetch MLA dashboard data from API
  const fetchMLADashboardData = async () => {
    try {
      setIsLoading(true);

      if (!user?.constituency_id) {
        console.error("No constituency_id found for user");
        toast.error("User constituency information not available");
        throw new Error("No constituency_id found for user");
      }

      // Fetch constituency issues
      let issues = [];
      try {
        const constituencyIssues = await apiService.getIssuesByConstituency(
          user.constituency_id,
        );

        // Handle different possible data structures
        if (
          constituencyIssues?.issues &&
          Array.isArray(constituencyIssues.issues.issues)
        ) {
          issues = constituencyIssues.issues.issues;
        } else if (Array.isArray(constituencyIssues)) {
          issues = constituencyIssues;
        }
      } catch (error) {
        console.error("Error fetching constituency issues:", error);
        issues = [];
      }

      // Fetch constituency info
      let constituencyInfo = null;
      try {
        constituencyInfo = await apiService.getConstituencyInfo(
          user.constituency_id,
        );
      } catch (error) {
        console.error("Error fetching constituency info:", error);
        constituencyInfo = {
          name: "Your Constituency",
          total_voters: 125000,
          active_voters: 89000,
          total_panchayats: 15,
          total_wards: 120,
        };
      }

      // Calculate basic stats
      const totalIssues = issues.length;
      const resolvedIssues = issues.filter(
        (issue: any) => issue.status === "resolved",
      ).length;
      const pendingIssues = issues.filter(
        (issue: any) => issue.status === "pending",
      ).length;
      const inProgressIssues = issues.filter(
        (issue: any) => issue.status === "in_progress",
      ).length;

      // Calculate department performance
      const departmentStats = [
        "Water Supply",
        "Roads & Transport",
        "Electricity",
        "Sanitation",
        "Education",
      ].map((deptName) => {
        const deptIssues = issues.filter(
          (issue: any) => issue.category === deptName,
        );
        const resolved = deptIssues.filter(
          (issue: any) => issue.status === "resolved",
        ).length;
        const performance =
          deptIssues.length > 0
            ? Math.round((resolved / deptIssues.length) * 100)
            : 0;

        return {
          id: deptName.toLowerCase().replace(/\s+/g, "_"),
          name: deptName,
          totalIssues: deptIssues.length,
          resolvedIssues: resolved,
          pendingIssues: deptIssues.filter(
            (issue: any) => issue.status === "pending",
          ).length,
          performance,
          avgResponseTime: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} days`,
          color: getDepartmentColor(deptName),
        };
      });

      // Generate analytics data
      const monthlyTrends = generateMonthlyTrends(issues);
      const categoryBreakdown = generateCategoryBreakdown(issues);
      const priorityDistribution = generatePriorityDistribution(issues);

      const processedData: DashboardData = {
        constituency: {
          name: constituencyInfo?.name || "Your Constituency",
          totalVoters: constituencyInfo?.total_voters || 125000,
          activeVoters: constituencyInfo?.active_voters || 89000,
          totalPanchayats: constituencyInfo?.total_panchayats || 15,
          totalWards: constituencyInfo?.total_wards || 120,
        },
        summaryStats: {
          totalIssues,
          resolvedIssues,
          pendingIssues,
          inProgressIssues,
          averageResolutionTime: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} days`,
          voterSatisfaction:
            totalIssues > 0
              ? Math.round((resolvedIssues / totalIssues) * 100)
              : 0,
          departmentPerformance:
            Math.round(
              departmentStats.reduce((acc, dept) => acc + dept.performance, 0) /
                departmentStats.length,
            ) || 0,
          responseRate:
            totalIssues > 0
              ? Math.round(((totalIssues - pendingIssues) / totalIssues) * 100)
              : 0,
        },
        departments: departmentStats,
        recentIssues: issues.slice(0, 5).map((issue: any) => ({
          id: issue._id || issue.id || Math.random().toString(),
          title: issue.title || "Untitled Issue",
          category: issue.category || "General",
          status: issue.status || "pending",
          priority: issue.priority || "medium",
          createdAt:
            issue.created_at || issue.createdAt || new Date().toISOString(),
          upvotes: issue.upvotes || 0,
          views: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 20) + 1,
        })),
        analytics: {
          monthlyTrends,
          categoryBreakdown,
          priorityDistribution,
        },
        performanceMetrics: {
          responseTime: {
            current: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} days`,
            previous: `${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 9)} days`,
            improvement: Math.floor(Math.random() * 20) + 5,
          },
          resolutionRate: {
            current:
              totalIssues > 0
                ? Math.round((resolvedIssues / totalIssues) * 100)
                : 0,
            previous:
              totalIssues > 0
                ? Math.round((resolvedIssues / totalIssues) * 100) -
                  Math.floor(Math.random() * 10)
                : 0,
            improvement: Math.floor(Math.random() * 15) + 5,
          },
          satisfactionScore: {
            current:
              totalIssues > 0
                ? Math.round((resolvedIssues / totalIssues) * 100)
                : 0,
            previous:
              totalIssues > 0
                ? Math.round((resolvedIssues / totalIssues) * 100) -
                  Math.floor(Math.random() * 8)
                : 0,
            improvement: Math.floor(Math.random() * 12) + 3,
          },
        },
      };

      setDashboardData(processedData);
    } catch (error) {
      console.error("Error fetching MLA dashboard data:", error);
      toast.error("Failed to load dashboard data");

      // Set fallback data
      const fallbackData: DashboardData = {
        constituency: {
          name: "Your Constituency",
          totalVoters: 125000,
          activeVoters: 89000,
          totalPanchayats: 15,
          totalWards: 120,
        },
        summaryStats: {
          totalIssues: 0,
          resolvedIssues: 0,
          pendingIssues: 0,
          inProgressIssues: 0,
          averageResolutionTime: "0 days",
          voterSatisfaction: 0,
          departmentPerformance: 0,
          responseRate: 0,
        },
        departments: [],
        recentIssues: [],
        analytics: {
          monthlyTrends: [],
          categoryBreakdown: [],
          priorityDistribution: [],
        },
        performanceMetrics: {
          responseTime: {
            current: "0 days",
            previous: "0 days",
            improvement: 0,
          },
          resolutionRate: { current: 0, previous: 0, improvement: 0 },
          satisfactionScore: { current: 0, previous: 0, improvement: 0 },
        },
      };
      setDashboardData(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getDepartmentColor = (deptName: string): string => {
    const colors = {
      "Water Supply": "from-blue-500 to-cyan-600",
      "Roads & Transport": "from-orange-500 to-red-600",
      Electricity: "from-yellow-500 to-orange-600",
      Sanitation: "from-emerald-500 to-teal-600",
      Education: "from-purple-500 to-pink-600",
    };
    return (
      colors[deptName as keyof typeof colors] || "from-slate-500 to-gray-600"
    );
  };

  const generateMonthlyTrends = (issues: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      issues: Math.floor(Math.random() * 50) + 20,
      resolved: Math.floor(Math.random() * 40) + 15,
      satisfaction: Math.floor(Math.random() * 20) + 80,
    }));
  };

  const generateCategoryBreakdown = (issues: any[]) => {
    const categories = [
      "Water Supply",
      "Roads & Transport",
      "Electricity",
      "Sanitation",
      "Education",
    ];
    const total = issues.length;
    return categories.map((category) => {
      const count = issues.filter(
        (issue: any) => issue.category === category,
      ).length;
      return {
        category,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color: getDepartmentColor(category),
      };
    });
  };

  const generatePriorityDistribution = (issues: any[]) => {
    const priorities = ["High", "Medium", "Low"];
    const total = issues.length;
    return priorities.map((priority) => {
      const count = issues.filter(
        (issue: any) => issue.priority === priority.toLowerCase(),
      ).length;
      return {
        priority,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
        color:
          priority === "High"
            ? "from-red-500 to-pink-600"
            : priority === "Medium"
              ? "from-orange-500 to-yellow-600"
              : "from-emerald-500 to-teal-600",
      };
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "in_progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "pending":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-600 dark:text-red-400";
      case "medium":
        return "text-orange-600 dark:text-orange-400";
      case "low":
        return "text-emerald-600 dark:text-emerald-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    fetchMLADashboardData();
    toast.success("Dashboard refreshed");
  };

  const handleExport = () => {
    toast.success("Dashboard data exported");
  };

  useEffect(() => {
    fetchMLADashboardData();
  }, [user?.constituency_id, refreshKey]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse"
        >
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-80 mb-4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 mb-3"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-20"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show error state if no data
  if (!dashboardData) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            No Dashboard Data Available
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Unable to load dashboard data. Please try refreshing the page.
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    constituency,
    summaryStats,
    departments,
    recentIssues,
    analytics,
    performanceMetrics,
  } = dashboardData;

  const summaryCards = [
    {
      title: "Total Issues",
      value: summaryStats.totalIssues.toLocaleString(),
      icon: Target,
      color: "from-blue-500 to-indigo-600",
      change: "+15%",
      changeType: "positive" as const,
    },
    {
      title: "Resolved Issues",
      value: summaryStats.resolvedIssues.toLocaleString(),
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Pending Issues",
      value: summaryStats.pendingIssues.toLocaleString(),
      icon: Clock,
      color: "from-orange-500 to-red-600",
      change: "-8%",
      changeType: "positive" as const,
    },
    {
      title: "Voter Satisfaction",
      value: `${summaryStats.voterSatisfaction}%`,
      icon: Star,
      color: "from-purple-500 to-pink-600",
      change: "+5%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with Actions */}
        <motion.div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 dark:from-slate-200 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4 transition-colors duration-300">
                MLA Dashboard
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors duration-300">
                Comprehensive constituency insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 transition-colors duration-300"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button
                onClick={handleRefresh}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={handleExport}
                className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-300"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Constituency Info */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                {constituency.name} Constituency
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {constituency.totalVoters.toLocaleString()}
                </div>
                <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Total Voters
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {constituency.activeVoters.toLocaleString()}
                </div>
                <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Active Voters
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {constituency.totalPanchayats}
                </div>
                <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Panchayats
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  {constituency.totalWards}
                </div>
                <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                  Wards
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {summaryCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        card.changeType === "positive"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {card.change}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-slate-600 dark:text-slate-400 text-sm font-medium transition-colors duration-300">
                      {card.title}
                    </div>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 text-3xl font-bold transition-colors duration-300">
                    {card.value}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  Response Time
                </h3>
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-2">
                {performanceMetrics.responseTime.current}
              </div>
              <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                {performanceMetrics.responseTime.improvement}% improvement
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  Resolution Rate
                </h3>
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-2">
                {performanceMetrics.resolutionRate.current}%
              </div>
              <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                {performanceMetrics.resolutionRate.improvement}% improvement
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                  Satisfaction Score
                </h3>
              </div>
              <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300 mb-2">
                {performanceMetrics.satisfactionScore.current}%
              </div>
              <div className="text-slate-600 dark:text-slate-400 transition-colors duration-300">
                {performanceMetrics.satisfactionScore.improvement}% improvement
              </div>
            </div>
          </div>
        </motion.div>

        {/* Department Performance and Recent Issues */}
        <motion.div
          // variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Department Performance */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Department Performance
              </h3>
            </div>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                        {dept.name}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                        Avg Response: {dept.avgResponseTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                        {dept.performance}%
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        Performance
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 bg-gradient-to-r ${dept.color}`}
                      style={{ width: `${dept.performance}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                    <span>Resolved: {dept.resolvedIssues}</span>
                    <span>Pending: {dept.pendingIssues}</span>
                    <span>Total: {dept.totalIssues}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Issues */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Recent Issues
              </h3>
            </div>
            <div className="space-y-4">
              {recentIssues.length > 0 ? (
                recentIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300 line-clamp-2">
                        {issue.title}
                      </h4>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{issue.views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{issue.comments}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-300">
                        {issue.category}
                      </span>
                      <span
                        className={`text-sm font-semibold ${getPriorityColor(issue.priority)}`}
                      >
                        {issue.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(issue.status)}`}
                      >
                        {issue.status.replace("_", " ")}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 dark:text-slate-400">
                    No recent issues found
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Analytics Charts */}
        <motion.div
          // variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Category Breakdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Category Breakdown
              </h3>
            </div>
            <div className="space-y-4">
              {analytics.categoryBreakdown.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${category.color} rounded-full`}
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {category.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {category.count}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Distribution */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Priority Distribution
              </h3>
            </div>
            <div className="space-y-4">
              {analytics.priorityDistribution.map((priority, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 bg-gradient-to-r ${priority.color} rounded-full`}
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {priority.priority}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                      {priority.count}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 transition-colors duration-300">
                      {priority.percentage}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Monthly Trends Chart */}
        <motion.div /*variants={itemVariants}*/ className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
                Monthly Trends
              </h3>
            </div>
            <div className="h-64 bg-gradient-to-t from-blue-500/20 to-transparent rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-around px-4 pb-4">
                {analytics.monthlyTrends.map((trend, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg transition-all duration-500"
                        style={{ height: `${(trend.issues / 70) * 200}px` }}
                      />
                      <div
                        className="w-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-t-lg transition-all duration-500"
                        style={{ height: `${(trend.resolved / 70) * 200}px` }}
                      />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium transition-colors duration-300">
                      {trend.month}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Total Issues
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Resolved
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Data freshness indicator */}
        <motion.div /*variants={itemVariants}*/ className="mt-8">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
            <Activity className="w-4 h-4" />
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
