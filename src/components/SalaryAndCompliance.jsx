import { useState } from 'react';

const SalaryAndCompliance = () => {
  const [activeTab, setActiveTab] = useState('salary');
  const [selectedMonth, setSelectedMonth] = useState('January');

  const employees = [
    { id: 'E001', name: 'Rajesh Kumar', ctc: 540000, basic: 200000, hra: 80000, da: 40000 },
    { id: 'E002', name: 'Priya Sharma', ctc: 600000, basic: 220000, hra: 88000, da: 44000 },
    { id: 'E003', name: 'Amit Patel', ctc: 660000, basic: 240000, hra: 96000, da: 48000 },
    { id: 'E004', name: 'Neha Singh', ctc: 576000, basic: 210000, hra: 84000, da: 42000 },
    { id: 'E005', name: 'Vikram Malhotra', ctc: 624000, basic: 230000, hra: 92000, da: 46000 }
  ];

  const calculateDeductions = (ctc) => {
    const pf = ctc * 0.12;
    const esi = ctc <= 252000 ? ctc * 0.0075 : 0;
    const tax = ctc * 0.05;
    return { pf, esi, tax };
  };

  const calculateNetSalary = (emp) => {
    const deductions = calculateDeductions(emp.ctc);
    return emp.basic - deductions.pf - deductions.esi - deductions.tax;
  };

  const complianceChecks = [
    { item: 'EPF Registration (EPFO)', status: true, dueDate: 'Q4 2024' },
    { item: 'ESI Registration', status: true, dueDate: 'Q4 2024' },
    { item: 'PAN Registration (All Employees)', status: true, dueDate: 'Ongoing' },
    { item: 'Aadhaar Seeding with EPF', status: true, dueDate: 'Q1 2024' },
    { item: 'Annual Salary Revision', status: false, dueDate: 'By Feb 2024' },
    { item: 'Gratuity Calculation Review', status: false, dueDate: 'By Mar 2024' },
    { item: 'Income Tax TDS Quarterly Return', status: true, dueDate: 'Q4 2024' },
    { item: 'Form 16 Preparation', status: false, dueDate: 'By May 2024' },
    { item: 'STCG Tax Compliance', status: true, dueDate: 'Ongoing' },
    { item: 'Labour Law Audit', status: true, dueDate: 'Q4 2024' }
  ];

  const statutoryDeductions = [
    { name: 'EPF (Employee)', rate: '12%', minSalary: 'Basic+DA', description: 'Contributory Provident Fund' },
    { name: 'ESI (Employee)', rate: '0.75%', minSalary: 'CTCupto 21k', description: 'Employee State Insurance' },
    { name: 'Income Tax', rate: 'Slab Based', minSalary: 'As per IT Act', description: 'Direct Tax - Slab wise' },
    { name: 'Professional Tax', rate: 'State Wise', minSalary: 'Variable', description: 'State Government Tax' }
  ];

  const payrollSummary = employees.map(emp => ({
    ...emp,
    gross: emp.basic + emp.hra + emp.da,
    deductions: calculateDeductions(emp.ctc),
    net: calculateNetSalary(emp)
  }));

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#001529' }}>💰 Salary & Compliance Management</h2>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
        <button onClick={() => setActiveTab('salary')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'salary' ? '#1890ff' : 'transparent', color: activeTab === 'salary' ? 'white' : '#666', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>💵 Payroll Management</button>
        <button onClick={() => setActiveTab('compliance')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'compliance' ? '#1890ff' : 'transparent', color: activeTab === 'compliance' ? 'white' : '#666', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✅ Compliance Tracker</button>
        <button onClick={() => setActiveTab('deductions')} style={{ padding: '10px 20px', backgroundColor: activeTab === 'deductions' ? '#1890ff' : 'transparent', color: activeTab === 'deductions' ? 'white' : '#666', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📋 Statutory Deductions</button>
      </div>

      {/* Payroll Management Tab */}
      {activeTab === 'salary' && (
        <div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>Monthly Salary Breakdown</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f2f5', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Employee</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>CTC</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Gross</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>PF (12%)</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>ESI</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Tax</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#52c41a', fontWeight: 'bold' }}>Net Pay</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollSummary.map((emp, idx) => {
                    const deductions = calculateDeductions(emp.ctc);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #eee', backgroundColor: idx % 2 === 0 ? '#fafafa' : 'white' }}>
                        <td style={{ padding: '12px' }}>{emp.name}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{emp.ctc}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{emp.gross}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{deductions.pf.toFixed(0)}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{deductions.esi.toFixed(0)}</td>
                        <td style={{ padding: '12px', textAlign: 'right' }}>₹{deductions.tax.toFixed(0)}</td>
                        <td style={{ padding: '12px', textAlign: 'right', color: '#52c41a', fontWeight: 'bold' }}>₹{emp.net.toFixed(0)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Tracker Tab */}
      {activeTab === 'compliance' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>🇮🇳 India Statutory Compliance Checklist</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {complianceChecks.map((check, idx) => (
              <div key={idx} style={{ padding: '15px', backgroundColor: check.status ? '#f6ffed' : '#fff2f0', border: `2px solid ${check.status ? '#52c41a' : '#ff7875'}`, borderRadius: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px', marginRight: '10px' }}>{check.status ? '✅' : '⚠️'}</span>
                  <strong>{check.item}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>Due: {check.dueDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statutory Deductions Tab */}
      {activeTab === 'deductions' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>Statutory Deduction Guidelines (India)</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '15px' }}>
            {statutoryDeductions.map((ded, idx) => (
              <div key={idx} style={{ padding: '15px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '6px' }}>
                <h4 style={{ color: '#0050b3', marginBottom: '8px' }}>{ded.name}</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Rate:</strong> {ded.rate}</p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}><strong>Applicable on:</strong> {ded.minSalary}</p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>{ded.description}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff7e6', borderLeft: '4px solid #fa8c16', borderRadius: '4px' }}>
            <h4 style={{ color: '#d46b08', marginBottom: '10px' }}>📌 Important Notes:</h4>
            <ul style={{ marginLeft: '20px', color: '#666', lineHeight: '1.8' }}>
              <li>EPF: Mandatory for all establishments with 20+ employees</li>
              <li>ESI: Mandatory if monthly salary ≤ ₹21,000</li>
              <li>Income Tax: As per IT Act slab for current FY (2023-24)</li>
              <li>Professional Tax: Varies by state (₹0 - ₹2,500 per annum)</li>
              <li>Employer also contributes 3.67% to EPF</li>
              <li>All calculations are as per latest government notifications</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalaryAndCompliance;
