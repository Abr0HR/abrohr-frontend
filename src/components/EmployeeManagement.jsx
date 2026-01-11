import React, { useState } from 'react';

const EmployeeTable = () => {
  const [employees] = useState([
    { id: 'E001', name: 'Rajesh Kumar', dept: 'Sales', joinDate: '2020-03-15', attendance: 92, status: 'Active', performance: 8.2, riskLevel: 'High' },
    { id: 'E002', name: 'Priya Sharma', dept: 'Marketing', joinDate: '2021-06-22', attendance: 98, status: 'Active', performance: 8.8, riskLevel: 'Low' },
    { id: 'E003', name: 'Amit Patel', dept: 'IT', joinDate: '2019-11-10', attendance: 78, status: 'Active', performance: 7.5, riskLevel: 'Critical' },
    { id: 'E004', name: 'Neha Singh', dept: 'HR', joinDate: '2022-01-05', attendance: 96, status: 'Active', performance: 9.1, riskLevel: 'Low' },
    { id: 'E005', name: 'Vikram Malhotra', dept: 'Finance', joinDate: '2020-08-30', attendance: 94, status: 'Active', performance: 8.4, riskLevel: 'Low' },
  ]);

  const getRiskColor = (risk) => risk === 'Critical' ? '#ef4444' : risk === 'High' ? '#f97316' : '#22c55e';

  return (
    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>👥 Employee Directory</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e2e8f0', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>Employee</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>Dept</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>Attendance</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>Performance</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#1e293b' }}>Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp, idx) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                <td style={{ padding: '12px', color: '#1e293b' }}><strong>{emp.name}</strong><br/><span style={{ fontSize: '12px', color: '#64748b' }}>{emp.id}</span></td>
                <td style={{ padding: '12px', color: '#475569' }}>{emp.dept}</td>
                <td style={{ padding: '12px', color: '#475569' }}><span style={{ background: emp.attendance >= 95 ? '#dcfce7' : '#fef3c7', color: emp.attendance >= 95 ? '#166534' : '#92400e', padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}>{emp.attendance}%</span></td>
                <td style={{ padding: '12px', color: '#475569' }}><strong>{emp.performance}/10</strong></td>
                <td style={{ padding: '12px' }}><span style={{ background: getRiskColor(emp.riskLevel) + '20', color: getRiskColor(emp.riskLevel), padding: '6px 12px', borderRadius: '6px', fontWeight: '600', fontSize: '12px' }}>{emp.riskLevel}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LeaveManagement = () => (
  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>📅 Leave Management</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      {[['Total Leave', '30', '#3b82f6'], ['Used', '12', '#f97316'], ['Pending Approvals', '3', '#8b5cf6'], ['Remaining', '18', '#22c55e']].map(([label, val, color], i) => (
        <div key={i} style={{ background: 'white', padding: '16px', borderRadius: '8px', borderTop: `4px solid ${color}` }}>
          <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 8px 0' }}>{label}</p>
          <div style={{ fontSize: '32px', fontWeight: '700', color: color }}>{val}</div>
        </div>
      ))}
    </div>
  </div>
);

const PerformanceMetrics = () => (
  <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', marginTop: '24px' }}>
    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>⭐ Performance Metrics</h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
      {[['Department Performance', [['Sales', 8.1], ['Marketing', 8.6], ['IT', 7.8], ['HR', 8.9]]], ['Skill Distribution', [['Technical', 35], ['Leadership', 28], ['Communication', 22], ['Problem Solving', 15]]]].map(([title, data], i) => (
        <div key={i}><h3 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>{title}</h3>
          {data.map(([label, val], idx) => (<div key={idx} style={{ marginBottom: '12px' }}><div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}><span style={{ fontSize: '13px', color: '#475569' }}>{label}</span><span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{val}{title.includes('Department') ? '/10' : '%'}</span></div><div style={{ background: '#e2e8f0', height: '6px', borderRadius: '3px', overflow: 'hidden' }}><div style={{ background: '#3b82f6', height: '100%', width: (title.includes('Department') ? val * 10 : val) + '%' }}></div></div></div>))}
        </div>
      ))}
    </div>
  </div>
);

const EmployeeManagement = () => (
  <div style={{ padding: '24px' }}>
    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>Employee Management Portal</h1>
    <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 24px 0' }}>Comprehensive HR Management & Analytics</p>
    <EmployeeTable />
    <LeaveManagement />
    <PerformanceMetrics />
  </div>
);

export default EmployeeManagement;
