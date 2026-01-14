import { useState } from 'react';
import './App.css';
import LoginWithForgotPassword from './components/LoginWithForgotPassword';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is already logged in
  if (localStorage.getItem('isLoggedIn') === 'true') {
    const userRole = localStorage.getItem('userRole');
    return (
      <div style={styles.container}>
        <h1>Dashboard</h1>
        <p>Welcome, {userRole}!</p>
        <button onClick={() => {
          localStorage.clear();
          window.location.reload();
        }} style={styles.logoutButton}>
          Logout
        </button>
      </div>
    );
  }

  return <LoginWithForgotPassword />;
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
  },
  logoutButton: {
    padding: '10px 20px',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default App;
