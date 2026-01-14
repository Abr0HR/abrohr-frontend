import { useState } from 'react';
import './App.css';
import EmployeePortalLoginPage from './pages/EmployeePortalLogin';

function App() {
  // Check if user is already logged in
  if (localStorage.getItem('isLoggedIn') === 'true') {
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    return (
      <div style={styles.dashboardContainer}>
        <div style={styles.dashboardCard}>
          <h1 style={styles.dashboardTitle}>Welcome to AbrO HR</h1>
          <p style={styles.dashboardSubtitle}>Employee Portal Dashboard</p>
          <div style={styles.userInfo}>
            <p><strong>Email:</strong> {userEmail}</p>
            <p><strong>Role:</strong> {userRole}</p>
          </div>
          <button onClick={() => {
            localStorage.clear();
            window.location.reload();
          }} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return <EmployeePortalLoginPage />;
}

const styles = {
  dashboardContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  dashboardCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '600px',
    textAlign: 'center',
  },
  dashboardTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 10px 0',
  },
  dashboardSubtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0 0 30px 0',
  },
  userInfo: {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    textAlign: 'left',
  },
  logoutButton: {
    padding: '12px 30px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
};

export default App;
