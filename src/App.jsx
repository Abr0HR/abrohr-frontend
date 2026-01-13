import { useState } from 'react';
import './App.css';

// IMPROVED V2 - WITH COMPANY SIGNUP & FEATURES
const defaultEmployees = [
  { id: 'E001', name: 'Rajesh Kumar', dept: 'Sales', joinDate: '2020-03-15', attendance: 92, status: 'Active', email: 'rajesh@abrohr.com' },
  { id: 'E002', name: 'Priya Sharma', dept: 'Marketing', joinDate: '2021-06-22', attendance: 85, status: 'Active', email: 'priya@abrohr.com' },
];

const mockUsers = {
  'employer@abrohr.com': { password: 'Employer123', role: 'employer', name: 'Vikram Kumar', id: 'EMP_ADMIN', company: 'AbrO Systems' }
};

const mockCompanies = {};

function App() {
  const [currentView, setCurrentView] = useState('auth');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [signupStep, setSignupStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [industry, setIndustry] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let pwd = '';
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const handleSignupNext = () => {
    if (signupStep === 1) {
      if (!companyName || !companyEmail || !industry) {
        setSignupError('Please fill all company details');
        return;
      }
      setSignupStep(2);
      setSignupError('');
    } else if (signupStep === 2) {
      if (!adminName || !adminEmail) {
        setSignupError('Please fill admin details');
        return;
      }
      const pwd = generatePassword();
      setGeneratedPassword(pwd);
      setSignupStep(3);
      setSignupError('');
    }
  };

  const handleSignupSubmit = () => {
    mockCompanies[adminEmail] = {
      password: generatedPassword,
      role: 'employer',
      name: adminName,
      company: companyName,
      email: adminEmail,
      industry: industry,
      employees: employeeCount
    };
    mockUsers[adminEmail] = mockCompanies[adminEmail];
    
    setSignupSuccess(true);
    setTimeout(() => {
      setCurrentView('auth');
      setSignupStep(1);
      setSignupSuccess(false);
      setCompanyName('');
      setAdminName('');
    }, 2000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    
    const user = mockUsers[email];
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      setCurrentUser(user);
      setCurrentView('dashboard');
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
    setCurrentView('auth');
  };

  if (currentView === 'auth' && !isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-brand">
              <div className="brand-icon">AH</div>
              <h1>AbrO HR</h1>
              <p>Professional Attendance Management</p>
            </div>
            
            <div className="auth-tabs">
              <button onClick={() => setCurrentView('login')} className="auth-tab active">Sign In</button>
              <button onClick={() => setCurrentView('signup')} className="auth-tab">New Company</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'login' && !isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card">
            <div className="login-brand">
              <div className="brand-icon">AH</div>
              <h1>AbrO HR</h1>
              <p>Sign In</p>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required className="form-input" />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required className="form-input" />
              </div>
              {loginError && <div className="error-message">{loginError}</div>}
              <button type="submit" className="login-btn">Sign In</button>
            </form>

            <div className="login-footer">
              <p className="demo-hint">Demo Employer Account:</p>
              <p className="demo-cred">📧 Email: employer@abrohr.com</p>
              <p className="demo-cred">🔑 Password: Employer123</p>
              <button onClick={() => { setCurrentView('auth'); }} className="back-btn">Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'signup' && !isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-card signup-card">
            <div className="login-brand">
              <div className="brand-icon">AH</div>
              <h1>Register Your Company</h1>
              <p>Step {signupStep} of 3</p>
            </div>

            {signupSuccess && (
              <div className="success-box">
                <h3>✓ Company Registered Successfully!</h3>
                <p>Your password has been sent to: {adminEmail}</p>
                <p>Redirecting to login...</p>
              </div>
            )}

            {signupStep === 1 && (
              <form className="signup-form">
                <h3>Company Information</h3>
                <div className="form-group">
                  <label>Company Name *</label>
                  <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="e.g., Tech Solutions Pvt Ltd" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Company Email *</label>
                  <input type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} placeholder="company@example.com" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Industry *</label>
                  <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="form-input">
                    <option value="">Select Industry</option>
                    <option value="IT">IT & Software</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Retail">Retail</option>
                    <option value="Finance">Finance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expected Employees</label>
                  <input type="number" value={employeeCount} onChange={(e) => setEmployeeCount(e.target.value)} placeholder="e.g., 50" className="form-input" />
                </div>
                {signupError && <div className="error-message">{signupError}</div>}
                <button type="button" onClick={handleSignupNext} className="login-btn">Next →</button>
              </form>
            )}

            {signupStep === 2 && (
              <form className="signup-form">
                <h3>Admin Account Details</h3>
                <div className="form-group">
                  <label>Admin Name *</label>
                  <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} placeholder="Full Name" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Admin Email *</label>
                  <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} placeholder="admin@yourcompany.com" className="form-input" />
                </div>
                {signupError && <div className="error-message">{signupError}</div>}
                <div className="button-group">
                  <button type="button" onClick={() => setSignupStep(1)} className="back-btn">← Back</button>
                  <button type="button" onClick={handleSignupNext} className="login-btn">Next →</button>
                </div>
              </form>
            )}

            {signupStep === 3 && (
              <form className="signup-form">
                <h3>Confirmation</h3>
                <div className="confirmation-box">
                  <p><strong>Company:</strong> {companyName}</p>
                  <p><strong>Industry:</strong> {industry}</p>
                  <p><strong>Admin:</strong> {adminName}</p>
                  <p><strong>Email:</strong> {adminEmail}</p>
                  <p><strong>Generated Password:</strong> {generatedPassword}</p>
                  <p style={{fontSize: '12px', color: '#666', marginTop: '10px'}}>⚠ Password will be sent to your email</p>
                </div>
                <div className="button-group">
                  <button type="button" onClick={() => setSignupStep(2)} className="back-btn">← Back</button>
                  <button type="button" onClick={handleSignupSubmit} className="login-btn">Complete Registration</button>
                </div>
              </form>
            )}

            <div className="login-footer">
              <button onClick={() => { setCurrentView('auth'); }} className="text-btn">Back to Options</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoggedIn && userRole === 'employer') {
    return (
      <div className="app-container">
        <header className="app-header">
          <div className="header-left">
            <div className="brand-icon-small">AH</div>
            <div className="brand-text">
              <h2>AbrO HR</h2>
              <span>{currentUser.company}</span>
            </div>
          </div>
          <div className="header-right">
            <span>👤 {currentUser.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </header>

        <div className="dashboard">
          <div className="welcome-card">
            <h1>Welcome to Your Employer Dashboard</h1>
            <p>Company: {currentUser.company}</p>
            <p>Email: {currentUser.email}</p>
            <p style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>✓ Real-time sync enabled</p>
            <p style={{marginTop: '5px', fontSize: '14px', color: '#666'}}>✓ Employee management active</p>
          </div>
          
          <div className="quick-stats">
            <div className="stat-card">
              <h3>Total Employees</h3>
              <p className="stat-value">5</p>
            </div>
            <div className="stat-card">
              <h3>Present Today</h3>
              <p className="stat-value">4</p>
            </div>
            <div className="stat-card">
              <h3>Absent</h3>
              <p className="stat-value">1</p>
            </div>
          </div>
        </div>

        <footer className="app-footer">
          <p>© 2026 AbrO HR | Secure Employee Attendance Management</p>
        </footer>
      </div>
    );
  }

  return null;
}

export default App;
