import { Constituency, CreateConstituencyData, UpdateConstituencyData } from '../lib/data/types';

// Mock data following normalized structure
const mockConstituencies: Constituency[] = [
  {
    id: "c1",
    name: "Thiruvananthapuram",
    code: "TVM001",
    district: "Thiruvananthapuram",
    reserved_category: "GENERAL",
    population: 1200000,
    area_km2: 214.86,
    description: "Capital constituency of Kerala",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "c2",
    name: "Kollam",
    code: "KOL001",
    district: "Kollam",
    reserved_category: "SC",
    population: 950000,
    area_km2: 2491.61,
    description: "Port city constituency",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "c3",
    name: "Alappuzha",
    code: "ALA001",
    district: "Alappuzha",
    reserved_category: "GENERAL",
    population: 800000,
    area_km2: 1414.00,
    description: "Backwater constituency",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "c4",
    name: "Kochi",
    code: "KOC001",
    district: "Ernakulam",
    reserved_category: "GENERAL",
    population: 1500000,
    area_km2: 3068.00,
    description: "Commercial hub constituency",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "c5",
    name: "Thrissur",
    code: "TSR001",
    district: "Thrissur",
    reserved_category: "GENERAL",
    population: 1100000,
    area_km2: 3032.00,
    description: "Cultural capital constituency",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

export async function fetchAdminConstituencies(): Promise<Constituency[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(mockConstituencies);
}

export async function createConstituency(data: CreateConstituencyData): Promise<Constituency> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newConstituency: Constituency = {
    id: `c${Date.now()}`,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockConstituencies.push(newConstituency);
  return newConstituency;
}

export async function updateConstituency(id: string, data: UpdateConstituencyData): Promise<Constituency> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockConstituencies.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Constituency not found');
  }
  
  mockConstituencies[index] = {
    ...mockConstituencies[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  return mockConstituencies[index];
}

export async function deleteConstituency(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockConstituencies.findIndex(c => c.id === id);
  if (index === -1) {
    throw new Error('Constituency not found');
  }
  
  mockConstituencies.splice(index, 1);
}

// Legacy interface for backward compatibility
export interface AdminConstituencyRow {
  id: string;
  name: string;
  constituency_id: string;
  district?: string;
  reserved_category?: "SC" | "ST" | "OBC" | "None";
  population?: number;
  mla?: string;
}

// Convert normalized data to legacy format
export function convertToLegacyFormat(constituencies: Constituency[]): AdminConstituencyRow[] {
  return constituencies.map(c => ({
    id: c.id,
    name: c.name,
    constituency_id: c.code,
    district: c.district,
    reserved_category: c.reserved_category === "GENERAL" ? "None" : c.reserved_category,
    population: c.population,
    mla: undefined // Will be populated by MLA data
  }));
}





