// =====================================================
// CLOUDINARY USAGE TRACKING & ANALYTICS
// =====================================================

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

// =====================================================
// TYPES & INTERFACES
// =====================================================

export interface CloudinaryUsage {
  plan: string;
  objects: {
    used: number;
    limit: number;
    reset_at: string;
  };
  bandwidth: {
    used: number;
    limit: number;
    reset_at: string;
  };
  storage: {
    used: number;
    limit: number;
  };
  requests: {
    used: number;
    limit: number;
    reset_at: string;
  };
  resources: {
    used: number;
    limit: number;
  };
  derived_resources: {
    used: number;
    limit: number;
  };
  transformations: {
    used: number;
    limit: number;
    reset_at: string;
  };
  video_encoding: {
    used: number;
    limit: number;
    reset_at: string;
  };
}

export interface CloudinaryAnalytics {
  total_requests: number;
  total_bandwidth: number;
  total_storage: number;
  total_resources: number;
  total_derived_resources: number;
  total_transformations: number;
  total_video_encoding: number;
  date_range: {
    start: string;
    end: string;
  };
}

export interface CloudinaryResource {
  public_id: string;
  format: string;
  version: number;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  url: string;
  secure_url: string;
  folder: string;
  tags: string[];
}

// =====================================================
// USAGE TRACKING FUNCTIONS
// =====================================================

/**
 * Lấy thông tin usage hiện tại của Cloudinary account
 */
export const getCloudinaryUsage = async (): Promise<CloudinaryUsage> => {
  try {
    const result = await cloudinary.api.usage();
    return result;
  } catch (error) {
    console.error('Error fetching Cloudinary usage:', error);
    throw error;
  }
};

/**
 * Lấy analytics chi tiết theo thời gian
 */
export const getCloudinaryAnalytics = async (
  startDate: string,
  endDate: string
): Promise<CloudinaryAnalytics> => {
  try {
    const result = await cloudinary.api.usage({
      start_date: startDate,
      end_date: endDate,
    });
    return result;
  } catch (error) {
    console.error('Error fetching Cloudinary analytics:', error);
    throw error;
  }
};

/**
 * Lấy danh sách resources với pagination
 */
export const getCloudinaryResources = async (
  options: {
    max_results?: number;
    next_cursor?: string;
    folder?: string;
    tags?: string[];
    resource_type?: 'image' | 'video' | 'raw';
  } = {}
): Promise<{
  resources: CloudinaryResource[];
  next_cursor?: string;
  total_count: number;
}> => {
  try {
    const result = await cloudinary.api.resources({
      max_results: options.max_results || 50,
      next_cursor: options.next_cursor,
      folder: options.folder,
      tags: options.tags,
      resource_type: options.resource_type || 'image',
    });
    return result;
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error);
    throw error;
  }
};

/**
 * Tính toán phần trăm sử dụng
 */
export const calculateUsagePercentage = (used: number, limit: number): number => {
  if (limit === 0) return 0;
  return Math.round((used / limit) * 100);
};

/**
 * Format bytes thành human readable
 */
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Format number với separator
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

/**
 * Kiểm tra warning threshold (80% usage)
 */
export const getUsageStatus = (percentage: number): {
  status: 'safe' | 'warning' | 'danger';
  color: string;
  message: string;
} => {
  if (percentage >= 90) {
    return {
      status: 'danger',
      color: '#ff4d4f',
      message: 'Nguy hiểm - Gần hết quota!'
    };
  } else if (percentage >= 80) {
    return {
      status: 'warning',
      color: '#faad14',
      message: 'Cảnh báo - Sắp hết quota'
    };
  } else {
    return {
      status: 'safe',
      color: '#52c41a',
      message: 'An toàn'
    };
  }
};

// =====================================================
// CACHING & OPTIMIZATION
// =====================================================

// Cache usage data for 5 minutes
let usageCache: {
  data: CloudinaryUsage | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Lấy usage với cache
 */
export const getCachedUsage = async (): Promise<CloudinaryUsage> => {
  const now = Date.now();
  
  if (usageCache.data && (now - usageCache.timestamp) < CACHE_DURATION) {
    return usageCache.data;
  }
  
  const usage = await getCloudinaryUsage();
  usageCache = {
    data: usage,
    timestamp: now,
  };
  
  return usage;
};

/**
 * Clear cache
 */
export const clearUsageCache = (): void => {
  usageCache = {
    data: null,
    timestamp: 0,
  };
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Lấy thông tin plan hiện tại
 */
export const getCurrentPlan = (usage: CloudinaryUsage): {
  name: string;
  limits: {
    storage: string;
    bandwidth: string;
    requests: string;
    transformations: string;
  };
} => {
  const planLimits = {
    'Free': {
      storage: '25 GB',
      bandwidth: '25 GB',
      requests: '25,000',
      transformations: '25,000',
    },
    'Plus': {
      storage: '100 GB',
      bandwidth: '100 GB',
      requests: '100,000',
      transformations: '100,000',
    },
    'Advanced': {
      storage: '500 GB',
      bandwidth: '500 GB',
      requests: '500,000',
      transformations: '500,000',
    },
    'Enterprise': {
      storage: 'Unlimited',
      bandwidth: 'Unlimited',
      requests: 'Unlimited',
      transformations: 'Unlimited',
    },
  };
  
  return {
    name: usage.plan,
    limits: planLimits[usage.plan as keyof typeof planLimits] || planLimits['Free'],
  };
};

/**
 * Tính toán cost estimation
 */
export const calculateCostEstimation = (usage: CloudinaryUsage): {
  currentCost: number;
  projectedCost: number;
  overageCost: number;
} => {
  const planCosts = {
    'Free': 0,
    'Plus': 89,
    'Advanced': 179,
    'Enterprise': 500,
  };
  
  const currentCost = planCosts[usage.plan as keyof typeof planCosts] || 0;
  
  // Tính overage costs
  const overageCost = Math.max(0, 
    (usage.bandwidth.used - usage.bandwidth.limit) * 0.1 + // $0.10 per GB overage
    (usage.requests.used - usage.requests.limit) * 0.001   // $0.001 per 1K requests overage
  );
  
  const projectedCost = currentCost + overageCost;
  
  return {
    currentCost,
    projectedCost,
    overageCost,
  };
};

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

export default {
  getCloudinaryUsage,
  getCloudinaryAnalytics,
  getCloudinaryResources,
  getCachedUsage,
  clearUsageCache,
  calculateUsagePercentage,
  formatBytes,
  formatNumber,
  getUsageStatus,
  getCurrentPlan,
  calculateCostEstimation,
};
