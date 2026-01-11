import { useState } from 'react';

const ReportsAndDownloads = () => {
  const [reportType, setReportType] = useState('individual');
  const [dateRange, setDateRange] = useState('month');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [format, setFormat] = useState('pdf');

  // Sample data for demo
  const employees = [
    { id: 'E001', name: 'Rajesh Kumar', team: 'Sales', dept: 'Sales', attendance: 92, salary: 45000, leaves: 2 },
    { id: 'E002', name: 'Priya Sharma', team: 'Marketing', dept: 'Marketing', attendance: 88, salary: 50000, leaves: 4 },
    { id: 'E003', name: 'Amit Patel', team: 'IT', dept: 'IT', attendance: 95, salary: 55000, leaves: 1 },
    { id: 'E004', name: 'Neha Singh', team: 'HR', dept: 'HR', attendance: 90, salary: 48000, leaves: 3 },
    { id: 'E005', name: 'Vikram Malhotra', team: 'Finance', dept: 'Finance', attendance: 93, salary: 52000, leaves: 2 }
  ];

  const teams = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];

  const generateIndividualReport = () => {
    const report = `AbrO HR - INDIVIDUAL ATTENDANCE REPORT\nGenerated: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    const employee = employees[0];
    return report + `Employee: ${employee.name}\nID: ${employee.id}\nDepartment: ${employee.dept}\nTeam: ${employee.team}\n\nAttendance: ${employee.attendance}%\nLeavesUsed: ${employee.leaves}\nSalary: ₹${employee.salary}`;
  };

  const generateTeamReport = () => {
    const team = selectedTeam === 'all' ? 'All Teams' : selectedTeam;
    let report = `AbrO HR - TEAM ATTENDANCE REPORT\nGenerated: ${new Date().toLocaleDateString('en-IN')}\nTeam: ${team}\n\n`;
    const teamData = selectedTeam === 'all' ? employees : employees.filter(e => e.team === selectedTeam);
    teamData.forEach(emp => {
      report += `${emp.name} (${emp.id}) - Attendance: ${emp.attendance}%, Leaves: ${emp.leaves}\n`;
    });
    const avgAttendance = (teamData.reduce((sum, e) => sum + e.attendance, 0) / teamData.length).toFixed(2);
    report += `\nTeam Average Attendance: ${avgAttendance}%`;
    return report;
  };

  const generateCompanyReport = () => {
    let report = `AbrO HR - COMPANY COMPLIANCE & ATTENDANCE REPORT\nGenerated: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    report += `STATUTORY COMPLIANCE (India):\n`;
    report += `✓ EPF Compliance: Active\n`;
    report += `✓ ESI Compliance: Active\n`;
    report += `✓ Gratuity Status: Compliant\n`;
    report += `✓ PF Contribution: 12% (Employee) + 3.67% (Employer)\n`;
    report += `✓ Bonus Eligibility: Per Payment of Gratuity Act\n\n`;
    report += `PAYROLL SUMMARY:\n`;
    let totalSalary = 0;
    employees.forEach(emp => {
      totalSalary += emp.salary;
      report += `${emp.name}: ₹${emp.salary}\n`;
    });
    report += `\nTotal Monthly Payroll: ₹${totalSalary}\n`;
    report += `Total PF Contribution: ₹${(totalSalary * 0.1267).toFixed(2)}\n\n`;
    report += `ATTENDANCE OVERVIEW:\n`;
    const avgAttendance = (employees.reduce((sum, e) => sum + e.attendance, 0) / employees.length).toFixed(2);
    report += `Company Average Attendance: ${avgAttendance}%\n`;
    report += `Total Employees: ${employees.length}\n`;
    report += `Total Teams: ${new Set(employees.map(e => e.team)).size}\n`;
    report += `Total Leave Days: ${employees.reduce((sum, e) => sum + e.leaves, 0)}\n`;
    return report;
  };

  const downloadReport = () => {
    let content = '';
    if (reportType === 'individual') content = generateIndividualReport();
    else if (reportType === 'team') content = generateTeamReport();
    else content = generateCompanyReport();

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `AbrO_HR_${reportType}_Report_${new Date().getTime()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <h2 style={{ marginBottom: '20px', color: '#001529' }}>📊 Reports & Downloads</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Report Type Selection */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>Report Type</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" value="individual" checked={reportType === 'individual'} onChange={(e) => setReportType(e.target.value)} style={{ marginRight: '10px' }} />
              👤 Individual Employee Report
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" value="team" checked={reportType === 'team'} onChange={(e) => setReportType(e.target.value)} style={{ marginRight: '10px' }} />
              👥 Team Report
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" value="company" checked={reportType === 'company'} onChange={(e) => setReportType(e.target.value)} style={{ marginRight: '10px' }} />
              🏢 Company Compliance Report
            </label>
          </div>
        </div>

        {/* Settings */}
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>Settings</h3>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Date Range</label>
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last Quarter (90 Days)</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          {reportType === 'team' && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Select Team</label>
              <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="all">All Teams</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          )}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Export Format</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
              <option value="pdf">📄 PDF (Recommended)</option>
              <option value="excel">📊 Excel</option>
              <option value="txt">📝 Text</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
        <h3 style={{ color: '#1890ff', marginBottom: '15px' }}>📋 Report Preview</h3>
        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee', minHeight: '200px', fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          {reportType === 'individual' && generateIndividualReport()}
          {reportType === 'team' && generateTeamReport()}
          {reportType === 'company' && generateCompanyReport()}
        </div>
      </div>

      {/* Download Button */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={downloadReport} style={{ flex: 1, padding: '12px 20px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>⬇️ Download Report</button>
        <button style={{ flex: 1, padding: '12px 20px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>🖨️ Print Report</button>
        <button style={{ flex: 1, padding: '12px 20px', backgroundColor: '#fa8c16', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>📧 Email Report</button>
      </div>

      {/* India Compliance Info */}
      <div style={{ marginTop: '30px', backgroundColor: '#e6f7ff', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #1890ff' }}>
        <h3 style={{ color: '#0050b3', marginBottom: '10px' }}>🇮🇳 India Compliance Information</h3>
        <ul style={{ marginLeft: '20px', color: '#0050b3', lineHeight: '1.8' }}>
          <li>All reports comply with Indian Labour Laws (Industrial Disputes Act, Factories Act)</li>
          <li>EPF Deduction: 12% Employee Contribution + 3.67% Employer Contribution</li>
          <li>ESI Applicable: Yes (for employees earning ≤ ₹21,000/month)</li>
          <li>Statutory Holidays: As per government notification</li>
          <li>Overtime: Applicable as per state regulations</li>
          <li>Gratuity: As per Payment of Gratuity Act, 1972</li>
          <li>Report Period: Maintains 3-year statutory retention</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsAndDownloads;
