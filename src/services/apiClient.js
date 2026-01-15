// AbrO HR API Client Service
// Connects frontend to production backend API
// Handles authentication, requests, and error handling

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://abrohr-backend.railway.app';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('authToken');
    this.user = JSON.parse(localStorage.getItem('user') || 'null');
  }

  // ============ AUTHENTICATION ============
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) throw new Error('Login failed');
      const data = await response.json();
      this.token = data.token;
      this.user = data.user;
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(email, password, name, companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, company_id: companyId })
      });
      if (!response.ok) throw new Error('Registration failed');
      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // ============ EMPLOYEES ============
  async getEmployees(companyId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees?company_id=${companyId}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch employees');
      return await response.json();
    } catch (error) {
      console.error('Fetch employees error:', error);
      throw error;
    }
  }

  async getEmployee(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees/${id}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch employee');
      return await response.json();
    } catch (error) {
      console.error('Fetch employee error:', error);
      throw error;
    }
  }

  async createEmployee(employeeData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify(employeeData)
      });
      if (!response.ok) throw new Error('Failed to create employee');
      return await response.json();
    } catch (error) {
      console.error('Create employee error:', error);
      throw error;
    }
  }

  // ============ ATTENDANCE ============
  async markAttendance(employeeId, status = 'present', mode = 'office', remarks = '') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/mark`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify({ employee_id: employeeId, status, mode, remarks })
      });
      if (!response.ok) throw new Error('Failed to mark attendance');
      return await response.json();
    } catch (error) {
      console.error('Mark attendance error:', error);
      throw error;
    }
  }

  async getAttendance(employeeId, month, year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/${employeeId}?month=${month}&year=${year}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch attendance');
      return await response.json();
    } catch (error) {
      console.error('Fetch attendance error:', error);
      throw error;
    }
  }

  async getAttendanceSummary(employeeId, year) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/attendance/summary/${employeeId}?year=${year}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch summary');
      return await response.json();
    } catch (error) {
      console.error('Fetch attendance summary error:', error);
      throw error;
    }
  }

  // ============ LEAVES ============
  async applyLeave(employeeId, leaveType, fromDate, toDate, reason) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/apply`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify({ employee_id: employeeId, leave_type: leaveType, from_date: fromDate, to_date: toDate, reason })
      });
      if (!response.ok) throw new Error('Failed to apply leave');
      return await response.json();
    } catch (error) {
      console.error('Apply leave error:', error);
      throw error;
    }
  }

  async getLeaves(employeeId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/${employeeId}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch leaves');
      return await response.json();
    } catch (error) {
      console.error('Fetch leaves error:', error);
      throw error;
    }
  }

  async approveLeave(leaveId, approvedBy) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/${leaveId}/approve`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify({ approved_by: approvedBy })
      });
      if (!response.ok) throw new Error('Failed to approve leave');
      return await response.json();
    } catch (error) {
      console.error('Approve leave error:', error);
      throw error;
    }
  }

  async rejectLeave(leaveId, rejectionReason, approvedBy) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaves/${leaveId}/reject`, {
        method: 'PATCH',
        headers: this._getHeaders(),
        body: JSON.stringify({ rejection_reason: rejectionReason, approved_by: approvedBy })
      });
      if (!response.ok) throw new Error('Failed to reject leave');
      return await response.json();
    } catch (error) {
      console.error('Reject leave error:', error);
      throw error;
    }
  }

  // ============ REGULARIZATIONS ============
  async applyRegularization(employeeId, attendanceId, reason) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/regularizations/apply`, {
        method: 'POST',
        headers: this._getHeaders(),
        body: JSON.stringify({ employee_id: employeeId, attendance_id: attendanceId, reason })
      });
      if (!response.ok) throw new Error('Failed to apply regularization');
      return await response.json();
    } catch (error) {
      console.error('Apply regularization error:', error);
      throw error;
    }
  }

  async getRegularizations(companyId, status = 'pending') {
    try {
      const response = await fetch(`${API_BASE_URL}/api/regularizations?company_id=${companyId}&status=${status}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch regularizations');
      return await response.json();
    } catch (error) {
      console.error('Fetch regularizations error:', error);
      throw error;
    }
  }

  // ============ COMPANIES ============
  async registerCompany(name, email, phone, address, industry) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address, industry })
      });
      if (!response.ok) throw new Error('Failed to register company');
      return await response.json();
    } catch (error) {
      console.error('Register company error:', error);
      throw error;
    }
  }

  async getCompany(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
        headers: this._getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch company');
      return await response.json();
    } catch (error) {
      console.error('Fetch company error:', error);
      throw error;
    }
  }

  // ============ HEALTH CHECKS ============
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // ============ HELPER METHODS ============
  _getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getUser() {
    return this.user;
  }
}

// Export singleton instance
export default new APIClient();
