import React, { useState } from 'react';

const CompanyRegistrationPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companySize: '1-50',
    industry: '',
    country: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const industries = ['Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 'Education', 'Hospitality', 'Other'];
  const companySizes = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
  const countries = ['India', 'USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Other'];

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('⚠️ Please enter your company name');
      return false;
    }
    if (!formData.companyEmail.includes('@')) {
      setError('⚠️ Please enter a valid company email');
      return false;
    }
    if (!formData.industry) {
      setError('⚠️ Please select an industry');
      return false;
    }
    if (!formData.adminFirstName.trim()) {
      setError('⚠️ Please enter admin first name');
      return false;
    }
    if (!formData.adminEmail.includes('@')) {
      setError('⚠️ Please enter a valid admin email');
      return false;
    }
    if (formData.adminPassword.length < 8) {
      setError('⚠️ Password must be at least 8 characters');
      return false;
    }
    if (formData.adminPassword !== formData.confirmPassword) {
      setError('⚠️ Passwords do not match');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate registration
      setTimeout(() => {
        setSuccess('✅ Company registered successfully! Redirecting...');
        setFormData({
          companyName: '',
          companyEmail: '',
          companyPhone: '',
          companySize: '1-50',
          industry: '',
          country: '',
          adminFirstName: '',
          adminLastName: '',
          adminEmail: '',
          adminPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }, 1500);
    } catch (err) {
      setError('❌ Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
        <h1 style={{ color: '#667eea', textAlign: 'center', margin: '0 0 10px 0' }}>🏢 Company Registration</h1>
        <p style={{ color: '#999', textAlign: 'center', margin: '0 0 30px 0', fontSize: '14px' }}>Register your company and get started with AbrO HR</p>
        
        <form onSubmit={handleRegister}>
          {/* Company Section */}
          <h2 style={{ color: '#667eea', fontSize: '18px', marginTop: '20px', marginBottom: '15px' }}>Company Information</h2>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Company Name</label>
            <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter company name" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Company Email</label>
              <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} placeholder="company@example.com" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Phone</label>
              <input type="tel" name="companyPhone" value={formData.companyPhone} onChange={handleChange} placeholder="+91-XXXXXXXXXX" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Industry</label>
              <select name="industry" value={formData.industry} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                <option value="">Select industry</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Company Size</label>
              <select name="companySize" value={formData.companySize} onChange={handleChange} style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}>
                {companySizes.map(size => <option key={size} value={size}>{size} employees</option>)}
              </select>
            </div>
          </div>

          {/* Admin Section */}
          <h2 style={{ color: '#667eea', fontSize: '18px', marginTop: '30px', marginBottom: '15px' }}>Admin Account Details</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>First Name</label>
              <input type="text" name="adminFirstName" value={formData.adminFirstName} onChange={handleChange} placeholder="First name" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Last Name</label>
              <input type="text" name="adminLastName" value={formData.adminLastName} onChange={handleChange} placeholder="Last name" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '15px', marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Admin Email</label>
            <input type="email" name="adminEmail" value={formData.adminEmail} onChange={handleChange} placeholder="admin@company.com" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? 'text' : 'password'} name="adminPassword" value={formData.adminPassword} onChange={handleChange} placeholder="Min 8 characters" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', paddingRight: '35px' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}>{showPassword ? '👁️' : '👁️‍🗨️'}</button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#333', fontSize: '13px' }}>Confirm Password</label>
              <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm password" style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>
          </div>

          {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginTop: '15px', border: '2px solid #f44336', fontSize: '13px' }}>{error}</div>}
          {success && <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginTop: '15px', border: '2px solid #4caf50', fontSize: '13px' }}>{success}</div>}

          <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '12px', background: isLoading ? '#ccc' : '#667eea', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '20px' }}>
            {isLoading ? '🏢 Creating Company...' : '🏢 Register Company'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '13px' }}>Already registered? <a href="/login" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold' }}>Login here</a></p>

        <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '6px', marginTop: '15px', border: '2px solid #4caf50', textAlign: 'center' }}>
          <p style={{ color: '#2e7d32', margin: '0', fontSize: '12px' }}>🔐 Enterprise-Grade Security | 🔒 Data Encryption | ⛓️ Blockchain Verified</p>
        </div>
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
