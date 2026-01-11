import { useState } from 'react';
import EnhancedDashboard from './components/EnhancedDashboard';
import EmployeeManagement from './components/EmployeeManagement';
import WellnessAndEngagement from './components/WellnessAndEngagement';
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
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {activePage === 'dashboard' && <EnhancedDashboard />}
          {activePage === 'employees' && <EmployeeManagement />}
          {activePage === 'wellness' && <WellnessAndEngagement />}
        </main>
      </div>

      <footer className="app-footer">
        <p>&copy; 2024 AbrO HR. All rights reserved. | Professional Attendance Management System</p>
      </footer>
    </div>
  );
}

export default App;
