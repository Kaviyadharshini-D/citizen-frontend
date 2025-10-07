// client/hooks/useData.ts
// React hooks for data management with automatic synchronization

import { useState, useEffect, useCallback, useMemo } from 'react';
import { dataManager, DataStore } from '../lib/data/store';
import { apiService } from '../lib/data/api';
import { 
  Constituency, 
  MLA, 
  Party, 
  DashboardStats,
  ConstituencyStats,
  MLAStats,
  QueryParams,
  CreateConstituencyData,
  UpdateConstituencyData,
  CreateMLAData,
  UpdateMLAData
} from '../lib/data/types';

// Generic hook for subscribing to data store
export function useDataStore(): DataStore {
  const [store, setStore] = useState<DataStore>(dataManager.getStore());

  useEffect(() => {
    const unsubscribe = dataManager.subscribe(setStore);
    return unsubscribe;
  }, []);

  return store;
}

// Hook for constituencies
export function useConstituencies() {
  const store = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const constituencies = useMemo(() => store.constituencies, [store.constituencies]);
  const isLoadingData = store.isLoading.constituencies || false;
  const errorData = store.errors.constituencies;

  const fetchConstituencies = useCallback(async (params?: QueryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      dataManager.setLoading('constituencies', true);
      dataManager.setError('constituencies', null);

      const response = await apiService.getConstituencies(params);
      if (response.success) {
        dataManager.setConstituencies(response.data.data);
      } else {
        throw new Error(response.message || 'Failed to fetch constituencies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      dataManager.setError('constituencies', errorMessage);
    } finally {
      setIsLoading(false);
      dataManager.setLoading('constituencies', false);
    }
  }, []);

  const createConstituency = useCallback(async (data: CreateConstituencyData) => {
    try {
      setError(null);
      const response = await apiService.createConstituency(data);
      if (response.success) {
        dataManager.addConstituency(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create constituency');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateConstituency = useCallback(async (id: string, data: UpdateConstituencyData) => {
    try {
      setError(null);
      const response = await apiService.updateConstituency(id, data);
      if (response.success) {
        dataManager.updateConstituency(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update constituency');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteConstituency = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await apiService.deleteConstituency(id);
      if (response.success) {
        dataManager.removeConstituency(id);
      } else {
        throw new Error(response.message || 'Failed to delete constituency');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const bulkDeleteConstituencies = useCallback(async (ids: string[]) => {
    try {
      setError(null);
      const response = await apiService.bulkDeleteConstituencies(ids);
      if (response.success) {
        ids.forEach(id => dataManager.removeConstituency(id));
      } else {
        throw new Error(response.message || 'Failed to delete constituencies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  return {
    constituencies: Object.values(constituencies),
    isLoading: isLoading || isLoadingData,
    error: error || errorData,
    fetchConstituencies,
    createConstituency,
    updateConstituency,
    deleteConstituency,
    bulkDeleteConstituencies,
    getConstituencyById: (id: string) => constituencies[id],
    getConstituenciesByDistrict: (district: string) => 
      Object.values(constituencies).filter(c => c.district === district),
    getUnassignedConstituencies: () => dataManager.getUnassignedConstituencies(),
  };
}

// Hook for MLAs
export function useMLAs() {
  const store = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mlas = useMemo(() => store.mlas, [store.mlas]);
  const isLoadingData = store.isLoading.mlas || false;
  const errorData = store.errors.mlas;

  const fetchMLAs = useCallback(async (params?: QueryParams) => {
    try {
      setIsLoading(true);
      setError(null);
      dataManager.setLoading('mlas', true);
      dataManager.setError('mlas', null);

      const response = await apiService.getMLAs(params);
      if (response.success) {
        dataManager.setMLAs(response.data.data);
      } else {
        throw new Error(response.message || 'Failed to fetch MLAs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      dataManager.setError('mlas', errorMessage);
    } finally {
      setIsLoading(false);
      dataManager.setLoading('mlas', false);
    }
  }, []);

  const createMLA = useCallback(async (data: CreateMLAData) => {
    try {
      setError(null);
      const response = await apiService.createMLA(data);
      if (response.success) {
        dataManager.addMLA(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create MLA');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateMLA = useCallback(async (id: string, data: UpdateMLAData) => {
    try {
      setError(null);
      const response = await apiService.updateMLA(id, data);
      if (response.success) {
        dataManager.updateMLA(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update MLA');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteMLA = useCallback(async (id: string) => {
    try {
      setError(null);
      const response = await apiService.deleteMLA(id);
      if (response.success) {
        dataManager.removeMLA(id);
      } else {
        throw new Error(response.message || 'Failed to delete MLA');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const bulkDeleteMLAs = useCallback(async (ids: string[]) => {
    try {
      setError(null);
      const response = await apiService.bulkDeleteMLAs(ids);
      if (response.success) {
        ids.forEach(id => dataManager.removeMLA(id));
      } else {
        throw new Error(response.message || 'Failed to delete MLAs');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const bulkAssignMLA = useCallback(async (constituencyIds: string[], mlaId: string) => {
    try {
      setError(null);
      const response = await apiService.bulkAssignMLA(constituencyIds, mlaId);
      if (response.success) {
        // Refresh MLAs to get updated assignments
        await fetchMLAs();
      } else {
        throw new Error(response.message || 'Failed to assign MLA');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, [fetchMLAs]);

  return {
    mlas: Object.values(mlas),
    isLoading: isLoading || isLoadingData,
    error: error || errorData,
    fetchMLAs,
    createMLA,
    updateMLA,
    deleteMLA,
    bulkDeleteMLAs,
    bulkAssignMLA,
    getMLAById: (id: string) => mlas[id],
    getMLAsByConstituency: (constituencyId: string) => 
      Object.values(mlas).filter(m => m.constituency_id === constituencyId),
    getMLAsByParty: (partyId: string) => 
      Object.values(mlas).filter(m => m.party_id === partyId),
    getActiveMLAs: () => Object.values(mlas).filter(m => m.status === 'ACTIVE'),
    getMLAWithDetails: (id: string) => dataManager.getMLAWithDetails(id),
  };
}

// Hook for parties
export function useParties() {
  const store = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parties = useMemo(() => store.parties, [store.parties]);
  const isLoadingData = store.isLoading.parties || false;
  const errorData = store.errors.parties;

  const fetchParties = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      dataManager.setLoading('parties', true);
      dataManager.setError('parties', null);

      const response = await apiService.getParties();
      if (response.success) {
        dataManager.setParties(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch parties');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      dataManager.setError('parties', errorMessage);
    } finally {
      setIsLoading(false);
      dataManager.setLoading('parties', false);
    }
  }, []);

  return {
    parties: Object.values(parties),
    isLoading: isLoading || isLoadingData,
    error: error || errorData,
    fetchParties,
    getPartyById: (id: string) => parties[id],
  };
}

// Hook for dashboard stats
export function useDashboardStats() {
  const store = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = store.dashboardStats;
  const isLoadingData = store.isLoading.dashboardStats || false;
  const errorData = store.errors.dashboardStats;

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      dataManager.setLoading('dashboardStats', true);
      dataManager.setError('dashboardStats', null);

      const response = await apiService.getDashboardStats();
      if (response.success) {
        dataManager.setDashboardStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      dataManager.setError('dashboardStats', errorMessage);
    } finally {
      setIsLoading(false);
      dataManager.setLoading('dashboardStats', false);
    }
  }, []);

  return {
    stats,
    isLoading: isLoading || isLoadingData,
    error: error || errorData,
    fetchStats,
  };
}

// Hook for constituency stats
export function useConstituencyStats() {
  const store = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => store.constituencyStats, [store.constituencyStats]);
  const isLoadingData = store.isLoading.constituencyStats || false;
  const errorData = store.errors.constituencyStats;

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      dataManager.setLoading('constituencyStats', true);
      dataManager.setError('constituencyStats', null);

      const response = await apiService.getAllConstituencyStats();
      if (response.success) {
        dataManager.setConstituencyStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch constituency stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      dataManager.setError('constituencyStats', errorMessage);
    } finally {
      setIsLoading(false);
      dataManager.setLoading('constituencyStats', false);
    }
  }, []);

  return {
    stats: Object.values(stats),
    isLoading: isLoading || isLoadingData,
    error: error || errorData,
    fetchStats,
    getStatsByConstituencyId: (id: string) => stats[id],
  };
}

// Hook for MLA stats
export function useMLAStats() {
  const store = useDataStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => store.mlaStats, [store.mlaStats]);
  const isLoadingData = store.isLoading.mlaStats || false;
  const errorData = store.errors.mlaStats;

  const fetchStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      dataManager.setLoading('mlaStats', true);
      dataManager.setError('mlaStats', null);

      const response = await apiService.getAllMLAStats();
      if (response.success) {
        dataManager.setMLAStats(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch MLA stats');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      dataManager.setError('mlaStats', errorMessage);
    } finally {
      setIsLoading(false);
      dataManager.setLoading('mlaStats', false);
    }
  }, []);

  return {
    stats: Object.values(stats),
    isLoading: isLoading || isLoadingData,
    error: error || errorData,
    fetchStats,
    getStatsByMLAId: (id: string) => stats[id],
  };
}

// Hook for automatic data synchronization
export function useDataSync() {
  const store = useDataStore();

  useEffect(() => {
    // Check if data is stale and needs refresh
    const entities = ['constituencies', 'mlas', 'parties', 'dashboardStats'];
    
    entities.forEach(entity => {
      if (dataManager.isDataStale(entity, 5)) { // 5 minutes
        // Trigger refresh based on entity type
        switch (entity) {
          case 'constituencies':
            // This would be called by the component using useConstituencies
            break;
          case 'mlas':
            // This would be called by the component using useMLAs
            break;
          case 'parties':
            // This would be called by the component using useParties
            break;
          case 'dashboardStats':
            // This would be called by the component using useDashboardStats
            break;
        }
      }
    });
  }, [store.lastUpdated]);

  return {
    lastUpdated: store.lastUpdated,
    isLoading: store.isLoading,
    errors: store.errors,
  };
}



