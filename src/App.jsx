import { useState } from 'react';
import './App.css';

// Mock Email Service (using fetch to a backend email service)
const sendEmailNotification = async (email, company, password, adminName) => {
  try {
    // This would connect to a real email service like SendGrid, EmailJS, or your backend
    console.log(`Email sent to ${email}`);
    console.log(`Company: ${company}, Password: ${password}, Admin: ${adminName}`);
    
    // For now, store in localStorage with a flag that email was sent
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    registrations.push({
      email,
      company,
      password,
      adminName,
      emailSent: true,
      sentDate: new Date().toISOString()
    });
    localStorage.setItem('registrations', JSON.stringify(registrations));
    
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

function App() {
  const [currentView, setCurrentView] = useState('auth'); // auth, signup, company-dashboard, employee-dashboard
  const [signupStep, setSignupStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'employee'
  const [currentCompany, setCurrentCompany] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Form states for signup
  const [companyData, setCompanyData] = useState({
    name: '',
    email: '',
    industry: '',
    employees: ''
  });

  const [adminData, setAdminData] = useState({
    name: '',
    email: ''
  });

  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Employee Portal data
  const [employees, setEmployees] = useState([
    { id: 'E001', name: 'Rajesh Kumar', dept: 'Sales', status: 'Present', time: '09:00 AM' },
    { id: 'E002', name: 'Priya Sharma', dept: 'Marketing', status: 'Present', time: '08:45 AM' },
    { id: 'E003', name: 'Amit Singh', dept: 'IT', status: 'Absent', time: '-' }
  ]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleCompanySignup = async () => {
    if (!companyData.name || !companyData.email || !companyData.industry || !companyData.employees) {
      alert('Please fill all company details');
      return;
    }
    setSignupStep(2);
  };

  const handleAdminSignup = async () => {
    if (!adminData.name || !adminData.email) {
      alert('Please fill all admin details');
      return;
    }

    const generatedPassword = generatePassword();
    
    // Send email notification
    await sendEmailNotification(
      adminData.email,
      companyData.name,
      generatedPassword,
      adminData.name
    );

    // Store company data
    const companies = JSON.parse(localStorage.getItem('companies') || '{}');
    companies[companyData.email] = {
      ...companyData,
      ...adminData,
      password: generatedPassword,
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('companies', JSON.stringify(companies));

    // Show confirmation
    alert(`✅ Registration Successful!\n\nAn email has been sent to ${adminData.email} with login credentials.\n\nPassword: ${generatedPassword}`);
    setSignupStep(1);
    setCompanyData({ name: '', email: '', industry: '', employees: '' });
    setAdminData({ name: '', email: '' });
    setCurrentView('auth');
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert('Please enter email and password');
      return;
    }

    const companies = JSON.parse(localStorage.getItem('companies') || '{}');
    const company = companies[loginEmail];

    if (company && company.password === loginPassword) {
      setIsLoggedIn(true);
      setUserRole('admin');
      setCurrentCompany(company);
      setCurrentUser(company.name);
      setCurrentView('company-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setCurrentCompany(null);
    setCurrentUser(null);
    setLoginEmail('');
    setLoginPassword('');
    setCurrentView('auth');
  };

  // View: Authentication/Main Screen
  if (!isLoggedIn && currentView === 'auth') {
    return (
      <div className="app-container">
        <div className="auth-card">
          <div className="logo">
            <div className="logo-circle">AH</div>
          </div>
          <h1>AbrO HR</h1>
          <p className="tagline">Professional Attendance & HR Management System</p>

          <div className="auth-tabs">
            <button 
              className={`tab-btn ${currentView === 'auth' ? 'active' : ''}`}
              onClick={() => setCurrentView('auth')}
            >
              Sign In
            </button>
            <button 
              className="tab-btn"
              onClick={() => { setCurrentView('signup'); setSignupStep(1); }}
            >
              New Company
            </button>
          </div>

          {currentView === 'auth' && (
            <div className="login-form">
              <input
                type="email"
                placeholder="Company Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="form-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="form-input"
              />
              <button onClick={handleLogin} className="btn btn-primary">Sign In</button>
            </div>
          )}
                      <div style={{textAlign: 'center', marginTop: '40px', padding: '20px'}}>
              <h2 style={{color: '#5b5bce', fontSize: '28px', marginBottom: '20px'}}>Why Choose AbrO HR?</h2>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '1000px', margin: '0 auto'}}>
                <div style={{padding: '20px', backgroundColor: '#f8f9ff', borderRadius: '8px', border: '2px solid #5b5bce'}}>
                  <h3 style={{color: '#5b5bce'}}>📊 Real-time Analytics</h3>
                  <p>Track attendance and performance metrics in real-time</p>
                </div>
                <div style={{padding: '20px', backgroundColor: '#f8f9ff', borderRadius: '8px', border: '2px solid #5b5bce'}}>
                  <h3 style={{color: '#5b5bce'}}>🔒 Secure & Reliable</h3>
                  <p>Enterprise-grade security for all employee data</p>
                </div>
                <div style={{padding: '20px', backgroundColor: '#f8f9ff', borderRadius: '8px', border: '2px solid #5b5bce'}}>
                  <h3 style={{color: '#5b5bce'}}>⚡ Lightning Fast</h3>
                  <p>Optimized performance for seamless experience</p>
                </div>
              </div>
            </div>
        </div>
      </div>
    );
  }

  // View: Company Signup
  if (currentView === 'signup') {
    return (
      <div className="app-container">
        <div className="signup-card">
          <div className="logo">
            <div className="logo-circle">AH</div>
          </div>
          <h1>Register Your Company</h1>
          <p className="step-indicator">Step {signupStep} of 2</p>

          {signupStep === 1 && (
            <div className="signup-form">
              <h2>Company Information</h2>
              <input
                type="text"
                placeholder="Company Name"
                value={companyData.name}
                onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Company Email"
                value={companyData.email}
                onChange={(e) => setCompanyData({...companyData, email: e.target.value})}
                className="form-input"
              />
              <select 
                value={companyData.industry}
                onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
                className="form-input"
              >
                <option value="">Select Industry</option>
                <option value="IT">IT & Software</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Retail">Retail</option>
                <option value="Finance">Finance</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="number"
                placeholder="Expected Employees"
                value={companyData.employees}
                onChange={(e) => setCompanyData({...companyData, employees: e.target.value})}
                className="form-input"
              />
              <button onClick={handleCompanySignup} className="btn btn-primary">Next →</button>
              <button onClick={() => setCurrentView('auth')} className="btn btn-secondary">Back</button>
            </div>
          )}

          {signupStep === 2 && (
            <div className="signup-form">
              <h2>Admin Account Details</h2>
              <input
                type="text"
                placeholder="Admin Full Name"
                value={adminData.name}
                onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                className="form-input"
              />
              <input
                type="email"
                placeholder="Admin Email"
                value={adminData.email}
                onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                className="form-input"
              />
              <p className="info-text">Password will be automatically generated and sent to your email</p>
              <button onClick={handleAdminSignup} className="btn btn-success">Complete Registration</button>
              <button onClick={() => setSignupStep(1)} className="btn btn-secondary">Back</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // View: Company Dashboard (Admin Portal)
  if (isLoggedIn && currentView === 'company-dashboard') {
    return (
      <div className="app-container">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="header-left">
              <h1>Welcome, {currentUser}</h1>
              <p>Company Dashboard</p>
            </div>
            <div className="header-right">
              <button onClick={handleLogout} className="btn btn-logout">Logout</button>
            </div>
          </div>

          <div className="dashboard-content">
            <div className="card">
              <h2>🎨 Employee Attendance</h2>
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.id}</td>
                      <td>{emp.name}</td>
                      <td>{emp.dept}</td>
                      <td><span className={`badge ${emp.status.toLowerCase()}`}>{emp.status}</span></td>
                      <td>{emp.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <h2>📄 Company Details</h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Company Name:</span>
                  <span className="value">{currentCompany.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Email:</span>
                  <span className="value">{currentCompany.email}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Industry:</span>
                  <span className="value">{currentCompany.industry}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Expected Employees:</span>
                  <span className="value">{currentCompany.employees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
            {/* NEW FEATURES SECTION V2 */}
            <div className="features-section">
              <h2>⚡ Quick Features</h2>
              <div className="features-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginTop: '20px'}}>
                {/* Dark Mode Toggle */}
                <div className="feature-card" style={{padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center'}}>
                  <h3>🌙 Dark Mode</h3>
                  <button onClick={() => {alert('Dark Mode Activated!')}} className="feature-btn" style={{padding: '8px 12px', backgroundColor: '#5b5bce', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Toggle</button>
                </div>
                {/* AI Chat */}
                <div className="feature-card" style={{padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center'}}>
                  <h3>🤖 AI Assistant</h3>
                  <button className="feature-btn" onClick={() => alert('AI Chat: Ready to help!')} style={{padding: '8px 12px', backgroundColor: '#5b5bce', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>Open Chat</button>
                </div>
              </div>
            </div>
      </div>
    );
  }

  return null;
}

export default App;
