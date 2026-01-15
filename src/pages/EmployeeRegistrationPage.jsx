import React, { useState } from 'react';

const EmployeeRegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    position: '',
    department: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const departments = ['Engineering', 'HR', 'Sales', 'Marketing', 'Finance', 'Operations', 'IT', 'Admin'];
  const positions = ['Developer', 'Manager', 'Analyst', 'Consultant', 'Executive', 'Admin', 'Trainee', 'Intern'];

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      setError('⚠️ Please enter your first name');
      return false;
    }
    if (!formData.lastName.trim()) {
      setError('⚠️ Please enter your last name');
      return false;
    }
    if (!formData.email.trim()) {
      setError('⚠️ Please enter your email address');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('⚠️ Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 8) {
      setError('⚠️ Password must be at least 8 characters');
      return false;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError('⚠️ Password must contain uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError('⚠️ Password must contain a number');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('⚠️ Passwords do not match');
      return false;
    }
    if (!formData.company.trim()) {
      setError('⚠️ Please enter your company');
      return false;
    }
    if (!formData.position) {
      setError('⚠️ Please select your position');
      return false;
    }
    if (!formData.department) {
      setError('⚠️ Please select your department');
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSuccess(`✅ Welcome ${formData.firstName}! Your account has been created successfully.`);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        company: '',
        position: '',
        department: '',
        phone: ''
      });
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '12px', maxWidth: '600px', width: '100%', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
        <h1 style={{ color: '#667eea', textAlign: 'center', margin: '0 0 10px 0' }}✨ Create Your Account</h1>
        <p style={{ color: '#999', textAlign: 'center', margin: '0 0 30px 0', fontSize: '14px' }}>Join AbrO HR and manage your attendance seamlessly</p>
        
        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>First Name</label>
              <input 
                type="text" 
                name="firstName"
                value={formData.firstName} 
                onChange={handleChange} 
                placeholder="John" 
                style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Last Name</label>
              <input 
                type="text" 
                name="lastName"
                value={formData.lastName} 
                onChange={handleChange} 
                placeholder="Doe" 
                style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px', marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email} 
              onChange={handleChange} 
              placeholder="john@example.com" 
              style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password"
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Min 8 chars" 
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box', paddingRight: '35px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Confirm Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="Repeat password" 
                style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Company</label>
              <input 
                type="text" 
                name="company"
                value={formData.company} 
                onChange={handleChange} 
                placeholder="Tech Corp" 
                style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Position</label>
              <select 
                name="position"
                value={formData.position} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
              >
                <option value="">Select position</option>
                {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>Department</label>
            <select 
              name="department"
              value={formData.department} 
              onChange={handleChange} 
              style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            >
              <option value="">Select department</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>

          {error && <p style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginTop: '15px', border: '2px solid #f44336', margin: '15px 0' }}>{error}</p>}
          {success && <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px', borderRadius: '6px', marginTop: '15px', border: '2px solid #4caf50', margin: '15px 0' }}>{success}</p>}

          <button 
            type="submit" 
            disabled={isLoading}
            style={{ width: '100%', padding: '12px', background: isLoading ? '#ccc' : '#4caf50', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '16px', cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '20px' }}
          >
            {isLoading ? '🔄 Creating Account...' : '✨ Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '15px', color: '#666' }}>Already have an account? <a href="/" style={{ color: '#667eea', textDecoration: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Login here</a></p>
        </form>

        <div style={{ background: '#e8f5e9', padding: '12px', borderRadius: '6px', marginTop: '20px', border: '2px solid #4caf50', textAlign: 'center' }}>
          <p style={{ color: '#2e7d32', margin: '0', fontSize: '12px' }}🔐 Your data is securely encrypted with AES-256</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegistrationPage;
