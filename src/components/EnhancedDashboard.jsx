import React, { useState } from 'react';

// Attrition Prediction Engine
const AttrictionPredictor = () => {
  const [data] = useState([
    { id: 'E001', name: 'Rajesh Kumar', risk: 78, status: 'CRITICAL', indicators: ['High Absence', 'Low Engagement'] },
    { id: 'E002', name: 'Priya Sharma', risk: 45, status: 'MEDIUM', indicators: ['Occasional Absence'] },
    { id: 'E003', name: 'Amit Patel', risk: 82, status: 'CRITICAL', indicators: ['Very High Absence', 'Disengagement'] },
  ]);

  const getRiskColor = (risk) => risk >= 75 ? '#ef4444' : risk >= 50 ? '#f97316' : '#22c55e';

  return (
    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>🔮 Attrition Risk Analysis</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {data.map((emp) => (
          <div key={emp.id} style={{ background: 'white', borderRadius: '8px', padding: '16px', border: `3px solid ${getRiskColor(emp.risk)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div><h3 style={{ margin: '0', fontSize: '16px', color: '#1e293b' }}>{emp.name}</h3><p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b' }}>{emp.id}</p></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: '700', color: getRiskColor(emp.risk) }}>{emp.risk}%</div><div style={{ fontSize: '11px', color: getRiskColor(emp.risk) }}>{emp.status}</div></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analytics = () => (
  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>📊 Analytics</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}><p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>Engagement</p><div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>7.8/10</div></div>
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #8b5cf6' }}><p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>Wellness</p><div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6' }}>68%</div></div>
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #ec4899' }}><p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>Morale</p><div style={{ fontSize: '32px', fontWeight: '700', color: '#ec4899' }}>82%</div></div>
      <div style={{ background: 'white', padding: '16px', borderRadius: '8px', borderLeft: '4px solid #06b6d4' }}><p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>Productivity</p><div style={{ fontSize: '32px', fontWeight: '700', color: '#06b6d4' }}>91%</div></div>
    </div>
  </div>
);

const Wellness = () => (
  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>❤️ Wellness Metrics</h2>
    <div style={{ display: 'grid', gap: '12px' }}>
      {['Work-Life Balance', 'Career Growth', 'Compensation', 'Mentorship'].map((metric, i) => <div key={i}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{metric}</span><span style={{ fontSize: '13px', fontWeight: '600', color: '#3b82f6' }}>{72 + i*3}/10</span></div><div style={{ background: '#e0e7ff', borderRadius: '4px', height: '8px' }}><div style={{ background: '#3b82f6', height: '100%', width: (72 + i*3) + '%' }}></div></div></div>)}
    </div>
  </div>
);

const EnhancedDashboard = () => (
  <div style={{ padding: '24px' }}>
    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>HR Intelligence Dashboard</h1>
    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>Psychology-Based Attrition Prediction & Analytics</p>
    <AttrictionPredictor />
    <Analytics />
    <Wellness />
  </div>
);

export default EnhancedDashboard;
