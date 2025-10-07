export interface AdminDepartmentRow {
  id: string;
  name: string;
  officers: number;
  activeCases: number;
}

export async function fetchAdminDepartments(): Promise<AdminDepartmentRow[]> {
  return Promise.resolve([
    { id: "d1", name: "Water", officers: 120, activeCases: 54 },
    { id: "d2", name: "Roads", officers: 85, activeCases: 73 },
    { id: "d3", name: "Electricity", officers: 102, activeCases: 41 },
  ]);
}








