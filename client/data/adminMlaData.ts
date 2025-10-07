import { MLA, Party, CreateMLAData, UpdateMLAData } from '../lib/data/types';

// Mock parties data
const mockParties: Party[] = [
  {
    id: "p1",
    name: "Indian National Congress",
    abbreviation: "INC",
    color: "#00A651",
    description: "Major political party",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "p2",
    name: "Bharatiya Janata Party",
    abbreviation: "BJP",
    color: "#FF9933",
    description: "Major political party",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "p3",
    name: "Communist Party of India (Marxist)",
    abbreviation: "CPI(M)",
    color: "#FF0000",
    description: "Left-wing political party",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

// Mock MLA data following normalized structure
const mockMLAs: MLA[] = [
  {
    id: "m1",
    name: "A. Kumar",
    email: "a.kumar@gov.in",
    phone: "+91-9876543210",
    party_id: "p1",
    constituency_id: "c1",
    term_start: "2021-05-01",
    term_end: "2026-04-30",
    status: "ACTIVE",
    bio: "Experienced politician with focus on development",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "m2",
    name: "P. Nair",
    email: "p.nair@gov.in",
    phone: "+91-9876543211",
    party_id: "p2",
    constituency_id: "c3",
    term_start: "2021-05-01",
    term_end: "2026-04-30",
    status: "ACTIVE",
    bio: "Development-focused MLA",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  },
  {
    id: "m3",
    name: "S. Das",
    email: "s.das@gov.in",
    phone: "+91-9876543212",
    party_id: "p3",
    constituency_id: "c2",
    term_start: "2021-05-01",
    term_end: "2026-04-30",
    status: "INACTIVE",
    bio: "Former MLA",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z"
  }
];

export async function fetchAdminMLAs(): Promise<MLA[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return Promise.resolve(mockMLAs);
}

export async function fetchParties(): Promise<Party[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return Promise.resolve(mockParties);
}

export async function createMLA(data: CreateMLAData): Promise<MLA> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newMLA: MLA = {
    id: `m${Date.now()}`,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  mockMLAs.push(newMLA);
  return newMLA;
}

export async function updateMLA(id: string, data: UpdateMLAData): Promise<MLA> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockMLAs.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('MLA not found');
  }
  
  mockMLAs[index] = {
    ...mockMLAs[index],
    ...data,
    updated_at: new Date().toISOString()
  };
  
  return mockMLAs[index];
}

export async function deleteMLA(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockMLAs.findIndex(m => m.id === id);
  if (index === -1) {
    throw new Error('MLA not found');
  }
  
  mockMLAs.splice(index, 1);
}

// Legacy interface for backward compatibility
export interface AdminMLARow {
  id: string;
  name: string;
  email: string;
  party?: string;
  constituency?: string;
  term?: string;
  status: "active" | "inactive" | "ended";
}

// Convert normalized data to legacy format
export function convertToLegacyFormat(mlas: MLA[], parties: Party[]): AdminMLARow[] {
  const partyMap = parties.reduce((acc, party) => {
    acc[party.id] = party.abbreviation;
    return acc;
  }, {} as Record<string, string>);

  return mlas.map(mla => ({
    id: mla.id,
    name: mla.name,
    email: mla.email,
    party: partyMap[mla.party_id],
    constituency: undefined, // Will be populated by constituency data
    term: `${mla.term_start.split('-')[0]}-${mla.term_end.split('-')[0]}`,
    status: mla.status.toLowerCase() as "active" | "inactive" | "ended"
  }));
}





