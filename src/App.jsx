import { useState } from 'react';
import EnhancedDashboard from './components/EnhancedDashboard';
import EmployeeManagement from './components/EmployeeManagement';
import WellnessAndEngagement from './components/WellnessAndEngagement';
import EmployeePortal from './components/EmployeePortal';
import AttendanceRegularization from './components/AttendanceRegularization';
import './App.css';

// Default employee data that employers can add to
const defaultEmployees = [
  { id: 'E001', name: 'Rajesh Kumar', dept: 'Sales', joinDate: '2020-03-15', attendance: 92, status: 'Active', email: 'rajesh@abrohr.com', phone: '9876543210' },
  { id: 'E002', name: 'Priya Sharma', dept: 'Marketing', joinDate: '2021-06-22', attendance: 85, status: 'Active', email: 'priya@abrohr.com', phone: '9876543211' },
  { id: 'E003', name: 'Amit Patel', dept: 'IT', joinDate: '2019-11-10', attendance: 78, status: 'Active', email: 'amit@abrohr.com', phone: '9876543212' },
  { id: 'E004', name: 'Neha Singh', dept: 'HR', joinDate: '2022-01-05', attendance: 96, status: 'Active', email: 'neha@abrohr.com', phone: '9876543213' },
  { id: 'E005', name: 'Vikram Malhotra', dept: 'Finance', joinDate: '2020-08-30', attendance: 88, status: 'Active', email: 'vikram@abrohr.com', phone: '9876543214' }
];

const mockUsers = {
  'employer@abrohr.com': { password: 'Employer123', role: 'employer', name: 'Vikram Kumar', id: 'EMP_ADMIN' }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Load employees from localStorage or use defaults
  const getEmployees = () => {
    const savedEmployees = localStorage.getItem('abrohr_employees');
    if (savedEmployees) {
      try {
        return JSON.parse(savedEmployees);
      } catch (error) {
        return defaultEmployees;
      }
    }
    return defaultEmployees;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');

    // Check if it's an employer account
    const employer = mockUsers[email];
    if (employer && employer.password === password) {
      setIsLoggedIn(true);
      setUserRole('employer');
      setCurrentUser(employer);
      setActivePage('dashboard');
      return;
    }

    // Check if it's an employee account
    // Employees can login with any email from the employee database with password 'Employee123'
    if (password === 'Employee123') {
      const employees = getEmployees();
      const employee = employees.find(emp => emp.email === email);
      
      if (employee) {
        setIsLoggedIn(true);
        setUserRole('employee');
        setCurrentUser({
          ...employee,
          role: 'employee',
          id: employee.id
        });
        setActivePage('dashboard');
        return;
      }
    }

    // If no match found
    setLoginError('Invalid email or password');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setActivePage('dashboard');
    setShowUserMenu(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-brand">
              <div className="brand-icon">AH</div>
              <h1>AbrO HR</h1>
              <p>Professional Attendance Management</p>
            </div>
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="form-input"
                />
              </div>
              {loginError && <div className="error-message">{loginError}</div>}
              <button type="submit" className="login-btn">Sign In</button>
            </form>
            <div className="login-footer">
              <p className="demo-hint">Demo Accounts:</p>
              <p className="demo-cred">👔 Employer: employer@abrohr.com / Employer123</p>
              <p className="demo-cred">👨 Employee: Any email added in Employees section / Employee123</p>
              <p className="demo-cred" style={{ fontSize: '12px', marginTop: '10px', color: '#64748b' }}>Example: rajesh@abrohr.com / Employee123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Employee Dashboard
  if (userRole === 'employee') {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <div className="header-brand">
              <div className="brand-icon-small">AH</div>
              <div className="brand-text">
                <h2>AbrO HR</h2>
                <span>Employee Portal</span>
              </div>
            </div>
          </div>
          <div className="header-center">
            <div className="search-box" style={{ opacity: 0.5 }}>
              <span>👤</span>
              <span>{currentUser?.name}</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                👤 {currentUser?.name}
              </button>
              {showUserMenu && (
                <div className="dropdown-menu">
                  <a href="#">Profile</a>
                  <a href="#">Settings</a>
                  <hr />
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="main-layout">
          <main className="main-content" style={{ width: '100%' }}>
            <EmployeePortal currentUser={currentUser} />
          </main>
        </div>

        <footer className="app-footer">
          <p>&copy; 2024 AbrO HR. All rights reserved. | Employee Attendance Management System</p>
        </footer>
      </div>
    );
  }

  // Employer Dashboard
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-left">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div className="header-brand">
            <div className="brand-icon-small">AH</div>
            <div className="brand-text">
              <h2>AbrO HR</h2>
              <span>Attendance System</span>
            </div>
          </div>
        </div>
        <div className="header-center">
          <div className="search-box">
            <span>🔍</span>
            <input type="text" placeholder="Search employees..." />
          </div>
        </div>
        <div className="header-right">
          <div className="user-menu">
            <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              👤 {currentUser?.name}
            </button>
            {showUserMenu && (
              <div className="dropdown-menu">
                <a href="#">Profile</a>
                <a href="#">Settings</a>
                <hr />
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="main-layout">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3>Main</h3>
              <button
                className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActivePage('dashboard')}
              >
                📊 Dashboard
              </button>
              <button
                className={`nav-item ${activePage === 'employees' ? 'active' : ''}`}
                onClick={() => setActivePage('employees')}
              >
                👥 Employees
              </button>
              <button
                className={`nav-item ${activePage === 'wellness' ? 'active' : ''}`}
                onClick={() => setActivePage('wellness')}
              >
                💚 Wellness & Engagement
              </button>
              <button
                  className={`nav-item ${activePage === 'regularization' ? 'active' : ''}`}
                  onClick={() => setActivePage('regularization')}
                >
                  📋 Attendance Regularization
                </button>
               <button
            className={`nav-item ${activePage === 'settings' ? 'active' : ''}`}
            onClick={() => setActivePage('settings')}
          >
            ⚙️ Settings
          </button>
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {activePage === 'dashboard' && <EnhancedDashboard />}
          {activePage === 'employees' && <EmployeeManagement />}
          {activePage === 'wellness' && <WellnessAndEngagement />}
           {activePage === 'regularization' && <AttendanceRegularization />}
           {activePage === 'settings' && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#001529' }}>System Settings</h2>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>General Settings</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Organization Name</label>
                  <input type="text" value="AbrO HR Systems" readOnly style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="app-footer">
        <p>&copy; 2024 AbrO HR. All rights reserved. | Professional Attendance Management System</p>
      </footer>
    </div>
  );
}

export default App;
