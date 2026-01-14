import React, { useState } from 'react';
import emailService from '../services/EmailNotificationService';

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Generate temporary password
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      
      // Send password reset email
      const result = await emailService.sendPasswordResetEmail(
        email,
        tempPassword,
        'https://abrohr-frontend.vercel.app/reset-password'
      );

      if (result.success) {
        setMessage('Password reset link sent to your email. Check your inbox!');
        setEmailSent(true);
        setEmail('');
      } else {
        setError(result.message || 'Failed to send reset email. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your email and try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        <p style={styles.subtitle}>Enter your email address to receive a password reset link</p>
        
        {emailSent ? (
          <div style={styles.successBox}>
            <p style={styles.successText}>✓ Reset link sent successfully!</p>
            <p style={styles.infoText}>Check your email for password reset instructions.</p>
            <button onClick={onBack} style={styles.backButton}>
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordReset} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={styles.input}
            />
            
            {error && <p style={styles.errorText}>{error}</p>}
            {message && <p style={styles.successText}>{message}</p>}
            
            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <button 
              type="button"
              onClick={onBack}
              style={styles.backButton}
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    transition: 'border-color 0.3s',
  },
  submitButton: {
    padding: '12px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  backButton: {
    padding: '12px',
    background: 'transparent',
    color: '#667eea',
    border: '1px solid #667eea',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '14px',
    marginTop: '-10px',
  },
  successText: {
    color: '#28a745',
    fontSize: '14px',
    marginTop: '-10px',
  },
  successBox: {
    background: '#f0f8f4',
    padding: '20px',
    borderRadius: '8px',
    borderLeft: '4px solid #28a745',
  },
  infoText: {
    color: '#666',
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default ForgotPassword;
