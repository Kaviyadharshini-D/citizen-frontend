// client/lib/data/sync.ts
// Data synchronization service for real-time updates

import { dataManager } from "./store";
import { apiService } from "./api";
import {
  Constituency,
  MLA,
  Party,
  DashboardStats,
  ConstituencyStats,
  MLAStats,
} from "./types";
import { useEffect, useState } from "react";

export interface SyncConfig {
  enabled: boolean;
  intervalMs: number;
  entities: string[];
  onError?: (error: Error) => void;
  onSuccess?: (entity: string) => void;
}

export class DataSyncService {
  private config: SyncConfig;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(config: Partial<SyncConfig> = {}) {
    this.config = {
      enabled: true,
      intervalMs: 30000, // 30 seconds
      entities: ["constituencies", "mlas", "parties", "dashboardStats"],
      ...config,
    };
  }

  start(): void {
    if (this.isRunning || !this.config.enabled) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.syncData();
    }, this.config.intervalMs);

    // Initial sync
    this.syncData();
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  private async syncData(): Promise<void> {
    const promises = this.config.entities.map((entity) =>
      this.syncEntity(entity),
    );

    try {
      await Promise.allSettled(promises);
    } catch (error) {
      console.error("Data sync failed:", error);
      this.config.onError?.(error as Error);
    }
  }

  private async syncEntity(entity: string): Promise<void> {
    try {
      switch (entity) {
        case "constituencies":
          await this.syncConstituencies();
          break;
        case "mlas":
          await this.syncMLAs();
          break;
        case "parties":
          await this.syncParties();
          break;
        case "dashboardStats":
          await this.syncDashboardStats();
          break;
        case "constituencyStats":
          await this.syncConstituencyStats();
          break;
        case "mlaStats":
          await this.syncMLAStats();
          break;
      }

      this.config.onSuccess?.(entity);
    } catch (error) {
      console.error(`Failed to sync ${entity}:`, error);
      this.config.onError?.(error as Error);
    }
  }

  private async syncConstituencies(): Promise<void> {
    const response = await apiService.getConstituencies();
    if (response.success) {
      dataManager.setConstituencies(response.data.data);
    }
  }

  private async syncMLAs(): Promise<void> {
    const response = await apiService.getMLAs();
    if (response.success) {
      dataManager.setMLAs(response.data.data);
    }
  }

  private async syncParties(): Promise<void> {
    const response = await apiService.getParties();
    if (response.success) {
      dataManager.setParties(response.data);
    }
  }

  private async syncDashboardStats(): Promise<void> {
    const response = await apiService.getDashboardStats();
    if (response.success) {
      dataManager.setDashboardStats(response.data);
    }
  }

  private async syncConstituencyStats(): Promise<void> {
    const response = await apiService.getAllConstituencyStats();
    if (response.success) {
      dataManager.setConstituencyStats(response.data);
    }
  }

  private async syncMLAStats(): Promise<void> {
    const response = await apiService.getAllMLAStats();
    if (response.success) {
      dataManager.setMLAStats(response.data);
    }
  }

  // Manual sync methods
  async syncConstituenciesNow(): Promise<void> {
    await this.syncConstituencies();
  }

  async syncMLAsNow(): Promise<void> {
    await this.syncMLAs();
  }

  async syncPartiesNow(): Promise<void> {
    await this.syncParties();
  }

  async syncDashboardStatsNow(): Promise<void> {
    await this.syncDashboardStats();
  }

  // Update configuration
  updateConfig(newConfig: Partial<SyncConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  // Get current status
  getStatus(): { isRunning: boolean; config: SyncConfig } {
    return {
      isRunning: this.isRunning,
      config: { ...this.config },
    };
  }
}

// Global sync service instance
export const dataSyncService = new DataSyncService({
  enabled: process.env.NODE_ENV === "production",
  intervalMs: 30000,
  entities: ["constituencies", "mlas", "parties", "dashboardStats"],
  onError: (error) => {
    console.error("Data sync error:", error);
    // Could integrate with error reporting service
  },
  onSuccess: (entity) => {
    console.log(`Successfully synced ${entity}`);
  },
});

// React hook for data synchronization
export function useDataSync(config?: Partial<SyncConfig>) {
  const [isActive, setIsActive] = useState(false);
  const [lastSync, setLastSync] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (config) {
      dataSyncService.updateConfig(config);
    }

    const originalOnSuccess = dataSyncService.config.onSuccess;
    const originalOnError = dataSyncService.config.onError;

    dataSyncService.updateConfig({
      onSuccess: (entity) => {
        setLastSync((prev) => ({
          ...prev,
          [entity]: new Date().toISOString(),
        }));
        originalOnSuccess?.(entity);
      },
      onError: (error) => {
        setErrors((prev) => ({ ...prev, [error.message]: error.message }));
        originalOnError?.(error);
      },
    });

    return () => {
      dataSyncService.updateConfig({
        onSuccess: originalOnSuccess,
        onError: originalOnError,
      });
    };
  }, [config]);

  const startSync = useCallback(() => {
    dataSyncService.start();
    setIsActive(true);
  }, []);

  const stopSync = useCallback(() => {
    dataSyncService.stop();
    setIsActive(false);
  }, []);

  const syncNow = useCallback(async (entity?: string) => {
    if (entity) {
      await dataSyncService.syncEntity(entity);
    } else {
      await dataSyncService.syncData();
    }
  }, []);

  return {
    isActive,
    lastSync,
    errors,
    startSync,
    stopSync,
    syncNow,
    status: dataSyncService.getStatus(),
  };
}
