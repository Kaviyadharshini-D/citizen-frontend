// client/lib/data/store.ts
// Centralized data store with normalized data management

import { 
  Constituency, 
  MLA, 
  Party, 
  Department, 
  Issue, 
  User,
  DashboardStats,
  ConstituencyStats,
  MLAStats,
  ApiResponse,
  PaginatedResponse,
  QueryParams
} from './types';

// Normalized data store
export interface DataStore {
  // Core entities
  constituencies: Record<string, Constituency>;
  mlas: Record<string, MLA>;
  parties: Record<string, Party>;
  departments: Record<string, Department>;
  issues: Record<string, Issue>;
  users: Record<string, User>;
  
  // Aggregated data
  dashboardStats: DashboardStats | null;
  constituencyStats: Record<string, ConstituencyStats>;
  mlaStats: Record<string, MLAStats>;
  
  // Metadata
  lastUpdated: Record<string, string>;
  isLoading: Record<string, boolean>;
  errors: Record<string, string | null>;
}

// Initial state
export const initialDataStore: DataStore = {
  constituencies: {},
  mlas: {},
  parties: {},
  departments: {},
  issues: {},
  users: {},
  dashboardStats: null,
  constituencyStats: {},
  mlaStats: {},
  lastUpdated: {},
  isLoading: {},
  errors: {}
};

// Data store class for managing normalized data
export class DataManager {
  private store: DataStore = initialDataStore;
  private listeners: Set<(store: DataStore) => void> = new Set();

  // Subscribe to store changes
  subscribe(listener: (store: DataStore) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Get current store state
  getStore(): DataStore {
    return { ...this.store };
  }

  // Notify all listeners of changes
  private notify(): void {
    this.listeners.forEach(listener => listener(this.store));
  }

  // Update store with new data
  private updateStore(updates: Partial<DataStore>): void {
    this.store = { ...this.store, ...updates };
    this.notify();
  }

  // Set loading state
  setLoading(entity: string, isLoading: boolean): void {
    this.updateStore({
      isLoading: { ...this.store.isLoading, [entity]: isLoading }
    });
  }

  // Set error state
  setError(entity: string, error: string | null): void {
    this.updateStore({
      errors: { ...this.store.errors, [entity]: error }
    });
  }

  // Update last updated timestamp
  private setLastUpdated(entity: string): void {
    this.updateStore({
      lastUpdated: { ...this.store.lastUpdated, [entity]: new Date().toISOString() }
    });
  }

  // Constituency operations
  setConstituencies(constituencies: Constituency[]): void {
    const normalized = constituencies.reduce((acc, constituency) => {
      acc[constituency.id] = constituency;
      return acc;
    }, {} as Record<string, Constituency>);

    this.updateStore({ constituencies: normalized });
    this.setLastUpdated('constituencies');
  }

  addConstituency(constituency: Constituency): void {
    this.updateStore({
      constituencies: { ...this.store.constituencies, [constituency.id]: constituency }
    });
    this.setLastUpdated('constituencies');
  }

  updateConstituency(constituency: Constituency): void {
    this.updateStore({
      constituencies: { ...this.store.constituencies, [constituency.id]: constituency }
    });
    this.setLastUpdated('constituencies');
  }

  removeConstituency(id: string): void {
    const { [id]: removed, ...remaining } = this.store.constituencies;
    this.updateStore({ constituencies: remaining });
    this.setLastUpdated('constituencies');
  }

  // MLA operations
  setMLAs(mlas: MLA[]): void {
    const normalized = mlas.reduce((acc, mla) => {
      acc[mla.id] = mla;
      return acc;
    }, {} as Record<string, MLA>);

    this.updateStore({ mlas: normalized });
    this.setLastUpdated('mlas');
  }

  addMLA(mla: MLA): void {
    this.updateStore({
      mlas: { ...this.store.mlas, [mla.id]: mla }
    });
    this.setLastUpdated('mlas');
  }

  updateMLA(mla: MLA): void {
    this.updateStore({
      mlas: { ...this.store.mlas, [mla.id]: mla }
    });
    this.setLastUpdated('mlas');
  }

  removeMLA(id: string): void {
    const { [id]: removed, ...remaining } = this.store.mlas;
    this.updateStore({ mlas: remaining });
    this.setLastUpdated('mlas');
  }

  // Party operations
  setParties(parties: Party[]): void {
    const normalized = parties.reduce((acc, party) => {
      acc[party.id] = party;
      return acc;
    }, {} as Record<string, Party>);

    this.updateStore({ parties: normalized });
    this.setLastUpdated('parties');
  }

  addParty(party: Party): void {
    this.updateStore({
      parties: { ...this.store.parties, [party.id]: party }
    });
    this.setLastUpdated('parties');
  }

  updateParty(party: Party): void {
    this.updateStore({
      parties: { ...this.store.parties, [party.id]: party }
    });
    this.setLastUpdated('parties');
  }

  removeParty(id: string): void {
    const { [id]: removed, ...remaining } = this.store.parties;
    this.updateStore({ parties: remaining });
    this.setLastUpdated('parties');
  }

  // Dashboard stats
  setDashboardStats(stats: DashboardStats): void {
    this.updateStore({ dashboardStats: stats });
    this.setLastUpdated('dashboardStats');
  }

  // Constituency stats
  setConstituencyStats(stats: ConstituencyStats[]): void {
    const normalized = stats.reduce((acc, stat) => {
      acc[stat.constituency_id] = stat;
      return acc;
    }, {} as Record<string, ConstituencyStats>);

    this.updateStore({ constituencyStats: normalized });
    this.setLastUpdated('constituencyStats');
  }

  // MLA stats
  setMLAStats(stats: MLAStats[]): void {
    const normalized = stats.reduce((acc, stat) => {
      acc[stat.mla_id] = stat;
      return acc;
    }, {} as Record<string, MLAStats>);

    this.updateStore({ mlaStats: normalized });
    this.setLastUpdated('mlaStats');
  }

  // Derived data getters
  getConstituencies(): Constituency[] {
    return Object.values(this.store.constituencies);
  }

  getMLAs(): MLA[] {
    return Object.values(this.store.mlas);
  }

  getParties(): Party[] {
    return Object.values(this.store.parties);
  }

  getConstituencyById(id: string): Constituency | undefined {
    return this.store.constituencies[id];
  }

  getMLAById(id: string): MLA | undefined {
    return this.store.mlas[id];
  }

  getPartyById(id: string): Party | undefined {
    return this.store.parties[id];
  }

  // Get MLAs by constituency
  getMLAsByConstituency(constituencyId: string): MLA[] {
    return this.getMLAs().filter(mla => mla.constituency_id === constituencyId);
  }

  // Get constituencies by district
  getConstituenciesByDistrict(district: string): Constituency[] {
    return this.getConstituencies().filter(constituency => constituency.district === district);
  }

  // Get MLAs by party
  getMLAsByParty(partyId: string): MLA[] {
    return this.getMLAs().filter(mla => mla.party_id === partyId);
  }

  // Get active MLAs
  getActiveMLAs(): MLA[] {
    return this.getMLAs().filter(mla => mla.status === 'ACTIVE');
  }

  // Get unassigned constituencies (no MLA assigned)
  getUnassignedConstituencies(): Constituency[] {
    const assignedConstituencyIds = new Set(
      this.getMLAs().map(mla => mla.constituency_id)
    );
    return this.getConstituencies().filter(
      constituency => !assignedConstituencyIds.has(constituency.id)
    );
  }

  // Get constituency with MLA info
  getConstituencyWithMLA(constituencyId: string): (Constituency & { mla?: MLA }) | undefined {
    const constituency = this.getConstituencyById(constituencyId);
    if (!constituency) return undefined;

    const mla = this.getMLAsByConstituency(constituencyId)[0];
    return { ...constituency, mla };
  }

  // Get MLA with constituency and party info
  getMLAWithDetails(mlaId: string): (MLA & { constituency?: Constituency; party?: Party }) | undefined {
    const mla = this.getMLAById(mlaId);
    if (!mla) return undefined;

    const constituency = this.getConstituencyById(mla.constituency_id);
    const party = this.getPartyById(mla.party_id);
    return { ...mla, constituency, party };
  }

  // Check if data is stale
  isDataStale(entity: string, maxAgeMinutes: number = 5): boolean {
    const lastUpdated = this.store.lastUpdated[entity];
    if (!lastUpdated) return true;

    const ageMs = Date.now() - new Date(lastUpdated).getTime();
    return ageMs > maxAgeMinutes * 60 * 1000;
  }

  // Clear all data
  clearAll(): void {
    this.updateStore(initialDataStore);
  }
}

// Global data manager instance
export const dataManager = new DataManager();



