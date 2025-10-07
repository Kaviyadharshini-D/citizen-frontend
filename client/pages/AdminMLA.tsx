import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Checkbox } from "../components/ui/checkbox";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Upload, 
  MapPin, 
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
  FileText,
  Star,
  ArrowUpDown,
  MoreHorizontal,
  Copy,
  Archive,
  RefreshCw,
  Mail,
  Phone,
  Calendar,
  Award,
  UserCheck,
  UserX
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAdminMLAs, AdminMLARow } from "../data/adminMlaData";
import { fetchAdminConstituencies, AdminConstituencyRow } from "../data/adminConstituencyData";
import { useToast } from "../hooks/use-toast";

export default function AdminMLA() {
  const [rows, setRows] = useState<AdminMLARow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [constituencies, setConstituencies] = useState<AdminConstituencyRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterConstituency, setFilterConstituency] = useState("all");
  const [filterParty, setFilterParty] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMLA, setSelectedMLA] = useState<AdminMLARow | null>(null);
  const [groupByConstituency, setGroupByConstituency] = useState(false);
  const { toast } = useToast();

  // Modal states
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminMLARow | null>(null);
  const [form, setForm] = useState<AdminMLARow>({ id: "", name: "", email: "", status: "active" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<AdminMLARow | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminMLAs(), fetchAdminConstituencies()])
      .then(([m, c]) => {
        setRows(m);
        setConstituencies(c);
      })
      .finally(() => setLoading(false));
  }, []);

  // Animation variants
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

  // Filter and sort functions
  const filteredAndSortedRows = () => {
    if (!rows) return [];
    
    let filtered = rows.filter(row => {
      const matchesSearch = row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.party?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.constituency?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesConstituency = filterConstituency === "all" || row.constituency === filterConstituency;
      const matchesParty = filterParty === "all" || row.party === filterParty;
      const matchesStatus = filterStatus === "all" || row.status === filterStatus;
      
      return matchesSearch && matchesConstituency && matchesParty && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof AdminMLARow];
      let bVal = b[sortBy as keyof AdminMLARow];
      
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  };

  const getUniqueParties = () => {
    if (!rows) return [];
    return [...new Set(rows.map(r => r.party).filter(Boolean))];
  };

  const getUniqueConstituencies = () => {
    if (!rows) return [];
    return [...new Set(rows.map(r => r.constituency).filter(Boolean))];
  };

  const getGroupedRows = () => {
    if (!groupByConstituency) return { "All MLAs": filteredAndSortedRows() };
    
    const grouped: { [key: string]: AdminMLARow[] } = {};
    filteredAndSortedRows().forEach(row => {
      const key = row.constituency || "Unassigned";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(row);
    });
    
    return grouped;
  };

  // Action handlers
  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", name: "", email: "", party: "", constituency: "unassigned", term: "", status: "active" });
    setOpen(true);
  };

  const openEdit = (row: AdminMLARow) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const openView = (row: AdminMLARow) => {
    setSelectedMLA(row);
    setActiveTab("overview");
  };

  const saveForm = () => {
    if (!form.name || !form.email) {
      toast({ title: "Error", description: "Name and Email are required", variant: "destructive" });
      return;
    }
    if (editing) {
      setRows((prev) => prev?.map((r) => (r.id === editing.id ? { ...form, id: editing.id } : r)) || null);
      toast({ title: "Success", description: "MLA updated successfully" });
    } else {
      const newId = Math.random().toString(36).slice(2);
      setRows((prev) => ([...(prev || []), { ...form, id: newId }]));
      toast({ title: "Success", description: "MLA added successfully" });
    }
    setOpen(false);
  };

  const askDelete = (row: AdminMLARow) => {
    setConfirmTarget(row);
    setConfirmText("");
    setConfirmOpen(true);
  };

  const doDelete = () => {
    if (!confirmTarget) return;
    if (confirmText !== confirmTarget.name) {
      toast({ title: "Error", description: "Name does not match", variant: "destructive" });
      return;
    }
    setRows((prev) => prev?.filter((r) => r.id !== confirmTarget.id) || null);
    setConfirmOpen(false);
    toast({ title: "Success", description: "MLA deleted successfully" });
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedRows.length === 0) return;
    
    switch (bulkAction) {
      case "delete":
        setRows((prev) => prev?.filter((r) => !selectedRows.includes(r.id)) || null);
        toast({ title: "Success", description: `${selectedRows.length} MLAs deleted` });
        break;
      case "assign_constituency":
        toast({ title: "Success", description: `Constituency assigned to ${selectedRows.length} MLAs` });
        break;
      case "export":
        toast({ title: "Success", description: `Exported ${selectedRows.length} MLAs` });
        break;
    }
    setSelectedRows([]);
    setBulkActionOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredAndSortedRows().length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredAndSortedRows().map(r => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold";
    
    switch (status) {
      case "active":
        return <Badge className={`${baseClasses} bg-green-100 text-green-700 border-green-200`}>Active</Badge>;
      case "inactive":
        return <Badge className={`${baseClasses} bg-orange-100 text-orange-700 border-orange-200`}>Inactive</Badge>;
      case "ended":
        return <Badge className={`${baseClasses} bg-red-100 text-red-700 border-red-200`}>Ended</Badge>;
      default:
        return <Badge className={`${baseClasses} bg-gray-100 text-gray-700 border-gray-200`}>Unknown</Badge>;
    }
  };

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
                  MLA Management
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Comprehensive management of MLAs, constituency assignments, and administrative operations
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Import
                </Button>
                <Button onClick={openAdd} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add MLA
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total MLAs</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.length || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active MLAs</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.filter(r => r.status === "active").length || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <UserX className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Inactive MLAs</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.filter(r => r.status === "inactive").length || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Assigned Constituencies</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.filter(r => r.constituency && r.constituency !== "unassigned").length || 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search MLAs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterConstituency} onValueChange={setFilterConstituency}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Constituencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Constituencies</SelectItem>
                      {getUniqueConstituencies().map(constituency => (
                        <SelectItem key={constituency} value={constituency}>{constituency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterParty} onValueChange={setFilterParty}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Parties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Parties</SelectItem>
                      {getUniqueParties().map(party => (
                        <SelectItem key={party} value={party}>{party}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="party">Party</SelectItem>
                      <SelectItem value="constituency">Constituency</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("table")}
                    >
                      Table
                    </Button>
                    <Button
                      variant={viewMode === "cards" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("cards")}
                    >
                      Cards
                    </Button>
                  </div>
                  <Button
                    variant={groupByConstituency ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGroupByConstituency(!groupByConstituency)}
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Group
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Bulk Actions */}
          {selectedRows.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedRows.length === filteredAndSortedRows().length}
                      onCheckedChange={toggleSelectAll}
                    />
                    <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      {selectedRows.length} MLA{selectedRows.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBulkAction("assign_constituency");
                        setBulkActionOpen(true);
                      }}
                    >
                      Assign Constituency
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBulkAction("export");
                        setBulkActionOpen(true);
                      }}
                    >
                      Export
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setBulkAction("delete");
                        setBulkActionOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-full" />
                  ))}
                </div>
              ) : filteredAndSortedRows().length > 0 ? (
                groupByConstituency ? (
                  <div className="space-y-6">
                    {Object.entries(getGroupedRows()).map(([constituency, mlas]) => (
                      <div key={constituency}>
                        <div className="flex items-center gap-3 mb-4">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                            {constituency}
                          </h3>
                          <Badge variant="outline">{mlas.length} MLA{mlas.length !== 1 ? 's' : ''}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {mlas.map((mla) => (
                            <motion.div
                              key={mla.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileHover={{ scale: 1.02, y: -2 }}
                              className="group"
                            >
                              <Card className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <Checkbox
                                      checked={selectedRows.includes(mla.id)}
                                      onCheckedChange={() => toggleSelectRow(mla.id)}
                                    />
                                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                      <Shield className="w-5 h-5 text-white" />
                                    </div>
                                  </div>
                                  {getStatusBadge(mla.status)}
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{mla.name}</h4>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <Mail className="w-3 h-3" />
                                    {mla.email}
                                  </div>
                                  {mla.party && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                      <Award className="w-3 h-3" />
                                      {mla.party}
                                    </div>
                                  )}
                                  {mla.term && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                      <Calendar className="w-3 h-3" />
                                      {mla.term}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                                  <Button variant="ghost" size="sm" onClick={() => openView(mla)} className="flex-1">
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => openEdit(mla)} className="flex-1">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => askDelete(mla)} className="text-red-600 hover:text-red-700">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : viewMode === "table" ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedRows.length === filteredAndSortedRows().length}
                              onCheckedChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Party</TableHead>
                          <TableHead>Constituency</TableHead>
                          <TableHead>Term</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAndSortedRows().map((r) => (
                          <TableRow key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                            <TableCell>
                              <Checkbox
                                checked={selectedRows.includes(r.id)}
                                onCheckedChange={() => toggleSelectRow(r.id)}
                              />
                            </TableCell>
                            <TableCell className="font-medium">{r.name}</TableCell>
                            <TableCell>{r.email}</TableCell>
                            <TableCell>
                              {r.party ? (
                                <Badge variant="outline">{r.party}</Badge>
                              ) : (
                                <span className="text-slate-400">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {r.constituency && r.constituency !== "unassigned" ? (
                                <Badge variant="secondary">{r.constituency}</Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600">Unassigned</Badge>
                              )}
                            </TableCell>
                            <TableCell>{r.term || "-"}</TableCell>
                            <TableCell>{getStatusBadge(r.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={() => openView(r)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => openEdit(r)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => askDelete(r)}>
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedRows().map((r) => (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="group"
                      >
                        <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={selectedRows.includes(r.id)}
                                onCheckedChange={() => toggleSelectRow(r.id)}
                              />
                              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            {getStatusBadge(r.status)}
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{r.name}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{r.email}</p>
                            </div>
                            <div className="space-y-2">
                              {r.party && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">Party:</span>
                                  <Badge variant="outline">{r.party}</Badge>
                                </div>
                              )}
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-600 dark:text-slate-400">Constituency:</span>
                                {r.constituency && r.constituency !== "unassigned" ? (
                                  <Badge variant="secondary">{r.constituency}</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-orange-600">Unassigned</Badge>
                                )}
                              </div>
                              {r.term && (
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">Term:</span>
                                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{r.term}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <Button variant="ghost" size="sm" onClick={() => openView(r)} className="flex-1">
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEdit(r)} className="flex-1">
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => askDelete(r)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No MLAs found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    {searchTerm || filterConstituency !== "all" || filterParty !== "all" || filterStatus !== "all"
                      ? "Try adjusting your search criteria"
                      : "Get started by adding your first MLA"}
                  </p>
                  <Button onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add MLA
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Add/Edit Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {editing ? "Edit MLA" : "Add New MLA"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">MLA Name *</Label>
                  <Input 
                    id="name" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder="Enter MLA name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="party" className="text-sm font-semibold">Political Party</Label>
                  <Input 
                    id="party" 
                    value={form.party || ""} 
                    onChange={(e) => setForm({ ...form, party: e.target.value })} 
                    placeholder="Enter political party"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Constituency Assignment</Label>
                  <Select value={form.constituency || "unassigned"} onValueChange={(v) => setForm({ ...form, constituency: v === "unassigned" ? "" : v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select constituency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {constituencies.map((c) => (
                        <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="term" className="text-sm font-semibold">Term Period</Label>
                  <Input 
                    id="term" 
                    placeholder="2021-2026" 
                    value={form.term || ""} 
                    onChange={(e) => setForm({ ...form, term: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveForm} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  {editing ? "Update MLA" : "Create MLA"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-600">Delete MLA</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-200">Warning</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        This action cannot be undone. All data associated with this MLA will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Type the MLA name "{confirmTarget?.name}" to confirm:
                  </Label>
                  <Input 
                    value={confirmText} 
                    onChange={(e) => setConfirmText(e.target.value)} 
                    placeholder="Enter MLA name"
                  />
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={doDelete} 
                  disabled={!confirmTarget || confirmText !== confirmTarget?.name}
                >
                  Delete MLA
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Action Modal */}
          <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {bulkAction === "delete" ? "Delete Multiple MLAs" :
                   bulkAction === "assign_constituency" ? "Assign Constituency to Multiple MLAs" :
                   bulkAction === "export" ? "Export Selected MLAs" : "Bulk Action"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {bulkAction === "delete" && `Are you sure you want to delete ${selectedRows.length} MLAs? This action cannot be undone.`}
                  {bulkAction === "assign_constituency" && `Select a constituency to assign to ${selectedRows.length} MLAs.`}
                  {bulkAction === "export" && `Export ${selectedRows.length} MLAs to CSV format.`}
                </p>
                {bulkAction === "assign_constituency" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Select Constituency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a constituency" />
                      </SelectTrigger>
                      <SelectContent>
                        {constituencies.map((c) => (
                          <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setBulkActionOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkAction}
                  variant={bulkAction === "delete" ? "destructive" : "default"}
                >
                  {bulkAction === "delete" ? "Delete All" :
                   bulkAction === "assign_constituency" ? "Assign Constituency" :
                   bulkAction === "export" ? "Export" : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </Layout>
  );
}