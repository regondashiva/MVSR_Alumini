// API Configuration for MVSR Alumni Portal
const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8082',
  LEGACY_BASE_URL: process.env.REACT_APP_LEGACY_API_URL || 'http://localhost:8082',
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    AUTH: {
      LOGIN: '/api/v1/auth/login',
      REGISTER: '/api/v1/auth/register',
      LOGOUT: '/api/v1/auth/logout',
      PROFILE: '/api/v1/users/profile',
      UPDATE_PROFILE: '/api/v1/users/profile',
      CHANGE_PASSWORD: '/api/v1/users/change-password',
      FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
      RESET_PASSWORD: '/api/v1/auth/reset-password',
      VERIFY_EMAIL: '/api/v1/auth/verify-email',
      REFRESH_TOKEN: '/api/v1/users/refresh-token',
      
      // Legacy endpoints
      LEGACY_LOGIN: '/api/auth/login',
      LEGACY_REGISTER: '/api/auth/register',
      LEGACY_LOGOUT: '/api/auth/logout',
      LEGACY_PROFILE: '/api/users/profile',
      LEGACY_UPDATE_PROFILE: '/api/users/profile',
    },
    
    // Alumni
    ALUMNI: {
      DIRECTORY: '/api/v1/alumni/directory',
      SEARCH: '/api/v1/alumni/search',
      PROFILE: '/api/v1/alumni/:id',
      UPDATE_PROFILE: '/api/v1/alumni/:id',
      CONNECTIONS: '/api/v1/alumni/connections',
      CONNECT: '/api/v1/alumni/:id/connect',
      DISCONNECT: '/api/v1/alumni/:id/disconnect',
      STATS: '/api/v1/alumni/stats',
      
      // Legacy endpoints
      LEGACY_DIRECTORY: '/api/alumni/approved',
      LEGACY_SEARCH: '/api/alumni/search',
    },
    
    // Events
    EVENTS: {
      LIST: '/api/v1/events',
      DETAIL: '/api/v1/events/:id',
      CREATE: '/api/v1/events',
      UPDATE: '/api/v1/events/:id',
      DELETE: '/api/v1/events/:id',
      REGISTER: '/api/v1/events/:id/register',
      UNREGISTER: '/api/v1/events/:id/unregister',
      MY_EVENTS: '/api/v1/events/my',
      STATS: '/api/v1/events/stats',
      
      // Legacy endpoints
      LEGACY_LIST: '/api/events',
      LEGACY_DETAIL: '/api/events/:id',
    },
    
    // Jobs
    JOBS: {
      LIST: '/api/v1/jobs',
      DETAIL: '/api/v1/jobs/:id',
      CREATE: '/api/v1/jobs',
      UPDATE: '/api/v1/jobs/:id',
      DELETE: '/api/v1/jobs/:id',
      APPLY: '/api/v1/jobs/:id/apply',
      MY_JOBS: '/api/v1/jobs/my',
      APPLICATIONS: '/api/v1/jobs/applications',
      
      // Legacy endpoints
      LEGACY_LIST: '/api/jobs',
      LEGACY_DETAIL: '/api/jobs/:id',
    },
    
    // News
    NEWS: {
      LIST: '/api/v1/news',
      DETAIL: '/api/v1/news/:id',
      CREATE: '/api/v1/news',
      UPDATE: '/api/v1/news/:id',
      DELETE: '/api/v1/news/:id',
      LIKE: '/api/v1/news/:id/like',
      UNLIKE: '/api/v1/news/:id/unlike',
      COMMENTS: '/api/v1/news/:id/comments',
      
      // Legacy endpoints
      LEGACY_LIST: '/api/news',
      LEGACY_DETAIL: '/api/news/:id',
    },
    
    // Gallery
    GALLERY: {
      LIST: '/api/v1/gallery',
      DETAIL: '/api/v1/gallery/:id',
      CREATE: '/api/v1/gallery',
      UPDATE: '/api/v1/gallery/:id',
      DELETE: '/api/v1/gallery/:id',
      LIKE: '/api/v1/gallery/:id/like',
      UNLIKE: '/api/v1/gallery/:id/unlike',
      
      // Legacy endpoints
      LEGACY_LIST: '/api/gallery',
      LEGACY_DETAIL: '/api/gallery/:id',
    },
    
    // Admin
    ADMIN: {
      USERS: '/api/v1/admin/users',
      USER_DETAIL: '/api/v1/admin/users/:id',
      UPDATE_USER: '/api/v1/admin/users/:id',
      DELETE_USER: '/api/v1/admin/users/:id',
      VERIFY_USER: '/api/v1/admin/users/:id/verify',
      DEACTIVATE_USER: '/api/v1/admin/users/:id/deactivate',
      ACTIVATE_USER: '/api/v1/admin/users/:id/activate',
      PENDING_REGISTRATIONS: '/api/v1/admin/pending-registrations',
      APPROVE_REGISTRATION: '/api/v1/admin/approve-registration/:id',
      REJECT_REGISTRATION: '/api/v1/admin/reject-registration/:id',
      STATS: '/api/v1/admin/stats',
      LOGS: '/api/v1/admin/logs',
      BACKUP: '/api/v1/admin/backup',
      RESTORE: '/api/v1/admin/restore',
    },
  },
  
  // Helper function to get full URL
  getUrl: (endpoint, params = {}) => {
    let url = endpoint;
    
    // Replace path parameters
    Object.keys(params).forEach(key => {
      url = url.replace(`:${key}`, params[key]);
    });
    
    return url;
  },
  
  // Helper function to get headers
  getHeaders: (includeAuth = true, contentType = 'application/json') => {
    const headers = {};
    
    if (contentType) {
      headers['Content-Type'] = contentType;
    }
    
    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  },
  
  // Helper function to make API requests with fallback
  request: async (endpoint, options = {}) => {
    const {
      method = 'GET',
      headers = {},
      body = null,
      params = {},
      useLegacyFallback = true,
      timeout = 10000
    } = options;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      // Try primary endpoint first
      let url = API_CONFIG.getUrl(endpoint, params);
      let response = await fetch(url, {
        method,
        headers: { ...API_CONFIG.getHeaders(true), ...headers },
        body,
        signal: controller.signal
      });
      
      // If primary fails and legacy fallback is enabled, try legacy endpoint
      if (!response.ok && useLegacyFallback && endpoint.includes('/v1/')) {
        const legacyEndpoint = endpoint.replace('/v1/', '/');
        url = API_CONFIG.getUrl(legacyEndpoint, params);
        response = await fetch(url, {
          method,
          headers: { ...API_CONFIG.getHeaders(true), ...headers },
          body,
          signal: controller.signal
        });
      }
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  },
  
  // Specific API methods
  api: {
    // Authentication
    auth: {
      login: (credentials) => API_CONFIG.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
      
      register: (userData) => API_CONFIG.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
      
      getProfile: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.AUTH.PROFILE),
      
      updateProfile: (profileData) => API_CONFIG.request(API_CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),
      
      logout: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST'
      }),
    },
    
    // Alumni
    alumni: {
      getDirectory: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.ALUMNI.DIRECTORY),
      
      search: (query) => API_CONFIG.request(API_CONFIG.ENDPOINTS.ALUMNI.SEARCH, {
        method: 'POST',
        body: JSON.stringify(query)
      }),
      
      getProfile: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.ALUMNI.PROFILE, {
        params: { id }
      }),
      
      getConnections: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.ALUMNI.CONNECTIONS),
      
      connect: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.ALUMNI.CONNECT, {
        method: 'POST',
        params: { id }
      }),
      
      disconnect: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.ALUMNI.DISCONNECT, {
        method: 'POST',
        params: { id }
      }),
    },
    
    // Events
    events: {
      getList: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.EVENTS.LIST),
      
      getDetail: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.EVENTS.DETAIL, {
        params: { id }
      }),
      
      getMyEvents: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.EVENTS.MY_EVENTS),
      
      register: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.EVENTS.REGISTER, {
        method: 'POST',
        params: { id }
      }),
      
      unregister: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.EVENTS.UNREGISTER, {
        method: 'POST',
        params: { id }
      }),
    },
    
    // Jobs
    jobs: {
      getList: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.JOBS.LIST),
      
      getDetail: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.JOBS.DETAIL, {
        params: { id }
      }),
      
      getMyJobs: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.JOBS.MY_JOBS),
      
      getApplications: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.JOBS.APPLICATIONS),
      
      apply: (id, applicationData) => API_CONFIG.request(API_CONFIG.ENDPOINTS.JOBS.APPLY, {
        method: 'POST',
        params: { id },
        body: JSON.stringify(applicationData)
      }),
    },
    
    // News
    news: {
      getList: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.NEWS.LIST),
      
      getDetail: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.NEWS.DETAIL, {
        params: { id }
      }),
      
      like: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.NEWS.LIKE, {
        method: 'POST',
        params: { id }
      }),
      
      unlike: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.NEWS.UNLIKE, {
        method: 'POST',
        params: { id }
      }),
    },
    
    // Gallery
    gallery: {
      getList: () => API_CONFIG.request(API_CONFIG.ENDPOINTS.GALLERY.LIST),
      
      getDetail: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.GALLERY.DETAIL, {
        params: { id }
      }),
      
      like: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.GALLERY.LIKE, {
        method: 'POST',
        params: { id }
      }),
      
      unlike: (id) => API_CONFIG.request(API_CONFIG.ENDPOINTS.GALLERY.UNLIKE, {
        method: 'POST',
        params: { id }
      }),
    },
  }
};

export default API_CONFIG;
