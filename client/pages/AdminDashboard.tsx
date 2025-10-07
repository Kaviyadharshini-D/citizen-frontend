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
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  FileText,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAdminOverviewData } from "../data/adminDashboardData";
import { DashboardStats, ConstituencyStats, MLAStats } from "../lib/data/types";
import { useToast } from "../hooks/use-toast";

interface DashboardData {
  dashboardStats: DashboardStats;
  constituencyStats: ConstituencyStats[];
  mlaStats: MLAStats[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
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
          </motion.div>

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
                              {data?.dashboardStats.total_mlas || 0}
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
                              {data?.dashboardStats.active_mlas || 0}
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
                              {data?.dashboardStats.total_constituencies || 0}
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
                              {data?.dashboardStats.inactive_mlas || 0}
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
                              {(data?.dashboardStats.total_constituencies || 0) - (data?.dashboardStats.active_mlas || 0)}
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
                              {data?.dashboardStats.total_users?.toLocaleString() || 0}
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
                    {[
                      { party: "INC", count: 1, color: "#00A651" },
                      { party: "BJP", count: 1, color: "#FF9933" },
                      { party: "CPI(M)", count: 1, color: "#FF0000" }
                    ].map((party, index) => (
                      <div key={party.party} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: party.color }}
                            />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {party.party}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {party.count}
                          </span>
                        </div>
                        <Progress 
                          value={(party.count / (data?.dashboardStats.total_mlas || 1)) * 100} 
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                )}
          </Card>
            </motion.div>
          </div>

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
            {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      id: "1",
                      action: "New MLA Added",
                      entity: "MLA Management",
                      by: "Admin User",
                      at: new Date().toISOString()
                    },
                    {
                      id: "2", 
                      action: "Constituency Updated",
                      entity: "Constituency Management",
                      by: "System Admin",
                      at: new Date(Date.now() - 3600000).toISOString()
                    },
                    {
                      id: "3",
                      action: "Issue Resolved",
                      entity: "Issue Tracking",
                      by: "MLA Staff",
                      at: new Date(Date.now() - 7200000).toISOString()
                    },
                    {
                      id: "4",
                      action: "User Registration",
                      entity: "User Management", 
                      by: "System",
                      at: new Date(Date.now() - 10800000).toISOString()
                    }
                  ].map((change, index) => (
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
              )}
          </Card>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}



