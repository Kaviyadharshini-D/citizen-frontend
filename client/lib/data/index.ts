// client/lib/data/index.ts
// Centralized data management exports

// Core types
export * from './types';

// Data management
export { dataManager, DataManager } from './store';
export { apiService, ApiService } from './api';
export { dataSyncService, DataSyncService, useDataSync } from './sync';
export { dataInitializer, DataInitializer, useDataInitialization } from './init';

// React hooks
export * from '../../hooks/useData';

// Legacy data compatibility
export { convertToLegacyFormat as convertConstituenciesToLegacy } from '../../data/adminConstituencyData';
export { convertToLegacyFormat as convertMLAsToLegacy } from '../../data/adminMlaData';
export { convertToLegacyFormat as convertDashboardToLegacy } from '../../data/adminDashboardData';

// Utility functions
export const dataUtils = {
  // Format dates
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  },

  // Format numbers with Indian numbering system
  formatNumber: (num: number): string => {
    return new Intl.NumberFormat('en-IN').format(num);
  },

  // Format currency
  formatCurrency: (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  },

  // Calculate percentage
  calculatePercentage: (value: number, total: number): number => {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  },

  // Generate unique ID
  generateId: (prefix: string = 'id'): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate email
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number (Indian format)
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },

  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },
};

// Data validation schemas
export const validationSchemas = {
  constituency: {
    name: { required: true, minLength: 2, maxLength: 100 },
    code: { required: true, pattern: /^[A-Z]{3}\d{3}$/ },
    district: { required: true, minLength: 2, maxLength: 50 },
    population: { required: true, min: 1, max: 10000000 },
  },
  mla: {
    name: { required: true, minLength: 2, maxLength: 100 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    phone: { required: false, pattern: /^(\+91|91)?[6-9]\d{9}$/ },
    party_id: { required: true },
    constituency_id: { required: true },
    term_start: { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
    term_end: { required: true, pattern: /^\d{4}-\d{2}-\d{2}$/ },
  },
  party: {
    name: { required: true, minLength: 2, maxLength: 100 },
    abbreviation: { required: true, minLength: 2, maxLength: 10 },
    color: { required: true, pattern: /^#[0-9A-F]{6}$/i },
  },
};

// Data transformation utilities
export const dataTransformers = {
  // Transform MLA data for display
  transformMLAForDisplay: (mla: any, parties: any[], constituencies: any[]) => {
    const party = parties.find(p => p.id === mla.party_id);
    const constituency = constituencies.find(c => c.id === mla.constituency_id);
    
    return {
      ...mla,
      party_name: party?.name || 'Unknown',
      party_abbreviation: party?.abbreviation || 'N/A',
      party_color: party?.color || '#666666',
      constituency_name: constituency?.name || 'Unassigned',
      constituency_code: constituency?.code || 'N/A',
      term_display: `${mla.term_start.split('-')[0]}-${mla.term_end.split('-')[0]}`,
      status_display: mla.status.charAt(0) + mla.status.slice(1).toLowerCase(),
    };
  },

  // Transform constituency data for display
  transformConstituencyForDisplay: (constituency: any, mlas: any[]) => {
    const assignedMLA = mlas.find(m => m.constituency_id === constituency.id);
    
    return {
      ...constituency,
      mla_name: assignedMLA?.name || 'Unassigned',
      mla_email: assignedMLA?.email || null,
      mla_status: assignedMLA?.status || null,
      reserved_category_display: constituency.reserved_category === 'GENERAL' ? 'General' : constituency.reserved_category,
      population_display: dataUtils.formatNumber(constituency.population),
      area_display: constituency.area_km2 ? `${constituency.area_km2} km²` : 'N/A',
    };
  },

  // Transform dashboard stats for display
  transformDashboardStatsForDisplay: (stats: any) => {
    return {
      ...stats,
      total_constituencies_display: dataUtils.formatNumber(stats.total_constituencies),
      total_mlas_display: dataUtils.formatNumber(stats.total_mlas),
      total_issues_display: dataUtils.formatNumber(stats.total_issues),
      total_users_display: dataUtils.formatNumber(stats.total_users),
      resolution_rate: dataUtils.calculatePercentage(stats.resolved_issues, stats.total_issues),
      active_user_rate: dataUtils.calculatePercentage(stats.active_users, stats.total_users),
    };
  },
};

// Export default data management instance
export default {
  manager: dataManager,
  api: apiService,
  sync: dataSyncService,
  init: dataInitializer,
  utils: dataUtils,
  validation: validationSchemas,
  transformers: dataTransformers,
};



