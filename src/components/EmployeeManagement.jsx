import React, { useState } from 'react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([
    { id: 'E001', name: 'Rajesh Kumar', dept: 'Sales', joinDate: '2020-03-15', attendance: 92, status: 'Active', performance: 8.2, riskLevel: 'High', email: 'rajesh@abrohr.com', phone: '9876543210' },
    { id: 'E002', name: 'Priya Sharma', dept: 'Marketing', joinDate: '2021-06-22', attendance: 98, status: 'Active', performance: 8.8, riskLevel: 'Low', email: 'priya@abrohr.com', phone: '9876543211' },
    { id: 'E003', name: 'Amit Patel', dept: 'IT', joinDate: '2019-11-10', attendance: 78, status: 'Active', performance: 7.5, riskLevel: 'Critical', email: 'amit@abrohr.com', phone: '9876543212' },
    { id: 'E004', name: 'Neha Singh', dept: 'HR', joinDate: '2022-01-05', attendance: 96, status: 'Active', performance: 9.1, riskLevel: 'Low', email: 'neha@abrohr.com', phone: '9876543213' },
    { id: 'E005', name: 'Vikram Malhotra', dept: 'Finance', joinDate: '2020-08-30', attendance: 94, status: 'Active', performance: 8.4, riskLevel: 'Low', email: 'vikram@abrohr.com', phone: '9876543214' },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [formData, setFormData] = useState({
    id: '', name: '', dept: '', joinDate: '', email: '', phone: '', status: 'Active'
  });

  const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];

  const handleAdd = () => {
    setFormData({ id: '', name: '', dept: '', joinDate: '', email: '', phone: '', status: 'Active' });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (emp) => {
    setFormData(emp);
    setEditingId(emp.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.dept || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (editingId) {
      setEmployees(employees.map(e => e.id === editingId ? { ...formData, attendance: e.attendance, performance: e.performance, riskLevel: e.riskLevel } : e));
    } else {
      const newId = 'E' + String(Math.max(...employees.map(e => parseInt(e.id.slice(1)))) + 1).padStart(3, '0');
      setEmployees([...employees, { ...formData, id: newId, attendance: 85, performance: 8.0, riskLevel: 'Low' }]);
    }
    setShowForm(false);
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.includes(searchTerm)) &&
    (!filterDept || emp.dept === filterDept)
  );

  const getRiskColor = (risk) => risk === 'Critical' ? '#ef4444' : risk === 'High' ? '#f97316' : '#22c55e';

  return (
    <div style={{ padding: '24px', background: '#f0f4f8' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>👥 Employee Management</h1>
        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>Manage your employees and their profiles</p>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 150px', gap: '12px', alignItems: 'center' }}>
          <div>
            <input
              type="text"
              placeholder="🔍 Search by name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
          </div>
          <div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            >
              <option value="">All Departments</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
          <button
            onClick={handleAdd}
            style={{ padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >
            ➕ Add Employee
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
            <select
              value={formData.dept}
              onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            >
              <option value="">Select Department *</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
            <input
              type="date"
              value={formData.joinDate}
              onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button
              onClick={handleSave}
              style={{ padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              ✅ Save
            </button>
            <button
              onClick={() => setShowForm(false)}
              style={{ padding: '10px 20px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>Employee Directory ({filteredEmployees.length})</h3>
        {filteredEmployees.length === 0 ? (
          <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No employees found</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Employee</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Dept</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569', fontSize: '13px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp, idx) => (
                <tr key={emp.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ padding: '12px', color: '#1e293b' }}>
                    <strong>{emp.name}</strong><br/>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{emp.id}</span>
                  </td>
                  <td style={{ padding: '12px', color: '#475569', fontSize: '14px' }}>{emp.dept}</td>
                  <td style={{ padding: '12px', color: '#475569', fontSize: '14px' }}>{emp.email}</td>
                  <td style={{ padding: '12px', color: '#475569', fontSize: '14px' }}>{emp.phone}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ background: emp.status === 'Active' ? '#dcfce7' : '#fee2e2', color: emp.status === 'Active' ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      {emp.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleEdit(emp)}
                      style={{ padding: '6px 10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginRight: '6px' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      style={{ padding: '6px 10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
