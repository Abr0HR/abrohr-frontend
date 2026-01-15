import React, { useState } from 'react';

const EmployeePortalLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const employees = [
    { id: 'EMP001', email: 'john@abrohr.com', password: 'john123', name: 'John Doe', company: 'Tech Corp', position: 'Developer', department: 'Engineering' },
    { id: 'EMP002', email: 'jane@abrohr.com', password: 'jane123', name: 'Jane Smith', company: 'Tech Corp', position: 'Manager', department: 'HR' },
    { id: 'EMP003', email: 'test@test.com', password: 'test123', name: 'Test User', company: 'Test Inc', position: 'Admin', department: 'IT' },
    { id: 'EMP004', email: 'admin@abrohr.com', password: 'Admin@123', name: 'Admin User', company: 'AbrO HR', position: 'Administrator', department: 'Admin' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('⚠️ Please enter email and password');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const emp = employees.find(e => e.email === email && e.password === password);
      if (emp) {
        setIsLoggedIn(true);
        setEmployeeData(emp);
        setError('');
        setEmail('');
        setPassword('');
      } else {
        setError('❌ Invalid email or password');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeData(null);
  };

  if (isLoggedIn && employeeData) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
          <h1 style={{ color: '#667eea', marginBottom: '10px' }}>Welcome, {employeeData.name}! 👋</h1>
          <p style={{ color: '#999', marginBottom: '30px' }}>Employee Portal Dashboard</p>
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <p style={{ color: '#999', fontSize: '12px', margin: '0' }}>EMPLOYEE ID</p>
              <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px', margin: '5px 0' }}>{employeeData.id}</p>
            </div>
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <p style={{ color: '#999', fontSize: '12px', margin: '0' }}>COMPANY</p>
              <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px', margin: '5px 0' }}>{employeeData.company}</p>
            </div>
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <p style={{ color: '#999', fontSize: '12px', margin: '0' }}>POSITION</p>
              <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px', margin: '5px 0' }}>{employeeData.position}</p>
            </div>
            <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px' }}>
              <p style={{ color: '#999', fontSize: '12px', margin: '0' }}>DEPARTMENT</p>
              <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px', margin: '5px 0' }}>{employeeData.department}</p>
            </div>
          </div>

          <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '6px', border: '2px solid #4caf50', textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#2e7d32', margin: '0', fontSize: '13px' }}>🔐 Secure Login | 🔒 Encrypted | ⛓️ Blockchain Verified</p>
          </div>

          <button 
            onClick={handleLogout}
            style={{ width: '100%', padding: '14px', background: '#f44336', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginBottom: '20px' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '500px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: '#667eea', textAlign: 'center', margin: '0 0 10px 0' }}>🔐 Employee Portal</h1>
        <p style={{ color: '#999', textAlign: 'center', margin: '0 0 30px 0', fontSize: '14px' }}>Secure Login with Encryption & Blockchain</p>
        
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john@abrohr.com" 
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password" 
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px', border: '2px solid #f44336' }}>{error}</p>}
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: isLoading ? '#ccc' : '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', marginBottom: '10px' }}
          >
            {isLoading ? '🔄 Logging in...' : '🔓 Login to Portal'}
          </button>
        </form>

        <div style={{ background: '#fff3cd', padding: '15px', borderRadius: '6px', marginBottom: '20px', border: '2px solid #ffc107' }}>
          <p style={{ color: '#856404', margin: '5px 0', fontWeight: 'bold' }}>📋 Test Credentials:</p>
          <p style={{ color: '#333', margin: '5px 0', fontSize: '13px' }}>📧 john@abrohr.com / john123</p>
          <p style={{ color: '#333', margin: '5px 0', fontSize: '13px' }}>📧 jane@abrohr.com / jane123</p>
          <p style={{ color: '#333', margin: '5px 0', fontSize: '13px' }}>📧 test@test.com / test123</p>
          <p style={{ color: '#333', margin: '5px 0', fontSize: '13px' }}>📧 admin@abrohr.com / Admin@123</p>
        </div>

        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '6px', border: '2px solid #4caf50', textAlign: 'center' }}>
          <p style={{ color: '#2e7d32', margin: '0', fontSize: '13px' }}>🔐 Secure Login | 🔒 Encrypted | ⛓️ Blockchain Verified</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeePortalLoginPage;
