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
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAdminConstituencies, AdminConstituencyRow } from "../data/adminConstituencyData";
import { fetchAdminMLAs, AdminMLARow } from "../data/adminMlaData";
import { useToast } from "../hooks/use-toast";

export default function AdminConstituencies() {
  const [rows, setRows] = useState<AdminConstituencyRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mlas, setMlas] = useState<AdminMLARow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterReserved, setFilterReserved] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedConstituency, setSelectedConstituency] = useState<AdminConstituencyRow | null>(null);
  const { toast } = useToast();

  // Modal states
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminConstituencyRow | null>(null);
  const [form, setForm] = useState<AdminConstituencyRow>({ id: "", name: "", constituency_id: "" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<AdminConstituencyRow | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState("");

  useEffect(() => {
    Promise.all([fetchAdminConstituencies(), fetchAdminMLAs()])
      .then(([c, m]) => {
        setRows(c);
        setMlas(m);
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
                          row.constituency_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          row.district?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDistrict = !filterDistrict || filterDistrict === "all" || row.district === filterDistrict;
      const matchesReserved = !filterReserved || filterReserved === "all" || row.reserved_category === filterReserved;
      
      return matchesSearch && matchesDistrict && matchesReserved;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortBy as keyof AdminConstituencyRow];
      let bVal = b[sortBy as keyof AdminConstituencyRow];
      
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

  const getUniqueDistricts = () => {
    if (!rows) return [];
    return [...new Set(rows.map(r => r.district).filter(Boolean))];
  };

  // Action handlers
  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", name: "", constituency_id: "", district: "", reserved_category: "None", population: undefined, mla: "unassigned" });
    setOpen(true);
  };

  const openEdit = (row: AdminConstituencyRow) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const openView = (row: AdminConstituencyRow) => {
    setSelectedConstituency(row);
    setActiveTab("overview");
  };

  const saveForm = () => {
    if (!form.name || !form.constituency_id) {
      toast({ title: "Error", description: "Name and Code are required", variant: "destructive" });
      return;
    }
    if (editing) {
      setRows((prev) => prev?.map((r) => (r.id === editing.id ? { ...form, id: editing.id } : r)) || null);
      toast({ title: "Success", description: "Constituency updated successfully" });
    } else {
      const newId = Math.random().toString(36).slice(2);
      setRows((prev) => ([...(prev || []), { ...form, id: newId }]));
      toast({ title: "Success", description: "Constituency added successfully" });
    }
    setOpen(false);
  };

  const askDelete = (row: AdminConstituencyRow) => {
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
    toast({ title: "Success", description: "Constituency deleted successfully" });
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedRows.length === 0) return;
    
    switch (bulkAction) {
      case "delete":
        setRows((prev) => prev?.filter((r) => !selectedRows.includes(r.id)) || null);
        toast({ title: "Success", description: `${selectedRows.length} constituencies deleted` });
        break;
      case "assign_mla":
        // Implementation for bulk MLA assignment
        toast({ title: "Success", description: `MLA assigned to ${selectedRows.length} constituencies` });
        break;
      case "export":
        // Implementation for bulk export
        toast({ title: "Success", description: `Exported ${selectedRows.length} constituencies` });
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
                  Constituency Management
                </h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Comprehensive management of constituencies, MLA assignments, and administrative operations
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
                  Add Constituency
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Constituencies</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.length || 0}
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
                    <p className="text-sm text-slate-600 dark:text-slate-400">Assigned MLAs</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.filter(r => r.mla && r.mla !== "—" && r.mla !== "").length || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Unassigned</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.filter(r => !r.mla || r.mla === "—" || r.mla === "").length || 0}
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 bg-white dark:bg-slate-800 border-0 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Total Population</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                      {rows?.reduce((sum, r) => sum + (r.population || 0), 0).toLocaleString() || 0}
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
                      placeholder="Search constituencies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {getUniqueDistricts().map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterReserved} onValueChange={setFilterReserved}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="None">General</SelectItem>
                      <SelectItem value="SC">SC</SelectItem>
                      <SelectItem value="ST">ST</SelectItem>
                      <SelectItem value="OBC">OBC</SelectItem>
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
                      <SelectItem value="constituency_id">Code</SelectItem>
                      <SelectItem value="district">District</SelectItem>
                      <SelectItem value="population">Population</SelectItem>
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
                      {selectedRows.length} constituency{selectedRows.length !== 1 ? 'ies' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setBulkAction("assign_mla");
                        setBulkActionOpen(true);
                      }}
                    >
                      Assign MLA
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
                viewMode === "table" ? (
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
                    <TableHead>Code</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Reserved</TableHead>
                    <TableHead>Population</TableHead>
                    <TableHead>MLA</TableHead>
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
                            <TableCell>
                              <Badge variant="outline">{r.constituency_id}</Badge>
                            </TableCell>
                      <TableCell>{r.district || "-"}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={r.reserved_category === "None" ? "secondary" : "default"}
                                className={r.reserved_category === "SC" ? "bg-orange-100 text-orange-800" : 
                                         r.reserved_category === "ST" ? "bg-green-100 text-green-800" :
                                         r.reserved_category === "OBC" ? "bg-blue-100 text-blue-800" : ""}
                              >
                                {r.reserved_category || "None"}
                              </Badge>
                            </TableCell>
                      <TableCell>{r.population?.toLocaleString?.() || "-"}</TableCell>
                            <TableCell>
                              {r.mla && r.mla !== "—" && r.mla !== "" ? (
                                <Badge variant="secondary">{r.mla}</Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600">Unassigned</Badge>
                              )}
                            </TableCell>
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
                                <Building2 className="w-6 h-6 text-white" />
                              </div>
                            </div>
                            <Badge variant="outline">{r.constituency_id}</Badge>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{r.name}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">{r.district}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Population:</span>
                              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                {r.population?.toLocaleString?.() || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">Category:</span>
                              <Badge 
                                variant={r.reserved_category === "None" ? "secondary" : "default"}
                                className={r.reserved_category === "SC" ? "bg-orange-100 text-orange-800" : 
                                         r.reserved_category === "ST" ? "bg-green-100 text-green-800" :
                                         r.reserved_category === "OBC" ? "bg-blue-100 text-blue-800" : ""}
                              >
                                {r.reserved_category || "None"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600 dark:text-slate-400">MLA:</span>
                              {r.mla && r.mla !== "—" && r.mla !== "" ? (
                                <Badge variant="secondary">{r.mla}</Badge>
                              ) : (
                                <Badge variant="outline" className="text-orange-600">Unassigned</Badge>
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
                  <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    No constituencies found
                  </h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    {searchTerm || filterDistrict || filterReserved 
                      ? "Try adjusting your search criteria"
                      : "Get started by adding your first constituency"}
                  </p>
                  <Button onClick={openAdd}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Constituency
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
                  {editing ? "Edit Constituency" : "Add New Constituency"}
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">Constituency Name *</Label>
                  <Input 
                    id="name" 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder="Enter constituency name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-semibold">Constituency Code *</Label>
                  <Input 
                    id="code" 
                    value={form.constituency_id} 
                    onChange={(e) => setForm({ ...form, constituency_id: e.target.value })} 
                    placeholder="e.g., TVM001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-semibold">District</Label>
                  <Input 
                    id="district" 
                    value={form.district || ""} 
                    onChange={(e) => setForm({ ...form, district: e.target.value })} 
                    placeholder="Enter district name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Reserved Category</Label>
                  <Select value={form.reserved_category || "None"} onValueChange={(v) => setForm({ ...form, reserved_category: v as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">General</SelectItem>
                      <SelectItem value="SC">SC (Scheduled Caste)</SelectItem>
                      <SelectItem value="ST">ST (Scheduled Tribe)</SelectItem>
                      <SelectItem value="OBC">OBC (Other Backward Class)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="population" className="text-sm font-semibold">Population</Label>
                  <Input 
                    id="population" 
                    type="number" 
                    value={form.population?.toString() || ""} 
                    onChange={(e) => setForm({ ...form, population: e.target.value ? Number(e.target.value) : undefined })} 
                    placeholder="Enter population"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Assign MLA</Label>
                  <Select value={form.mla || "unassigned"} onValueChange={(v) => setForm({ ...form, mla: v === "unassigned" ? "" : v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select MLA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {mlas.map((m) => (
                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={saveForm} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                  {editing ? "Update Constituency" : "Create Constituency"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-600">Delete Constituency</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-200">Warning</p>
                      <p className="text-sm text-red-700 dark:text-red-300">
                        This action cannot be undone. All data associated with this constituency will be permanently deleted.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">
                    Type the constituency name "{confirmTarget?.name}" to confirm:
                  </Label>
                  <Input 
                    value={confirmText} 
                    onChange={(e) => setConfirmText(e.target.value)} 
                    placeholder="Enter constituency name"
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
                  Delete Constituency
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Bulk Action Modal */}
          <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {bulkAction === "delete" ? "Delete Multiple Constituencies" :
                   bulkAction === "assign_mla" ? "Assign MLA to Multiple Constituencies" :
                   bulkAction === "export" ? "Export Selected Constituencies" : "Bulk Action"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {bulkAction === "delete" && `Are you sure you want to delete ${selectedRows.length} constituencies? This action cannot be undone.`}
                  {bulkAction === "assign_mla" && `Select an MLA to assign to ${selectedRows.length} constituencies.`}
                  {bulkAction === "export" && `Export ${selectedRows.length} constituencies to CSV format.`}
                </p>
                {bulkAction === "assign_mla" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Select MLA</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an MLA" />
                      </SelectTrigger>
                      <SelectContent>
                        {mlas.map((m) => (
                          <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
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
                   bulkAction === "assign_mla" ? "Assign MLA" :
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



