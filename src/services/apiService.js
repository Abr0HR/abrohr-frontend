/**
 * API Service Layer for AbrO HR
 * Centralized API communication using fetch API
 * Supports: Authentication, User Management, Attendance Tracking
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.abrohr.com';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }
  return await response.json();
};

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Helper function to set auth headers
const getHeaders = (includeAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

/**
 * Authentication API Endpoints
 */
export const authAPI = {
  // Employee login
  loginEmployee: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(response);
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  // Employee registration
  registerEmployee: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/employee`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  },

  // Company registration
  registerCompany: async (companyData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/company`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(companyData),
    });
    return await handleResponse(response);
  },

  // Request password reset
  requestPasswordReset: async (email) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email }),
    });
    return await handleResponse(response);
  },

  // Reset password with token
  resetPassword: async (email, token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, token, newPassword }),
    });
    return await handleResponse(response);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getAuthToken();
  },
};

/**
 * User API Endpoints
 */
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });
    return await handleResponse(response);
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/api/users/change-password`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return await handleResponse(response);
  },
};

/**
 * Attendance API Endpoints
 */
export const attendanceAPI = {
  // Check in
  checkIn: async () => {
    const response = await fetch(`${API_BASE_URL}/api/attendance/check-in`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  },

  // Check out
  checkOut: async () => {
    const response = await fetch(`${API_BASE_URL}/api/attendance/check-out`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  },

  // Get attendance history
  getAttendanceHistory: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/api/attendance/history?${queryParams}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  },

  // Get attendance summary
  getAttendanceSummary: async (month, year) => {
    const response = await fetch(
      `${API_BASE_URL}/api/attendance/summary?month=${month}&year=${year}`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    );
    return await handleResponse(response);
  },
};

/**
 * Company API Endpoints
 */
export const companyAPI = {
  // Get company details
  getDetails: async () => {
    const response = await fetch(`${API_BASE_URL}/api/company/details`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  },

  // Get company employees
  getEmployees: async (filters = {}) => {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(
      `${API_BASE_URL}/api/company/employees?${queryParams}`,
      {
        method: 'GET',
        headers: getHeaders(true),
      }
    );
    return await handleResponse(response);
  },

  // Get company statistics
  getStatistics: async () => {
    const response = await fetch(`${API_BASE_URL}/api/company/statistics`, {
      method: 'GET',
      headers: getHeaders(true),
    });
    return await handleResponse(response);
  },
};

export default {
  authAPI,
  userAPI,
  attendanceAPI,
  companyAPI,
};
