// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token management
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const getUser = (): any => {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const setUser = (user: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// API request helper
async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = getToken();

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only add Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    (headers as any)['Content-Type'] = 'application/json';
  }

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - clear token (but don't auto-redirect to prevent loops)
  if (response.status === 401) {
    // Only clear token if this wasn't a login/register attempt
    if (!endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      removeToken();
    }
    const error = await response.json().catch(() => ({ detail: 'Session expired' }));
    throw new Error(error.detail || 'Session expired. Please login again.');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
}


// Auth API
export const authAPI = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    roll_number?: string;
    department?: string;
    year?: number;
    semester?: number;
  }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getMe: async () => {
    return apiRequest('/api/auth/me');
  },
};

// Projects API
export const projectsAPI = {
  upload: async (file: File, title: string, year?: number, semester?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (year) formData.append('year', year.toString());
    if (semester) formData.append('semester', semester.toString());

    return apiRequest('/api/projects/upload', {
      method: 'POST',
      body: formData,
    });
  },

  getMyProjects: async () => {
    return apiRequest('/api/projects/my-projects');
  },

  getProject: async (id: number) => {
    return apiRequest(`/api/projects/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getAllProjects: async () => {
    return apiRequest('/api/admin/projects');
  },

  updateProjectStatus: async (projectId: number, status: string) => {
    const formData = new FormData();
    formData.append('status', status);

    return apiRequest(`/api/admin/projects/${projectId}/status`, {
      method: 'PATCH',
      body: formData,
    });
  },

  getStats: async () => {
    return apiRequest('/api/admin/stats');
  },

  getAllUsers: async () => {
    return apiRequest('/api/admin/users');
  },

  // Data Warehouse APIs
  getWarehouseProjects: async () => {
    return apiRequest('/api/admin/warehouse/projects');
  },

  uploadToWarehouse: async (file: File, title: string, department?: string, year?: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (department) formData.append('department', department);
    if (year) formData.append('year', year.toString());

    return apiRequest('/api/admin/warehouse/upload', {
      method: 'POST',
      body: formData,
    });
  },

  deleteWarehouseProject: async (projectId: number) => {
    return apiRequest(`/api/admin/warehouse/${projectId}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const healthCheck = async () => {
  return apiRequest('/api/health');
};
