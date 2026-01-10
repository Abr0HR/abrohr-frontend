import { useState } from 'react';
import './App.css';

const mockUsers = {
  'employer@abrohr.com': { password: 'Employer@123', role: 'employer', name: 'Vikram Kumar', company: 'AbrO HR' },
  'employee@abrohr.com': { password: 'Employee@123', role: 'employee', empId: 'EMP001', name: 'Priya Singh' }
};

const initialEmployees = [
  { id: 'EMP001', name: 'Priya Singh', email: 'priya@abrohr.com', dept: 'Engineering', joinDate: '2024-01-15', status: 'Active' },
  { id: 'EMP002', name: 'Rajesh Patel', email: 'rajesh@abrohr.com', dept: 'Marketing', joinDate: '2024-02-20', status: 'Active' },
  { id: 'EMP003', name: 'Sneha Desai', email: 'sneha@abrohr.com', dept: 'HR', joinDate: '2024-03-10', status: 'Active' }
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  const [employees, setEmployees] = useState(initialEmployees);
  const [showModal, setShowModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', dept: '', joinDate: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockUsers[email];
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      setCurrentUser(user);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials');
    }
  };

  const addEmployee = () => {
    if (newEmp.name && newEmp.email && newEmp.dept) {
      const empId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
      setEmployees([...employees, { id: empId, ...newEmp, status: 'Active', joinDate: newEmp.joinDate || new Date().toISOString().split('T')[0] }]);
      setNewEmp({ name: '', email: '', dept: '', joinDate: '' });
      setShowModal(false);
    }
  };

  // EMPLOYER DASHBOARD
  if (isLoggedIn && userRole === 'employer') {
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">🏢 AbrO HR</div>
          <nav className="nav-menu">
            <button className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>📊 Dashboard</button>
            <button className={`nav-item ${activePage === 'employees' ? 'active' : ''}`} onClick={() => setActivePage('employees')}>👥 Employees</button>
            <button className={`nav-item ${activePage === 'attendance' ? 'active' : ''}`} onClick={() => setActivePage('attendance')}>✓ Attendance</button>
            <button className={`nav-item ${activePage === 'reports' ? 'active' : ''}`} onClick={() => setActivePage('reports')}>📈 Reports</button>
            <button className={`nav-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => setActivePage('settings')}>⚙️ Settings</button>
          </nav>
          <button className="logout-btn" onClick={() => { setIsLoggedIn(false); setUserRole(null); }}>Logout</button>
        </aside>

        <main className="main-content">
          <header className="header">
            <h1>Welcome, {currentUser?.name}! 👋</h1>
            <div className="header-info">Employer • {employees.length} Employees</div>
          </header>

          {activePage === 'dashboard' && (
            <div className="dashboard">
              <div className="stats-grid">
                <div className="stat-card present">
                  <div className="stat-icon">✓</div>
                  <h3>Present Today</h3>
                  <p className="stat-value">2</p>
                </div>
                <div className="stat-card absent">
                  <div className="stat-icon">✗</div>
                  <h3>Absent</h3>
                  <p className="stat-value">1</p>
                </div>
                <div className="stat-card total">
                  <div className="stat-icon">👥</div>
                  <h3>Total Staff</h3>
                  <p className="stat-value">{employees.length}</p>
                </div>
                <div className="stat-card leaves">
                  <div className="stat-icon">📭</div>
                  <h3>On Leave</h3>
                  <p className="stat-value">0</p>
                </div>
              </div>

              <div className="content-box">
                <h2>Quick Stats</h2>
                <p>👥 Team Size: {employees.length} | 📅 Attendance Rate: 95% | 🎯 Today's Punch: 2</p>
              </div>
            </div>
          )}

          {activePage === 'employees' && (
            <div className="employees-page">
              <div className="page-header">
                <h2>Employee Management</h2>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Employee</button>
              </div>

              {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <h2>Add New Employee</h2>
                    <div className="form-group">
                      <label>Full Name</label>
                      <input type="text" value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} placeholder="Enter name" />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                      <label>Department</label>
                      <select value={newEmp.dept} onChange={e => setNewEmp({...newEmp, dept: e.target.value})}>
                        <option value="">Select Department</option>
                        <option value="Engineering">Engineering</option>
                        <option value="HR">HR</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Join Date</label>
                      <input type="date" value={newEmp.joinDate} onChange={e => setNewEmp({...newEmp, joinDate: e.target.value})} />
                    </div>
                    <div className="modal-buttons">
                      <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                      <button className="btn-primary" onClick={addEmployee}>Add Employee</button>
                    </div>
                  </div>
                </div>
              )}

              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Join Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td><strong>{emp.id}</strong></td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.dept}</td>
                      <td>{emp.joinDate}</td>
                      <td><span className="badge active">{emp.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activePage === 'attendance' && (
            <div className="content-box">
              <h2>Attendance Management</h2>
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Emp ID</th>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.slice(0, 3).map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td><span className="badge present">Present</span></td>
                      <td>09:15 AM</td>
                      <td>06:00 PM</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activePage === 'reports' && (
            <div className="content-box">
              <h2>Reports & Analytics</h2>
              <p>📊 Attendance reports, department analytics, and trends coming soon...</p>
            </div>
          )}

          {activePage === 'settings' && (
            <div className="content-box">
              <h2>Settings</h2>
              <p>⚙️ Company settings, leave policies, and notifications...</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // EMPLOYEE DASHBOARD
  if (isLoggedIn && userRole === 'employee') {
    return (
      <div className="app-container">
        <aside className="sidebar">
          <div className="logo">🏢 AbrO HR</div>
          <nav className="nav-menu">
            <button className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>📊 Dashboard</button>
            <button className={`nav-item ${activePage === 'attendance' ? 'active' : ''}`} onClick={() => setActivePage('attendance')}>✓ Attendance</button>
            <button className={`nav-item ${activePage === 'leave' ? 'active' : ''}`} onClick={() => setActivePage('leave')}>📭 Leave</button>
            <button className={`nav-item ${activePage === 'profile' ? 'active' : ''}`} onClick={() => setActivePage('profile')}>👤 Profile</button>
          </nav>
          <button className="logout-btn" onClick={() => { setIsLoggedIn(false); setUserRole(null); }}>Logout</button>
        </aside>

        <main className="main-content">
          <header className="header">
            <h1>Welcome, {currentUser?.name}! 👋</h1>
            <div className="header-info">Employee • {currentUser?.empId}</div>
          </header>

          {activePage === 'dashboard' && (
            <div className="dashboard">
              <div className="stats-grid">
                <div className="stat-card small-card">
                  <h3>Today's Status</h3>
                  <p className="stat-value">✓ Present</p>
                </div>
                <div className="stat-card small-card">
                  <h3>Check-in</h3>
                  <p className="stat-value">09:15 AM</p>
                </div>
                <div className="stat-card small-card">
                  <h3>Working Hours</h3>
                  <p className="stat-value">8h 45m</p>
                </div>
                <div className="stat-card small-card">
                  <h3>Leaves Left</h3>
                  <p className="stat-value">12</p>
                </div>
              </div>

              <div className="quick-actions">
                <button className="action-btn check-in">✓ Check In</button>
                <button className="action-btn check-out">✗ Check Out</button>
                <button className="action-btn request">📋 Request Leave</button>
              </div>

              <div className="content-box">
                <h2>Recent Attendance</h2>
                <p>📅 Jan 10: Present (09:15 - 06:00)</p>
                <p>📅 Jan 9: Present (09:30 - 05:45)</p>
              </div>
            </div>
          )}

          {activePage === 'attendance' && (
            <div className="content-box">
              <h2>My Attendance</h2>
              <p>📊 Attendance history and details...</p>
            </div>
          )}

          {activePage === 'leave' && (
            <div className="content-box">
              <h2>Leave Management</h2>
              <p>Leave Balance: Casual (8/12) | Sick (3/10) | Earned (12/20)</p>
            </div>
          )}

          {activePage === 'profile' && (
            <div className="content-box">
              <h2>My Profile</h2>
              <p>Employee ID: {currentUser?.empId}</p>
              <p>Name: {currentUser?.name}</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  // LOGIN PAGE
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1>🏢 AbrO HR</h1>
          <p className="subtitle">Employee Attendance & Management System</p>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
            </div>
            {loginError && <div className="error">{loginError}</div>}
            <button type="submit" className="btn-login">Login</button>
          </form


          <div className="demo-credentials">
            <h3>📝 Demo Credentials:</h3>
            <div className="cred-box">
              <p><strong>👔 Employer Account:</strong></p>
              <p>📧 Email: <code>employer@abrohr.com</code></p>
              <p>🔐 Password: <code>Employer@123</code></p>
            </div>
            <div className="cred-box">
              <p><strong>👤 Employee Account:</strong></p>
              <p>📧 Email: <code>employee@abrohr.com</code></p>
              <p>🔐 Password: <code>Employee@123</code></p>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default App;
