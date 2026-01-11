import { useState } from 'react';
import EnhancedDashboard from './components/EnhancedDashboard';
import EmployeeManagement from './components/EmployeeManagement';
import './App.css';

const mockUsers = {
  'employer@abrohr.com': { password: 'Employer123', role: 'employer', name: 'Vikram Kumar' },
  'employee@abrohr.com': { password: 'Employee123', role: 'employee', empid: 'EMP001', name: 'Priya Singh' }
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
   const [settingsTab, setSettingsTab] = useState('profile');
   const [showEnhancedAnalytics, setShowEnhancedAnalytics] = useState(false);
  const [showEmployeePortal, setShowEmployeePortal] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    const user = mockUsers[email];
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      setCurrentUser(user);
      setActivePage('dashboard');
    } else {
      setLoginError('Invalid email or password');
    }
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
              <p className="demo-cred">Employer: employer@abrohr.com / Employer123</p>
              <p className="demo-cred">Employee: employee@abrohr.com / Employee123</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          <button className="notification-btn">
            <span>🔔</span>
            <span className="badge">3</span>
          </button>
          <div className="divider"></div>
          <div className="user-menu">
            <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
              <div className="user-avatar">{currentUser.name.charAt(0)}</div>
              <div className="user-info">
                <span className="user-name">{currentUser.name}</span>
                <span className="user-role">{userRole === 'employer' ? 'Administrator' : 'Employee'}</span>
              </div>
              <span>▼</span>
            </button>
            {showUserMenu && (
              <div className="dropdown-menu">
                <a href="#profile" className="menu-item">My Profile</a>
                <a href="#settings" className="menu-item">Account Settings</a>
                <div className="menu-divider"></div>
                <button onClick={handleLogout} className="menu-item logout-item">Logout</button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="app-main">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-title">MAIN</h3>
              <button className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>
                <span>📊</span> Dashboard
              </button>
              <button className={`nav-item ${activePage === 'analytics' ? 'active' : ''}`} onClick={() => setActivePage('analytics')}>
                <span>📈</span> Analytics
              </button>
              {userRole === 'employer' && (
                <button className={`nav-item ${activePage === 'employees' ? 'active' : ''}`} onClick={() => setActivePage('employees')}>
                  <span>👥</span> Employees
                </button>
              )}
              <button className={`nav-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => setActivePage('settings')}>
                <span>⚙️</span> Settings
              </button>
            </div>
          </nav>
        </aside>

        <main className="content-area">
          {activePage === 'dashboard' && (
            <div className="page dashboard-page">
              <div className="page-header">
                <h1>Dashboard</h1>
                <p className="page-subtitle">Welcome back! Here's your attendance overview</p>
              </div>

              {userRole === 'employer' ? (
                <div className="dashboard-grid">
                  <div className="metric-card present">
                    <div className="metric-icon">👥</div>
                    <div className="metric-content">
                      <h3>Present Today</h3>
                      <p className="metric-value">12</p>
                      <span className="metric-change positive">+15% from yesterday</span>
                    </div>
                  </div>
                  <div className="metric-card absent">
                    <div className="metric-icon">📭</div>
                    <div className="metric-content">
                      <h3>Absent Today</h3>
                      <p className="metric-value">2</p>
                      <span className="metric-change negative">-10% from yesterday</span>
                    </div>
                  </div>
                  <div className="metric-card leave">
                    <div className="metric-icon">🏖️</div>
                    <div className="metric-content">
                      <h3>On Leave</h3>
                      <p className="metric-value">3</p>
                      <span className="metric-change">Approved leaves</span>
                    </div>
                  </div>
                  <div className="metric-card total">
                    <div className="metric-icon">👨‍💼</div>
                    <div className="metric-content">
                      <h3>Total Staff</h3>
                      <p className="metric-value">50</p>
                      <span className="metric-change">Active employees</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="dashboard-grid">
                  <div className="metric-card present">
                    <div className="metric-icon">⏰</div>
                    <div className="metric-content">
                      <h3>Today's Status</h3>
                      <p className="metric-value">Present</p>
                      <span className="metric-change positive">Clocked in at 09:00 AM</span>
                    </div>
                  </div>
                  <div className="metric-card leave">
                    <div className="metric-icon">🏖️</div>
                    <div className="metric-content">
                      <h3>Leave Balance</h3>
                      <p className="metric-value">8</p>
                      <span className="metric-change">Days remaining</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="actions-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                  <button className="action-btn primary">⏱️ Clock In</button>
                  <button className="action-btn secondary">⏱️ Clock Out</button>
                  <button className="action-btn secondary">📊 View Reports</button>
                  <button className="action-btn secondary">⚙️ Settings</button>
                </div>
              </div>

              <div className="features-section">
                <h2>📋 Available Features</h2>
                <div className="features-grid">
                  <div className="feature-card">
                    <h3>✓ Attendance Management</h3>
                    <p>Easy clock in/out system with multiple punch modes</p>
                  </div>
                  <div className="feature-card">
                    <h3>✓ Shift Management</h3>
                    <p>Flexible shift scheduling and management</p>
                  </div>
                  <div className="feature-card">
                    <h3>✓ Real-time Reports</h3>
                    <p>Live analytics dashboard with detailed insights</p>
                  </div>
                  <div className="feature-card">
                    <h3>✓ Employee Profiles</h3>
                    <p>Complete employee database management</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePage === 'analytics' && (
            <div className="page analytics-page">
              <div className="page-header">
                <h1>Analytics & Reports</h1>
                <p className="page-subtitle">View detailed attendance analytics and trends</p>
              </div>
              <div className="analytics-placeholder">
                <p>📊 Advanced analytics dashboard coming soon</p>
              </div>
            </div>
          )}

          {activePage === 'employees' && userRole === 'employer' && (
            <div className="page employees-page">
              <div className="page-header">
                <h1>Employee Management</h1>
                <p className="page-subtitle">Manage your employees and their attendance</p>
              </div>
              <div className="employees-placeholder">
                <p>👥 Employee management interface coming soon</p>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className="page settings-page">
              <div className="page-header">
                <h1>Settings</h1>
                <p className="page-subtitle">Manage your preferences and account</p>
              </div>
<div className="settings-tabs">\n              <button className={`tab-btn ${settingsTab === 'profile' ? 'active' : ''}`} onClick={() => setSettingsTab('profile')}>👤 Profile</button>\n              <button className={`tab-btn ${settingsTab === 'security' ? 'active' : ''}`} onClick={() => setSettingsTab('security')}>🔐 Security</button>\n              <button className={`tab-btn ${settingsTab === 'preferences' ? 'active' : ''}`} onClick={() => setSettingsTab('preferences')}>⚙️ Preferences</button>\n            </div>\n            <div className="settings-content">\n              {settingsTab === 'profile' && (\n                <div className="settings-form">\n                  <h3>Profile Information</h3>\n                  <div className="form-group">\n                    <label>Full Name</label>\n                    <input type="text" defaultValue={currentUser.name} placeholder="Enter your name" className="form-input" />\n                  </div>\n                  <div className="form-group">\n                    <label>Email Address</label>\n                    <input type="email" defaultValue={email} placeholder="Enter email" className="form-input" />\n                  </div>\n                  <div className="form-group">\n                    <label>Phone Number</label>\n                    <input type="tel" placeholder="Enter phone number" className="form-input" />\n                  </div>\n                  <div className="form-group">\n                    <label>Department</label>\n                    <input type="text" placeholder="Your department" className="form-input" />\n                  </div>\n                  <button className="action-btn primary" style={{marginTop: '20px'}}>💾 Save Changes</button>\n                </div>\n              )}\n              {settingsTab === 'security' && (\n                <div className="settings-form">\n                  <h3>Security Settings</h3>\n                  <div className="form-group">\n                    <label>Current Password</label>\n                    <input type="password" placeholder="Enter current password" className="form-input" />\n                  </div>\n                  <div className="form-group">\n                    <label>New Password</label>\n                    <input type="password" placeholder="Enter new password" className="form-input" />\n                  </div>\n                  <div className="form-group">\n                    <label>Confirm Password</label>\n                    <input type="password" placeholder="Confirm new password" className="form-input" />\n                  </div>\n                  <div className="security-info">\n                    <p>✅ Password strength: Strong</p>\n                    <p>🔐 Last changed: 30 days ago</p>\n                  </div>\n                  <button className="action-btn primary" style={{marginTop: '20px'}}>🔑 Change Password</button>\n                </div>\n              )}\n              {settingsTab === 'preferences' && (\n                <div className="settings-form">\n                  <h3>User Preferences</h3>\n                  <div className="preference-item">\n                    <label>Theme</label>\n                    <select className="form-input">\n                      <option>Light Mode</option>\n                      <option>Dark Mode</option>\n                    </select>\n                  </div>\n                  <div className="preference-item">\n                    <label>Notifications</label>\n                    <div className="checkbox-group">\n                      <label><input type="checkbox" defaultChecked /> Email Notifications</label>\n                      <label><input type="checkbox" defaultChecked /> Attendance Reminders</label>\n                      <label><input type="checkbox" /> Leave Notifications</label>\n                    </div>\n                  </div>\n                  <div className="preference-item">\n                    <label>Language</label>\n                    <select className="form-input">\n                      <option>English</option>\n                      <option>Hindi</option>\n                    </select>\n                  </div>\n                  <button className="action-btn primary" style={{marginTop: '20px'}}>💾 Save Preferences</button>\n                </div>\n              )}\n            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
