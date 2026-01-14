import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';
import emailService from '../services/EmailNotificationService';

const LoginWithForgotPassword = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Test accounts for demo
  const testAccounts = [
    { email: 'admin@abrohr.com', password: 'Admin@123', role: 'admin' },
    { email: 'hr@abrohr.com', password: 'HR@123', role: 'hr' },
    { email: 'employee@abrohr.com', password: 'Emp@123', role: 'employee' },
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verify against test accounts
      const account = testAccounts.find(acc => acc.email === email && acc.password === password);
      
      if (account) {
        // Store login info in localStorage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', account.role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Send login notification email
        await emailService.sendLoginNotificationEmail(email, account.role);
        
        // Redirect to dashboard based on role
        window.location.href = `/${account.role}-dashboard`;
      } else {
        setError('Invalid email or password. Use test accounts for demo.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <ForgotPassword onBack={() => setShowForgotPassword(false)} />
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>AH</div>
            <h1 style={styles.title}>AbrO HR</h1>
            <p style={styles.subtitle}>Professional Attendance & HR Management System</p>
          </div>

          <div style={styles.tabsContainer}>
            <button style={styles.activeTab}>Sign In</button>
            <button style={styles.inactiveTab}>New Company</button>
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Company Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={styles.input}
            />

            {error && <p style={styles.errorText}>{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.signInButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div style={styles.forgotPasswordLink}>
            <button 
              type="button"
              onClick={() => setShowForgotPassword(true)}
              style={styles.linkButton}
            >
              Forgot Password?
            </button>
          </div>

          <div style={styles.demoInfo}>
            <h3 style={styles.demoTitle}>Demo Accounts</h3>
            <div style={styles.demoAccounts}>
              {testAccounts.map((account, idx) => (
                <div key={idx} style={styles.demoAccount}>
                  <p><strong>{account.role}:</strong></p>
                  <p>Email: {account.email}</p>
                  <p>Pass: {account.password}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.features}>
            <h2 style={styles.featuresTitle}>Why Choose AbrO HR?</h2>
            <div style={styles.featureGrid}>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>📊</span>
                <h3 style={styles.featureCardTitle}>Real-time Analytics</h3>
                <p>Track attendance and performance metrics in real-time</p>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>🔒</span>
                <h3 style={styles.featureCardTitle}>Secure & Reliable</h3>
                <p>Enterprise-grade security for all employee data</p>
              </div>
              <div style={styles.featureCard}>
                <span style={styles.featureIcon}>⚡</span>
                <h3 style={styles.featureCardTitle}>Lightning Fast</h3>
                <p>Optimized performance for seamless experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  wrapper: {
    width: '100%',
    maxWidth: '800px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  logo: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 15px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    margin: '0',
  },
  tabsContainer: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    borderBottom: '1px solid #eee',
  },
  activeTab: {
    padding: '10px 0',
    background: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: '3px solid #667eea',
  },
  inactiveTab: {
    padding: '10px 0',
    background: 'transparent',
    border: 'none',
    color: '#999',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s',
  },
  signInButton: {
    padding: '14px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  forgotPasswordLink: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  linkButton: {
    background: 'transparent',
    border: 'none',
    color: '#667eea',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '13px',
    margin: '0',
  },
  demoInfo: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
  },
  demoTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginTop: '0',
    marginBottom: '15px',
  },
  demoAccounts: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  demoAccount: {
    fontSize: '12px',
    color: '#666',
    padding: '10px',
    background: 'white',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  features: {
    marginTop: '40px',
  },
  featuresTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: '30px',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  featureCard: {
    padding: '20px',
    border: '2px solid #667eea',
    borderRadius: '8px',
    textAlign: 'center',
    transition: 'transform 0.3s',
  },
  featureIcon: {
    fontSize: '32px',
    display: 'block',
    marginBottom: '10px',
  },
  featureCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#667eea',
    margin: '10px 0 5px 0',
  },
};

export default LoginWithForgotPassword;
