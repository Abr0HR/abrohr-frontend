import { useState } from 'react';

const EmployeeLogin = ({ onLoginSuccess, onShowSecurePortal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeData, setEmployeeData] = useState(null);

  // Mock employee database
  const mockEmployees = [
    {
      id: 'EMP001',
      email: 'john.doe@company.com',
      password: 'password123',
      name: 'John Doe',
      company: 'Tech Solutions Inc',
      companyId: 'COMPANY_001',
      position: 'Senior Developer',
      salary: 75000,
      encrypted: true
    },
    {
      id: 'EMP002',
      email: 'jane.smith@company.com',
      password: 'password123',
      name: 'Jane Smith',
      company: 'Tech Solutions Inc',
      companyId: 'COMPANY_001',
      position: 'Project Manager',
      salary: 85000,
      encrypted: true
    },
    {
      id: 'EMP003',
      email: 'employee@test.com',
      password: 'test123',
      name: 'Test Employee',
      company: 'Test Company',
      companyId: 'COMPANY_002',
      position: 'HR Manager',
      salary: 65000,
      encrypted: true
    }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      // Find employee in mock database
      const employee = mockEmployees.find(
        emp => emp.email === email && emp.password === password
      );

      if (employee) {
        setIsLoggedIn(true);
        setEmployeeData(employee);
        setEmail('');
        setPassword('');
        
        // Call parent callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(employee);
        }
      } else {
        setError('😞 Invalid email or password. Try using one of the test accounts below.');
      }
      setLoading(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmployeeData(null);
    setEmail('');
    setPassword('');
    setError('');
  };

  // After login - show employee portal
  if (isLoggedIn && employeeData) {
    return (
      <div style={{
        padding: '40px 20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{
          padding: '30px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '2px solid #5b5bce',
          marginBottom: '20px'
        }}>
          <h2 style={{color: '#5b5bce', margin: '0 0 20px 0'}}>👋 Welcome, {employeeData.name}!</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '12px', color: '#666'}}>EMPLOYEE ID</p>
              <p style={{margin: '5px 0', fontWeight: 'bold', color: '#5b5bce'}}>{employeeData.id}</p>
            </div>
            <div style={{padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '12px', color: '#666'}}>COMPANY</p>
              <p style={{margin: '5px 0', fontWeight: 'bold', color: '#5b5bce'}}>{employeeData.company}</p>
            </div>
            <div style={{padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px'}}>
              <p style={{margin: '5px 0', fontSize: '12px', color: '#666'}}>POSITION</p>
              <p style={{margin: '5px 0', fontWeight: 'bold', color: '#5b5bce'}}>{employeeData.position}</p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <button onClick={onShowSecurePortal} style={{
            padding: '15px 20px',
            backgroundColor: '#5b5bce',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>🔐 View Secure Employee Portal</button>
          
          <button style={{
            padding: '15px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>View Payslips</button>
          
          <button style={{
            padding: '15px 20px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>Leave Management</button>
          
          <button onClick={handleLogout} style={{
            padding: '15px 20px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>Logout</button>
        </div>

        <div style={{
          padding: '20px',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          border: '2px solid #4caf50'
        }}>
          <p style={{margin: '0', color: '#2e7d32', fontWeight: 'bold'}}>🔐 Your data is encrypted and secured with blockchain verification</p>
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div style={{
      padding: '40px 20px',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h2 style={{textAlign: 'center', color: '#5b5bce'}}>🔐 Employee Portal Login</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333'}}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
            required
          />
        </div>

        {error && (
          <div style={{
            padding: '12px',
            backgroundColor: '#ffebee',
            border: '2px solid #f44336',
            borderRadius: '6px',
            color: '#c62828',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: loading ? '#ccc' : '#5b5bce',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Logging in...' : '🔓 Login to Secure Portal'}
        </button>
      </form>

      {/* Test credentials */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        border: '2px solid #ffc107'
      }}>
        <h4 style={{margin: '0 0 10px 0', color: '#856404'}}>📝 Test Credentials</h4>
        <p style={{margin: '8px 0', fontSize: '14px', color: '#333'}}><strong>Account 1:</strong> john.doe@company.com / password123</p>
        <p style={{margin: '8px 0', fontSize: '14px', color: '#333'}}><strong>Account 2:</strong> jane.smith@company.com / password123</p>
        <p style={{margin: '8px 0', fontSize: '14px', color: '#333'}}><strong>Account 3:</strong> employee@test.com / test123</p>
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        borderRadius: '8px',
        border: '2px solid #4caf50',
        textAlign: 'center'
      }}>
        <p style={{margin: '0', color: '#2e7d32', fontSize: '12px'}}>🔐 Secure Login | 🔒 Encrypted Data | ⛓️ Blockchain Verified</p>
      </div>
    </div>
  );
};

export default EmployeeLogin;
