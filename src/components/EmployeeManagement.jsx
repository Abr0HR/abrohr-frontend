import React, { useState, useEffect } from 'react';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    dept: '',
    joinDate: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance'];

  // Load from localStorage on component mount
  useEffect(() => {
    const savedEmployees = localStorage.getItem('abrohr_employees');
    if (savedEmployees) {
      try {
        const parsedEmployees = JSON.parse(savedEmployees);
        setEmployees(parsedEmployees);
      } catch (error) {
        console.error('Error loading employees from localStorage:', error);
        setEmployees(getDefaultEmployees());
      }
    } else {
      setEmployees(getDefaultEmployees());
    }
  }, []);

  // Save to localStorage whenever employees change
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('abrohr_employees', JSON.stringify(employees));
    }
  }, [employees]);

  const getDefaultEmployees = () => [
    { id: 'E001', name: 'Rajesh Kumar', dept: 'Sales', joinDate: '2020-03-15', attendance: 92, status: 'Active', email: 'rajesh@abrohr.com', phone: '9876543210' },
    { id: 'E002', name: 'Priya Sharma', dept: 'Marketing', joinDate: '2021-06-22', attendance: 85, status: 'Active', email: 'priya@abrohr.com', phone: '9876543211' },
    { id: 'E003', name: 'Amit Patel', dept: 'IT', joinDate: '2019-11-10', attendance: 78, status: 'Active', email: 'amit@abrohr.com', phone: '9876543212' },
    { id: 'E004', name: 'Neha Singh', dept: 'HR', joinDate: '2022-01-05', attendance: 96, status: 'Active', email: 'neha@abrohr.com', phone: '9876543213' },
    { id: 'E005', name: 'Vikram Malhotra', dept: 'Finance', joinDate: '2020-08-30', attendance: 88, status: 'Active', email: 'vikram@abrohr.com', phone: '9876543214' }
  ];

  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      dept: '',
      joinDate: '',
      email: '',
      phone: '',
      status: 'Active'
    });
    setEditingId(null);
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
      setEmployees(employees.map(e => e.id === editingId ? { ...formData, attendance: e.attendance } : e));
    } else {
      const newId = 'E' + String(Math.max(...employees.map(e => parseInt(e.id.slice(1))), 0) + 1).padStart(3, '0');
      setEmployees([...employees, { ...formData, id: newId, attendance: 85, status: 'Active' }]);
    }
    setShowForm(false);
  };

  const filteredEmployees = employees.filter(emp =>
    (emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.id.includes(searchTerm))
    && (filterDept === '' || emp.dept === filterDept)
  );

  const getRiskColor = (risk) => risk === 'Critical' ? '#ef4444' : risk === 'High' ? '#f97316' : '#22c55e';

  return (
    <div style={{ padding: '20px', background: '#f8f9fa' }}>
      <div>
        <input
          type="text"
          placeholder="🔍 Search by name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '12px' }}
        />
        <div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '12px' }}
          >
            <option value="">All Departments</option>
            {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
          </select>
        </div>
        <button
          onClick={handleAdd}
          style={{ padding: '10px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginBottom: '12px', fontWeight: '500' }}
        >
          ➕ Add Employee
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <input type="text" placeholder="Name *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
            <select value={formData.dept} onChange={(e) => setFormData({ ...formData, dept: e.target.value })} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <option value="">Select Department *</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
            <input type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }} />
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Leave">Leave</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Save</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Department</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Email</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Join Date</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Attendance %</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#475569' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, idx) => (
              <tr key={emp.id} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ padding: '12px' }}><strong>{emp.id}</strong></td>
                <td style={{ padding: '12px' }}>{emp.name}</td>
                <td style={{ padding: '12px' }}>{emp.dept}</td>
                <td style={{ padding: '12px' }}>{emp.email || '-'}</td>
                <td style={{ padding: '12px' }}>{emp.joinDate || '-'}</td>
                <td style={{ padding: '12px' }}><strong>{emp.attendance || 0}%</strong></td>
                <td style={{ padding: '12px' }}>
                  <span style={{ background: emp.status === 'Active' ? '#dcfce7' : '#fee2e2', color: emp.status === 'Active' ? '#166534' : '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => { setFormData(emp); setEditingId(emp.id); setShowForm(true); }} style={{ padding: '4px 8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '4px', fontSize: '12px' }}>✎ Edit</button>
                  <button onClick={() => handleDelete(emp.id)} style={{ padding: '4px 8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '16px', padding: '12px', background: '#e0f2fe', borderRadius: '6px', color: '#0369a1', fontSize: '14px' }}>
        Total Employees: <strong>{employees.length}</strong> | Displayed: <strong>{filteredEmployees.length}</strong> | Capacity: <strong>50+</strong>
      </div>
    </div>
  );
};

export default EmployeeManagement;
