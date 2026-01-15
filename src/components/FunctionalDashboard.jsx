import React, { useState } from 'react';
import apiClient from '../services/apiClient';

const FunctionalDashboard = ({ employeeData, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [leaves, setLeaves] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [leaveForm, setLeaveForm] = useState({ type: 'annual', fromDate: '', toDate: '', reason: '' });

  const handleMarkAttendance = async () => {
    try {
      setLoading(true);
      const result = await apiClient.markAttendance(employeeData.id, 'present', 'office', 'Marked via portal');
      setMessage('✅ Attendance marked successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to mark attendance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.fromDate || !leaveForm.toDate) {
      setMessage('❌ Please fill all fields');
      return;
    }
    try {
      setLoading(true);
      await apiClient.applyLeave(employeeData.id, leaveForm.type, leaveForm.fromDate, leaveForm.toDate, leaveForm.reason);
      setMessage('✅ Leave applied successfully!');
      setLeaveForm({ type: 'annual', fromDate: '', toDate: '', reason: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to apply leave: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAttendance = async () => {
    try {
      setLoading(true);
      const now = new Date();
      const records = await apiClient.getAttendance(employeeData.id, now.getMonth() + 1, now.getFullYear());
      setAttendanceRecords(records || []);
    } catch (error) {
      setMessage('Note: Attendance feature coming soon');
    } finally {
      setLoading(false);
    }
  };

  const dashboardStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '20px' };
  const containerStyle = { background: 'white', borderRadius: '12px', padding: '30px', maxWidth: '900px', margin: '0 auto', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' };
  const buttonStyle = { padding: '12px 20px', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginRight: '10px', marginBottom: '10px' };
  const tabButtonStyle = { ...buttonStyle, background: '#667eea', color: 'white' };
  const activeTabStyle = { ...tabButtonStyle, background: '#764ba2' };

  return (
    <div style={dashboardStyle}>
      <div style={containerStyle}>
        <h1 style={{ color: '#667eea', textAlign: 'center', marginBottom: '10px' }}>Welcome, {employeeData.name}! 👋</h1>
        <p style={{ color: '#999', textAlign: 'center', marginBottom: '30px' }}>Employee ID: {employeeData.id}</p>

        {message && <div style={{ background: message.includes('✅') ? '#e8f5e9' : '#ffebee', color: message.includes('✅') ? '#2e7d32' : '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>{message}</div>}

        <div style={{ marginBottom: '20px', borderBottom: '2px solid #ddd' }}>
          <button style={activeTab === 'dashboard' ? activeTabStyle : tabButtonStyle} onClick={() => setActiveTab('dashboard')}>📊 Dashboard</button>
          <button style={activeTab === 'attendance' ? activeTabStyle : tabButtonStyle} onClick={() => setActiveTab('attendance')}>✓ Mark Attendance</button>
          <button style={activeTab === 'leaves' ? activeTabStyle : tabButtonStyle} onClick={() => setActiveTab('leaves')}>🏖️ Leave Management</button>
          <button style={activeTab === 'payslips' ? activeTabStyle : tabButtonStyle} onClick={() => setActiveTab('payslips')}>💳 Payslips</button>
        </div>

        {activeTab === 'dashboard' && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Dashboard Overview</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px' }}>
                <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>COMPANY</p>
                <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px' }}>{employeeData.company}</p>
              </div>
              <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px' }}>
                <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>POSITION</p>
                <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px' }}>{employeeData.position}</p>
              </div>
              <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px' }}>
                <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>DEPARTMENT</p>
                <p style={{ color: '#667eea', fontWeight: 'bold', fontSize: '16px' }}>{employeeData.department}</p>
              </div>
              <div style={{ background: '#f0f4ff', padding: '15px', borderRadius: '8px' }}>
                <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>STATUS</p>
                <p style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '16px' }}>Active</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Mark Attendance</h2>
            <button 
              style={{ ...buttonStyle, background: '#4caf50', color: 'white', fontSize: '16px', padding: '15px 30px' }}
              onClick={handleMarkAttendance}
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '✓ Mark Present'}
            </button>
            <button 
              style={{ ...buttonStyle, background: '#2196f3', color: 'white', fontSize: '16px', padding: '15px 30px' }}
              onClick={handleFetchAttendance}
              disabled={loading}
            >
              {loading ? '⏳ Loading...' : '📋 View Attendance'}
            </button>
          </div>
        )}

        {activeTab === 'leaves' && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Apply for Leave</h2>
            <form onSubmit={handleApplyLeave}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Leave Type</label>
                <select 
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="annual">Annual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="casual">Casual Leave</option>
                  <option value="maternity">Maternity Leave</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>From Date</label>
                <input 
                  type="date" 
                  value={leaveForm.fromDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>To Date</label>
                <input 
                  type="date" 
                  value={leaveForm.toDate}
                  onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reason</label>
                <textarea 
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '2px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', minHeight: '80px' }}
                  placeholder="Enter reason for leave"
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                style={{ ...buttonStyle, background: '#667eea', color: 'white', fontSize: '16px', padding: '12px 30px' }}
              >
                {loading ? '⏳ Applying...' : '✈️ Apply Leave'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'payslips' && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>Payslips</h2>
            <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ color: '#999' }}>Payslip feature coming soon...</p>
              <p style={{ fontSize: '12px', color: '#bbb' }}>Your payslips will be available here</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button 
            onClick={onLogout}
            style={{ ...buttonStyle, background: '#f44336', color: 'white', padding: '12px 30px', fontSize: '16px' }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default FunctionalDashboard;
