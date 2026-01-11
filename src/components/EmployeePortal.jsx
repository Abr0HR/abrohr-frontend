import React, { useState, useEffect } from 'react';

const EmployeePortal = ({ currentUser }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState('attendance');
  const [punchIn, setPunchIn] = useState(null);
  const [punchOut, setPunchOut] = useState(null);
  const [todayPunched, setTodayPunched] = useState(false);

  useEffect(() => {
    // Load attendance records from localStorage
    const savedRecords = localStorage.getItem(`attendance_${currentUser?.id}`);
    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    }
    // Check if today punched in
    const today = new Date().toDateString();
    const todayRecord = attendanceRecords.find(r => new Date(r.date).toDateString() === today);
    setTodayPunched(!!todayRecord);
  }, [currentUser]);

  const handlePunchIn = () => {
    const now = new Date();
    setPunchIn(now.toLocaleTimeString());
    const today = new Date().toDateString();
    const newRecord = {
      id: Math.random(),
      date: new Date().toISOString(),
      punchIn: now.toLocaleTimeString(),
      punchOut: null,
      status: 'Present'
    };
    const updated = [...attendanceRecords, newRecord];
    setAttendanceRecords(updated);
    localStorage.setItem(`attendance_${currentUser?.id}`, JSON.stringify(updated));
    setTodayPunched(true);
  };

  const handlePunchOut = () => {
    const now = new Date();
    setPunchOut(now.toLocaleTimeString());
    const updated = attendanceRecords.map(r => {
      if (!r.punchOut) {
        return { ...r, punchOut: now.toLocaleTimeString() };
      }
      return r;
    });
    setAttendanceRecords(updated);
    localStorage.setItem(`attendance_${currentUser?.id}`, JSON.stringify(updated));
  };

  const today = new Date().toDateString();
  const todayRecord = attendanceRecords.find(r => new Date(r.date).toDateString() === today);

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b' }}>Employee Portal</h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Welcome, {currentUser?.name}!</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button
          onClick={() => setSelectedTab('attendance')}
          style={{
            padding: '12px 24px',
            background: selectedTab === 'attendance' ? '#3b82f6' : 'transparent',
            color: selectedTab === 'attendance' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          ⏱ Attendance Tracking
        </button>
        <button
          onClick={() => setSelectedTab('profile')}
          style={{
            padding: '12px 24px',
            background: selectedTab === 'profile' ? '#3b82f6' : 'transparent',
            color: selectedTab === 'profile' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          👤 My Profile
        </button>
      </div>

      {selectedTab === 'attendance' && (
        <div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Quick Punch In/Out</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ color: '#64748b', marginBottom: '8px' }}>Punch In Time:</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#0369a1' }}>{punchIn || todayRecord?.punchIn || '--:--'}</p>
              </div>
              <div>
                <p style={{ color: '#64748b', marginBottom: '8px' }}>Punch Out Time:</p>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#dc2626' }}>{punchOut || todayRecord?.punchOut || '--:--'}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button
                onClick={handlePunchIn}
                disabled={todayPunched && !punchOut}
                style={{
                  padding: '12px 24px',
                  background: todayPunched && !punchOut ? '#9ca3af' : '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                ✅ Punch In
              </button>
              <button
                onClick={handlePunchOut}
                disabled={!todayPunched || (todayRecord?.punchOut)}
                style={{
                  padding: '12px 24px',
                  background: !todayPunched || (todayRecord?.punchOut) ? '#9ca3af' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px'
                }}
              >
                ❌ Punch Out
              </button>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Attendance History</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Punch In</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Punch Out</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, idx) => (
                  <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                    <td style={{ padding: '12px' }}>{new Date(record.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px' }}>{record.punchIn}</td>
                    <td style={{ padding: '12px' }}>{record.punchOut || '-'}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: record.status === 'Present' ? '#dcfce7' : '#fee2e2',
                        color: record.status === 'Present' ? '#166534' : '#991b1b',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {attendanceRecords.length === 0 && (
              <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No attendance records yet</p>
            )}
          </div>
        </div>
      )}

      {selectedTab === 'profile' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>My Profile Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Employee ID</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{currentUser?.id || '-'}</p>
            </div>
            <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Full Name</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{currentUser?.name || '-'}</p>
            </div>
            <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Email</p>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{currentUser?.email || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePortal;
