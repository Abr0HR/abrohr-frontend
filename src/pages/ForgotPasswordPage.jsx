import React, { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // Simulating email send - In production, this would call a backend API
      // that integrates with Mailchimp, SendGrid, or similar service
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': 'YOUR_BREVO_API_KEY', // Use environment variable in production
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: [{ email: email }],
          sender: { email: 'noreply@abrohr.com', name: 'AbrO HR' },
          subject: 'Password Reset Request - AbrO HR',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px;">
              <h2 style="color: #667eea;">Password Reset Request</h2>
              <p>Hi,</p>
              <p>We received a request to reset your password. Click the link below to create a new password:</p>
              <a href="${window.location.origin}/reset-password?email=${encodeURIComponent(email)}" style="background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
              <p>If you didn't request this, you can ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
              <p style="color: #999; font-size: 12px;">🔐 AbrO HR - Professional Attendance & HR Management System</p>
            </div>
          `
        })
      });

      if (response.ok) {
        setEmailSent(true);
        setMessage('Password reset link has been sent to your email!');
        setEmail('');
        setTimeout(() => {
          setEmailSent(false);
        }, 5000);
      } else {
        setMessage('Failed to send email. Please try again later.');
      }
    } catch (error) {
      setMessage('Email service temporarily unavailable. Please try again.');
      console.error('Email error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '450px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: '#667eea', textAlign: 'center', margin: '0 0 10px 0' }}>🔑 Forgot Password?</h1>
        <p style={{ color: '#999', textAlign: 'center', margin: '0 0 30px 0', fontSize: '14px' }}>Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="your.email@example.com" 
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '16px', boxSizing: 'border-box' }}
            />
          </div>

          {message && (
            <div style={{
              background: emailSent ? '#e8f5e9' : '#ffebee',
              color: emailSent ? '#2e7d32' : '#c62828',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '20px',
              border: emailSent ? '2px solid #4caf50' : '2px solid #f44336',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading ? '#ccc' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {isLoading ? '📧 Sending...' : '📧 Send Reset Link'}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Login</a>
        </div>

        <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '6px', marginTop: '20px', border: '2px solid #4caf50', textAlign: 'center' }}>
          <p style={{ color: '#2e7d32', margin: '0', fontSize: '13px' }}>📧 Secure Email with Encryption | 🔐 Password Protected</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
