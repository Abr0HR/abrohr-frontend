/**
 * APIService - Centralized backend API integration
 */
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const USE_MOCK = !process.env.REACT_APP_API_URL;

class APIService {
  constructor() {
    this.baseURL = API_BASE;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token || '');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;

    try {
      const response = await fetch(url, { ...options, headers });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // ========== EMPLOYER ENDPOINTS ==========
  async employerLogin(email, password) {
    if (USE_MOCK) return Promise.resolve({
      id: 'emp001', email, company: 'Tech Corp',
      token: 'mock-' + Date.now(),
    });
    return this.request('/employer/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  getEmployees() {
    if (USE_MOCK) return Promise.resolve(
      JSON.parse(localStorage.getItem('allEmployees')) || []
    );
    return this.request('/employer/employees');
  }

  createEmployee(employee) {
    if (USE_MOCK) {
      const emps = JSON.parse(localStorage.getItem('allEmployees')) || [];
      const newEmp = { id: `emp_${Date.now()}`, ...employee };
      emps.push(newEmp);
      localStorage.setItem('allEmployees', JSON.stringify(emps));
      return Promise.resolve(newEmp);
    }
    return this.request('/employer/employees', {
      method: 'POST',
      body: JSON.stringify(employee),
    });
  }

  updateEmployee(id, updates) {
    if (USE_MOCK) {
      const emps = JSON.parse(localStorage.getItem('allEmployees')) || [];
      const emp = emps.find(e => e.id === id);
      if (emp) Object.assign(emp, updates);
      localStorage.setItem('allEmployees', JSON.stringify(emps));
      return Promise.resolve(emp);
    }
    return this.request(`/employer/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  deleteEmployee(id) {
    if (USE_MOCK) {
      const emps = JSON.parse(localStorage.getItem('allEmployees')) || [];
      const filtered = emps.filter(e => e.id !== id);
      localStorage.setItem('allEmployees', JSON.stringify(filtered));
      localStorage.removeItem(`attendance_${id}`);
      return Promise.resolve({ success: true });
    }
    return this.request(`/employer/employees/${id}`, { method: 'DELETE' });
  }

  getAttendance(filters = {}) {
    if (USE_MOCK) {
      const emps = JSON.parse(localStorage.getItem('allEmployees')) || [];
      const records = [];
      emps.forEach(emp => {
        const att = JSON.parse(localStorage.getItem(`attendance_${emp.id}`)) || [];
        records.push(...att.map(r => ({
          ...r, employeeId: emp.id, employeeName: emp.name
        })));
      });
      return Promise.resolve(records);
    }
    const params = new URLSearchParams(filters).toString();
    return this.request(`/employer/attendance?${params}`);
  }

  exportAttendance(format = 'csv') {
    if (USE_MOCK) {
      return this.getAttendance().then(data => ({
        data, format, filename: `attendance.${format}`
      }));
    }
    return this.request(`/employer/attendance/export/${format}`);
  }

  // ========== EMPLOYEE ENDPOINTS ==========
  async employeeLogin(email, password) {
    if (USE_MOCK) return Promise.resolve({
      id: `emp_${Date.now()}`, email, name: 'Test Employee',
      token: 'mock-' + Date.now(),
    });
    return this.request('/employee/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  punchIn() {
    return USE_MOCK ? Promise.resolve({
      timestamp: new Date().toISOString(),
      punchIn: new Date().toLocaleTimeString(),
    }) : this.request('/employee/punch-in', { method: 'POST' });
  }

  punchOut() {
    return USE_MOCK ? Promise.resolve({
      timestamp: new Date().toISOString(),
      punchOut: new Date().toLocaleTimeString(),
    }) : this.request('/employee/punch-out', { method: 'POST' });
  }

  getMyAttendance() {
    return USE_MOCK ? Promise.resolve([]) :
      this.request('/employee/attendance');
  }

  logout() {
    this.setToken(null);
    return USE_MOCK ? Promise.resolve({ success: true }) :
      this.request('/auth/logout', { method: 'POST' });
  }
}

export default new APIService();
