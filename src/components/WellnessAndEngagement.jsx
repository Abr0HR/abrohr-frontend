import React, { useState } from 'react';

const WellnessAndEngagement = () => {
  const [selectedTab, setSelectedTab] = useState('wellness');
  const [wellnessData] = useState([
    { id: 1, title: 'Health Checkup', date: '2024-01-15', description: 'Annual health checkup program' },
    { id: 2, title: 'Yoga Sessions', date: '2024-01-20', description: 'Weekly yoga and meditation classes' },
    { id: 3, title: 'Mental Health Workshop', date: '2024-02-01', description: 'Stress management and wellness' },
    { id: 4, title: 'Fitness Challenge', date: '2024-02-10', description: '30-day fitness challenge with rewards' }
  ]);

  const [engagementData] = useState([
    { id: 1, title: 'Team Building Event', date: '2024-01-25', participants: 45, status: 'Completed' },
    { id: 2, title: 'Company Picnic', date: '2024-02-15', participants: 78, status: 'Upcoming' },
    { id: 3, title: 'Cultural Fest', date: '2024-03-01', participants: 120, status: 'Upcoming' },
    { id: 4, title: 'Sports Tournament', date: '2024-03-15', participants: 60, status: 'Upcoming' }
  ]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div style={{ padding: '20px', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Wellness & Engagement</h1>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Explore employee wellness programs and engagement activities</p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0' }}>
        <button
          onClick={() => handleTabChange('wellness')}
          style={{
            padding: '12px 24px',
            background: selectedTab === 'wellness' ? '#3b82f6' : 'transparent',
            color: selectedTab === 'wellness' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
        >
          💚 Wellness Programs
        </button>
        <button
          onClick={() => handleTabChange('engagement')}
          style={{
            padding: '12px 24px',
            background: selectedTab === 'engagement' ? '#3b82f6' : 'transparent',
            color: selectedTab === 'engagement' ? 'white' : '#64748b',
            border: 'none',
            borderRadius: '6px 6px 0 0',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '16px',
            transition: 'all 0.3s ease'
          }}
        >
          🎉 Engagement Activities
        </button>
      </div>

      {selectedTab === 'wellness' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {wellnessData.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', transition: 'transform 0.2s' }}>
              <div style={{ background: '#dbeafe', color: '#0369a1', padding: '10px', borderRadius: '6px', marginBottom: '12px', textAlign: 'center', fontWeight: '600' }}>
                {item.title}
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>📅 {item.date}</p>
              <p style={{ color: '#475569', fontSize: '14px' }}>{item.description}</p>
              <button style={{ width: '100%', padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '12px', fontWeight: '600' }}>Register</button>
            </div>
          ))}
        </div>
      )}

      {selectedTab === 'engagement' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {engagementData.map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <div style={{ background: '#fce7f3', color: '#be185d', padding: '10px', borderRadius: '6px', marginBottom: '12px', textAlign: 'center', fontWeight: '600' }}>
                {item.title}
              </div>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>📅 {item.date}</p>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '8px' }}>👥 {item.participants} participants</p>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                background: item.status === 'Completed' ? '#dcfce7' : '#fef3c7',
                color: item.status === 'Completed' ? '#166534' : '#854d0e',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '20px', background: '#e0f2fe', borderRadius: '12px', textAlign: 'center' }}>
        <h3 style={{ color: '#0369a1', marginBottom: '10px' }}>✨ Engage Better, Succeed Together</h3>
        <p style={{ color: '#0369a1' }}>Participate in wellness and engagement programs to build stronger connections with your team.</p>
      </div>
    </div>
  );
};

export default WellnessAndEngagement;
