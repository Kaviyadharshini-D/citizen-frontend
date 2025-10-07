import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { fetchAdminDepartments, AdminDepartmentRow } from "../data/adminDepartmentData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";

export default function AdminDepartment() {
  const [rows, setRows] = useState<AdminDepartmentRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminDepartmentRow | null>(null);
  const [form, setForm] = useState<AdminDepartmentRow>({ id: "", name: "", officers: 0, activeCases: 0 });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<AdminDepartmentRow | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminDepartments().then(setRows).finally(() => setLoading(false));
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ id: "", name: "", officers: 0, activeCases: 0 });
    setOpen(true);
  };

  const openEdit = (row: AdminDepartmentRow) => {
    setEditing(row);
    setForm({ ...row });
    setOpen(true);
  };

  const saveForm = () => {
    if (!form.name) return;
    if (editing) {
      setRows((prev) => prev?.map((r) => (r.id === editing.id ? { ...form, id: editing.id } : r)) || null);
      toast({ title: "Department updated" });
    } else {
      const newId = Math.random().toString(36).slice(2);
      setRows((prev) => ([...(prev || []), { ...form, id: newId }]));
      toast({ title: "Department added" });
    }
    setOpen(false);
  };

  const askDelete = (row: AdminDepartmentRow) => {
    setConfirmTarget(row);
    setConfirmText("");
    setConfirmOpen(true);
  };

  const doDelete = () => {
    if (!confirmTarget) return;
    if (confirmText !== confirmTarget.name) return;
    setRows((prev) => prev?.filter((r) => r.id !== confirmTarget.id) || null);
    setConfirmOpen(false);
    toast({ title: "Department deleted", variant: "destructive" });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Department Management</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">Manage departments and roles</p>
            </div>
          </div>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-slate-600 dark:text-slate-300">Total: {rows?.length || 0}</div>
              <Button onClick={openAdd}>Add Department</Button>
            </div>
            {loading ? (
              <div className="space-y-2">{[...Array(6)].map((_, idx) => (<Skeleton key={idx} className="h-12 w-full" />))}</div>
            ) : rows && rows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Officers</TableHead>
                    <TableHead>Active Cases</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows?.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.officers}</TableCell>
                      <TableCell>{r.activeCases}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="secondary" size="sm" onClick={() => openEdit(r)}>Edit</Button>
                        <Button variant="destructive" size="sm" onClick={() => askDelete(r)}>Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-sm text-slate-500 py-8">No departments yet. Click "Add Department" to create one.</div>
            )}
          </Card>

          {/* Add/Edit Modal */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Department" : "Add Department"}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="officers">Officers</Label>
                  <Input id="officers" type="number" value={form.officers.toString()} onChange={(e) => setForm({ ...form, officers: Number(e.target.value || 0) })} />
                </div>
                <div>
                  <Label htmlFor="active">Active Cases</Label>
                  <Input id="active" type="number" value={form.activeCases.toString()} onChange={(e) => setForm({ ...form, activeCases: Number(e.target.value || 0) })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={saveForm}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirm */}
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Department</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-slate-600">Type the department name to confirm.</p>
              <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={doDelete} disabled={!confirmTarget || confirmText !== confirmTarget?.name}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
}



