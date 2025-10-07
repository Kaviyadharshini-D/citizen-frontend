// client/lib/data/init.ts
// Data initialization and setup service

import { dataManager } from './store';
import { dataSyncService } from './sync';
import { apiService } from './api';
import { fetchAdminConstituencies, fetchAdminMLAs, fetchParties } from '../../data/adminMlaData';
import { fetchAdminOverviewData } from '../../data/adminDashboardData';

export interface DataInitConfig {
  enableSync: boolean;
  syncIntervalMs: number;
  autoLoadOnInit: boolean;
  entities: string[];
}

export class DataInitializer {
  private config: DataInitConfig;
  private isInitialized = false;

  constructor(config: Partial<DataInitConfig> = {}) {
    this.config = {
      enableSync: true,
      syncIntervalMs: 30000,
      autoLoadOnInit: true,
      entities: ['constituencies', 'mlas', 'parties', 'dashboardStats'],
      ...config,
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing data management system...');

      // Load initial data
      if (this.config.autoLoadOnInit) {
        await this.loadInitialData();
      }

      // Start data synchronization
      if (this.config.enableSync) {
        dataSyncService.updateConfig({
          enabled: true,
          intervalMs: this.config.syncIntervalMs,
          entities: this.config.entities,
        });
        dataSyncService.start();
      }

      this.isInitialized = true;
      console.log('Data management system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize data management system:', error);
      throw error;
    }
  }

  private async loadInitialData(): Promise<void> {
    const loadPromises = this.config.entities.map(entity => this.loadEntity(entity));
    
    try {
      await Promise.allSettled(loadPromises);
    } catch (error) {
      console.error('Failed to load initial data:', error);
      throw error;
    }
  }

  private async loadEntity(entity: string): Promise<void> {
    try {
      switch (entity) {
        case 'constituencies':
          const constituencies = await fetchAdminConstituencies();
          dataManager.setConstituencies(constituencies);
          break;
        case 'mlas':
          const mlas = await fetchAdminMLAs();
          dataManager.setMLAs(mlas);
          break;
        case 'parties':
          const parties = await fetchParties();
          dataManager.setParties(parties);
          break;
        case 'dashboardStats':
          const overviewData = await fetchAdminOverviewData();
          dataManager.setDashboardStats(overviewData.dashboardStats);
          dataManager.setConstituencyStats(overviewData.constituencyStats);
          dataManager.setMLAStats(overviewData.mlaStats);
          break;
      }
    } catch (error) {
      console.error(`Failed to load ${entity}:`, error);
      dataManager.setError(entity, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  async refreshData(entity?: string): Promise<void> {
    if (entity) {
      await this.loadEntity(entity);
    } else {
      await this.loadInitialData();
    }
  }

  destroy(): void {
    dataSyncService.stop();
    dataManager.clearAll();
    this.isInitialized = false;
    console.log('Data management system destroyed');
  }

  getStatus(): { isInitialized: boolean; config: DataInitConfig } {
    return {
      isInitialized: this.isInitialized,
      config: { ...this.config },
    };
  }
}

// Global data initializer instance
export const dataInitializer = new DataInitializer({
  enableSync: process.env.NODE_ENV === 'production',
  syncIntervalMs: 30000,
  autoLoadOnInit: true,
  entities: ['constituencies', 'mlas', 'parties', 'dashboardStats'],
});

// React hook for data initialization
export function useDataInitialization(config?: Partial<DataInitConfig>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (config) {
          dataInitializer.updateConfig(config);
        }
        
        await dataInitializer.initialize();
        setIsInitialized(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Data initialization failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();

    return () => {
      // Cleanup on unmount
      dataInitializer.destroy();
    };
  }, [config]);

  const refreshData = useCallback(async (entity?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await dataInitializer.refreshData(entity);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isInitialized,
    isLoading,
    error,
    refreshData,
    status: dataInitializer.getStatus(),
  };
}



