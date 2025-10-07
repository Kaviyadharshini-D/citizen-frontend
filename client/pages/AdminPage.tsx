import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  Users, 
  Building2, 
  Shield, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  BarChart3,
  Activity,
  Globe,
  Settings,
  Bell,
  Eye,
  Edit,
  Trash2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  FileText,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAdminOverviewData, AdminOverviewData } from "../data/adminDashboardData";
import { useToast } from "../hooks/use-toast";
import { RealtimeSummary } from "../components/RealtimeSummary";
import { RealtimeLeaderboard } from "../components/RealtimeLeaderboard";
import { UserAnalytics } from "../components/UserAnalytics";

export default function AdminPage() {
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminOverviewData().then((d) => setData(d)).finally(() => setLoading(false));
  }, []);

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
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "activity", label: "Activity", icon: Activity },
  ];

  const systemMetrics = [
    {
      title: "System Health",
      value: "98.5%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Active Users",
      value: "2,847",
      change: "+12.3%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Issues Resolved",
      value: "1,234",
      change: "+8.7%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Response Time",
      value: "2.3h",
      change: "-15.2%",
      trend: "down",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "user_registration",
      title: "New user registered",
      description: "John Doe joined the platform",
      time: "2 minutes ago",
      icon: Users,
      color: "text-blue-600",
    },
    {
      id: "2",
      type: "issue_resolved",
      title: "Issue resolved",
      description: "Road maintenance completed in District A",
      time: "15 minutes ago",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      id: "3",
      type: "system_alert",
      title: "System alert",
      description: "High server load detected",
      time: "1 hour ago",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      id: "4",
      type: "mla_assigned",
      title: "MLA assigned",
      description: "Sarah Wilson assigned to Constituency 5",
      time: "2 hours ago",
      icon: Shield,
      color: "text-purple-600",
    },
  ];

  const departmentPerformance = [
    { name: "Public Works", resolved: 89, pending: 11, rating: 4.8 },
    { name: "Water Supply", resolved: 76, pending: 24, rating: 4.5 },
    { name: "Electricity", resolved: 82, pending: 18, rating: 4.6 },
    { name: "Sanitation", resolved: 71, pending: 29, rating: 4.2 },
    { name: "Healthcare", resolved: 85, pending: 15, rating: 4.7 },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto p-6 space-y-6"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Comprehensive overview of platform performance and management
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </Button>
                <Button size="sm" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white dark:bg-slate-800 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Overview Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* System Metrics Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {systemMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <motion.div
                        key={metric.title}
                        variants={cardVariants}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="group"
                      >
                        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${metric.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <Icon className={`w-6 h-6 ${metric.color}`} />
                            </div>
                            <div className="flex items-center gap-1">
                              {metric.trend === "up" ? (
                                <ArrowUpRight className="w-4 h-4 text-green-500" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-500" />
                              )}
                              <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                                {metric.change}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                              {metric.value}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                              {metric.title}
                            </p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Platform Statistics */}
                  <motion.div variants={itemVariants} className="lg:col-span-2">
                    <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                          Platform Statistics
                        </h2>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                  <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Total MLAs</p>
                                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {data?.totals.mlas || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                                  <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Active MLAs</p>
                                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {data?.totals.activeMLAs || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Constituencies</p>
                                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {data?.totals.constituencies || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                                  <AlertCircle className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Inactive MLAs</p>
                                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {data?.totals.inactiveMLAs || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                                  <Clock className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Unassigned</p>
                                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {data?.totals.unassigned || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                                  <Globe className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                                    {data?.totals.users?.toLocaleString() || 0}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>

                  {/* Party Distribution */}
                  <motion.div variants={itemVariants}>
                    <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">
                        Party Distribution
                      </h2>
                      {loading ? (
                        <div className="space-y-3">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {data?.byParty.map((party, index) => (
                            <div key={party.party} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                  {party.party}
                                </span>
                                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                  {party.count}
                                </span>
                              </div>
                              <Progress 
                                value={(party.count / (data?.totals.mlas || 1)) * 100} 
                                className="h-2"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </motion.div>
                </div>

                {/* Department Performance */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Department Performance
                      </h2>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Analytics
                      </Button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-full">
                        <div className="grid grid-cols-5 gap-4 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Department</div>
                          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Resolved</div>
                          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Pending</div>
                          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Rating</div>
                          <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">Actions</div>
                        </div>
                        {departmentPerformance.map((dept, index) => (
                          <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="grid grid-cols-5 gap-4 py-4 border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-2 -mx-2"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {dept.name}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                {dept.resolved}%
                              </Badge>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                                {dept.pending}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {dept.rating}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Recent Activity */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Recent Activity
                      </h2>
                      <Button variant="outline" size="sm">
                        <Activity className="w-4 h-4 mr-2" />
                        View All
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {recentActivities.map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                              <Icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-800 dark:text-slate-200">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {activity.time}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Users Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "users" && (
              <motion.div
                key="users"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* User Statistics */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Users</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                          {data?.totals.users?.toLocaleString() || "48,210"}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Active Users</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">42,156</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Shield className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">MLAs</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                          {data?.totals.mlas || 140}
                        </p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Departments</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">12</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* User Management */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        User Management
                      </h2>
                      <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View All
                        </Button>
                        <Button className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Add User
                        </Button>
                      </div>
                    </div>
                    
                    {/* User Role Distribution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Citizens</h3>
                        </div>
                        <div className="text-xl font-bold text-blue-600">45,230</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">94.2% of total users</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-5 h-5 text-purple-600" />
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">MLAs</h3>
                        </div>
                        <div className="text-xl font-bold text-purple-600">140</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">0.3% of total users</p>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                          <Building2 className="w-5 h-5 text-green-600" />
                          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Department Staff</h3>
                        </div>
                        <div className="text-xl font-bold text-green-600">2,840</div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">5.9% of total users</p>
                      </div>
                    </div>

                    {/* Recent User Activity */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                        Recent User Activity
                      </h3>
                      <div className="space-y-3">
                        {[
                          { name: "John Doe", action: "Registered as Citizen", time: "2 minutes ago", role: "citizen" },
                          { name: "Sarah Wilson", action: "Assigned as MLA", time: "15 minutes ago", role: "mla" },
                          { name: "Mike Johnson", action: "Joined Department", time: "1 hour ago", role: "dept_staff" },
                          { name: "Emily Davis", action: "Updated Profile", time: "2 hours ago", role: "citizen" },
                          { name: "Robert Brown", action: "Submitted Issue", time: "3 hours ago", role: "citizen" },
                        ].map((user, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                          >
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-800 dark:text-slate-200">
                                {user.name}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {user.action}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">
                                {user.role}
                              </Badge>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {user.time}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* User Analytics */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        User Analytics
                      </h2>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">User Growth</h3>
                        <div className="h-32 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">+12.5%</div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">this month</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Activity Distribution</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Issue Submissions</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">68%</span>
                          </div>
                          <Progress value={68} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Profile Updates</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">23%</span>
                          </div>
                          <Progress value={23} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Other Activities</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">9%</span>
                          </div>
                          <Progress value={9} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Performance Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "performance" && (
              <motion.div
                key="performance"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* Real-time Summary */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-0 overflow-hidden">
                    <RealtimeSummary />
                  </div>
                </motion.div>

                {/* Real-time Leaderboard */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-0 overflow-hidden">
                    <RealtimeLeaderboard />
                  </div>
                </motion.div>

                {/* User Analytics */}
                <motion.div variants={itemVariants}>
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-0 overflow-hidden">
                    <UserAnalytics />
                  </div>
                </motion.div>

                {/* Additional Performance Metrics */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Advanced Analytics
                      </h2>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Export Report
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Growth Rate</h3>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">+24.5%</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">vs last month</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Success Rate</h3>
                          </div>
                          <div className="text-2xl font-bold text-green-600">94.2%</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">issue resolution</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <Users className="w-6 h-6 text-purple-600" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">User Satisfaction</h3>
                          </div>
                          <div className="text-2xl font-bold text-purple-600">4.7/5</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">average rating</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-6 h-6 text-orange-600" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Avg Response</h3>
                          </div>
                          <div className="text-2xl font-bold text-orange-600">1.8h</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">time to first response</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <Activity className="w-6 h-6 text-indigo-600" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Platform Uptime</h3>
                          </div>
                          <div className="text-2xl font-bold text-indigo-600">99.9%</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">last 30 days</p>
                        </div>
                        <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl">
                          <div className="flex items-center gap-3 mb-2">
                            <Globe className="w-6 h-6 text-teal-600" />
                            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Active Sessions</h3>
                          </div>
                          <div className="text-2xl font-bold text-teal-600">1,247</div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">current users</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Activity Tab */}
          <AnimatePresence mode="wait">
            {activeTab === "activity" && (
              <motion.div
                key="activity"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-6"
              >
                {/* System Activity Overview */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Issues Resolved</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">1,234</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">New Users</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">156</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Pending Issues</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">89</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                        <Activity className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">System Events</p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">2,847</p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Real-time Activity Feed */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Real-time Activity Feed
                      </h2>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-slate-600 dark:text-slate-400">Live</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Export Log
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { id: "1", type: "issue_resolved", title: "Issue #1234 resolved", description: "Road maintenance completed in District A", time: "2 minutes ago", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-50" },
                        { id: "2", type: "user_registration", title: "New user registered", description: "John Doe joined as Citizen", time: "5 minutes ago", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" },
                        { id: "3", type: "mla_assigned", title: "MLA assigned", description: "Sarah Wilson assigned to Constituency 5", time: "12 minutes ago", icon: Shield, color: "text-purple-600", bgColor: "bg-purple-50" },
                        { id: "4", type: "system_alert", title: "System alert", description: "High server load detected", time: "18 minutes ago", icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-50" },
                        { id: "5", type: "issue_submitted", title: "New issue submitted", description: "Water supply problem reported", time: "25 minutes ago", icon: AlertCircle, color: "text-blue-600", bgColor: "bg-blue-50" },
                        { id: "6", type: "department_update", title: "Department updated", description: "Public Works department status changed", time: "32 minutes ago", icon: Building2, color: "text-indigo-600", bgColor: "bg-indigo-50" },
                        { id: "7", type: "user_login", title: "User login", description: "Admin user logged in", time: "45 minutes ago", icon: Users, color: "text-green-600", bgColor: "bg-green-50" },
                        { id: "8", type: "backup_completed", title: "Backup completed", description: "Daily system backup completed successfully", time: "1 hour ago", icon: CheckCircle, color: "text-emerald-600", bgColor: "bg-emerald-50" },
                      ].map((activity, index) => {
                        const Icon = activity.icon;
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activity.bgColor}`}>
                              <Icon className={`w-5 h-5 ${activity.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-slate-800 dark:text-slate-200">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {activity.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-1">
                                {activity.type.replace('_', ' ')}
                              </Badge>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {activity.time}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>

                {/* System Health & Performance */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        System Health & Performance
                      </h2>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Server Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">CPU Usage</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">67%</span>
                          </div>
                          <Progress value={67} className="h-2" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Disk Usage</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">23%</span>
                          </div>
                          <Progress value={23} className="h-2" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Database Performance</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Query Response</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">12ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Connections</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">45/100</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Cache Hit Rate</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">94%</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">Network Status</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Latency</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">23ms</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Bandwidth</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">1.2 Gbps</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 dark:text-slate-400">Uptime</span>
                            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">99.9%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Recent System Changes */}
                <motion.div variants={itemVariants}>
                  <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                        Recent System Changes
                      </h2>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {data?.recent.map((change, index) => (
                        <motion.div
                          key={change.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors duration-200"
                        >
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-slate-800 dark:text-slate-200">
                              {change.action}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {change.entity} by {change.by}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(change.at).toLocaleString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
}


