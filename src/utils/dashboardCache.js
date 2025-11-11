// Dashboard cache utility - shared cache management
const dashboardCache = {
  data: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Clear the dashboard cache
export const clearDashboardCache = () => {
  dashboardCache.data = null;
  dashboardCache.timestamp = null;
};

// Get the cache object (for reading)
export const getDashboardCache = () => {
  return dashboardCache;
};

// Set cache data
export const setDashboardCache = (data) => {
  dashboardCache.data = data;
  dashboardCache.timestamp = Date.now();
};

