import React from "react";
import { DepartmentDashboardData, Employee } from "../data/dashboardData";
import { motion } from "framer-motion";
import {
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useDepartmentIssues, useAssignIssue } from "../hooks/useApi";
import { useUser } from "../context/UserContext";
import { Issue } from "../types/api";

interface DepartmentDashboardProps {
  data: DepartmentDashboardData;
  loading?: boolean;
}

export function DepartmentDashboard({
  data,
  loading = false,
}: DepartmentDashboardProps) {
  const { user } = useUser();
  const departmentId = user?.department_id || "default";

  // Fetch department issues using React Query
  const {
    data: issuesData,
    isLoading: issuesLoading,
    error: issuesError,
    refetch: refetchIssues,
  } = useDepartmentIssues(departmentId);

  // Assignment mutation
  const assignIssueMutation = useAssignIssue();

  const [editOpen, setEditOpen] = React.useState(false);
  const [editingQueryId, setEditingQueryId] = React.useState<string | null>(
    null,
  );
  const [selectedEmployeeId, setSelectedEmployeeId] =
    React.useState<string>("");

  // Transform API issues to component format
  const queries = React.useMemo(() => {
    if (!issuesData?.issues) return [];
    return issuesData.issues.map((issue: Issue) => {
      // Format ID as Q-XXX (last 3 digits in caps)
      const issueId = issue._id || (issue as any).id;
      const lastThreeDigits = issueId.slice(-3).toUpperCase();
      const formattedId = `Q-${lastThreeDigits}`;

      return {
        id: formattedId,
        originalId: issueId, // Keep original ID for API calls
        title: issue.title,
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
        assignedTo: issue.handled_by || null,
        originalIssue: issue, // Keep reference to original issue for API calls
      };
    });
  }, [issuesData]);

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

  // const itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.4,
  //       ease: "easeOut" as const,
  //     },
  //   },
  // };

  if (loading || issuesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="animate-pulse"
        >
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-80 mb-4"></div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6"
              >
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-lg w-32 mb-3"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-20"></div>
              </div>
            ))}
          </div>
          <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
        </motion.div>
      </div>
    );
  }

  // Show error state if API fails
  if (issuesError) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Failed to Load Department Issues
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {issuesError instanceof Error
              ? issuesError.message
              : "An error occurred while loading issues."}
          </p>
          <Button onClick={() => refetchIssues()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const { title, description, summaryStats, employees } = data;

  const summaryCards = [
    {
      title: "Total Queries",
      value: summaryStats.totalQueries.toLocaleString(),
      icon: Target,
      color: "from-blue-500 to-indigo-600",
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      title: "Query Solving Rate",
      value: `${summaryStats.querySolvingRate}%`,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
      change: "+8%",
      changeType: "positive" as const,
    },
    {
      title: "Avg Resolution Time",
      value: summaryStats.averageResolutionTime,
      icon: Clock,
      color: "from-orange-500 to-red-600",
      change: "-15%",
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
        {/* Header */}
        <motion.div /*variants={itemVariants}*/ className="mb-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 dark:from-slate-200 dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent mb-4 transition-colors duration-300">
              {title}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 transition-colors duration-300">
              {description}
            </p>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div /*variants={itemVariants}*/ className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Unresolved Queries (Pending + In Progress) */}
        <motion.div /*variants={itemVariants}*/ className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 transition-colors duration-300">
              Unresolved Queries
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
                  {queries
                    .filter(
                      (q) =>
                        q.status === "Pending" || q.status === "In Progress",
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
                      const pOrder = { High: 0, Medium: 1, Low: 2 } as const;
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
                          {q.assignedTo || "—"}
                        </td>
                        <td className="p-6">
                          {!q.assignedTo ? (
                            <Dialog
                              open={editOpen && editingQueryId === q.id}
                              onOpenChange={(o) => {
                                if (!o) {
                                  setEditOpen(false);
                                  setEditingQueryId(null);
                                }
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingQueryId(q.id);
                                    setSelectedEmployeeId("");
                                    setEditOpen(true);
                                  }}
                                >
                                  Assign
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Assign Employee</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <div className="text-sm mb-2">
                                      Select employee
                                    </div>
                                    <Select
                                      value={selectedEmployeeId}
                                      onValueChange={setSelectedEmployeeId}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose employee" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {data.employees.map((e) => (
                                          <SelectItem key={e.id} value={e.id}>
                                            {e.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button
                                    onClick={() => {
                                      if (
                                        !editingQueryId ||
                                        !selectedEmployeeId
                                      )
                                        return;

                                      // Find the original issue
                                      const queryItem = queries.find(
                                        (q) => q.id === editingQueryId,
                                      );
                                      if (!queryItem) return;

                                      // Call the assignment API using original ID
                                      assignIssueMutation.mutate(
                                        {
                                          id: queryItem.originalId,
                                          handledBy: selectedEmployeeId,
                                        },
                                        {
                                          onSuccess: () => {
                                            setEditOpen(false);
                                            setEditingQueryId(null);
                                            setSelectedEmployeeId("");
                                            // Refetch issues to get updated data
                                            refetchIssues();
                                          },
                                        },
                                      );
                                    }}
                                    disabled={
                                      !selectedEmployeeId ||
                                      assignIssueMutation.isPending
                                    }
                                  >
                                    {assignIssueMutation.isPending
                                      ? "Assigning..."
                                      : "Save"}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Data freshness indicator */}
        <motion.div /*variants={itemVariants}*/ className="mt-6">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
            <Activity className="w-4 h-4" />
            <span>
              Last updated: {new Date(data.lastUpdated).toLocaleString()}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
