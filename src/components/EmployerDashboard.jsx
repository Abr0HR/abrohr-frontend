import React, { useState, useEffect } from 'react';
import { Button, Card, Tabs, Table, Tag, Space, Empty, Modal, Input, Row, Col, Statistic, Badge } from 'antd';
import { LogoutOutlined, UserOutlined, TeamOutlined, FileExcelOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const EmployerDashboard = ({ currentEmployer, onLogout }) => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedTab, setSelectedTab] = useState('employees');
  const [searchText, setSearchText] = useState('');
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: '', email: '', department: '', position: '' });

  // Load data from localStorage on component mount
  useEffect(() => {
    loadEmployeesData();
    loadAttendanceData();
    // Set up interval to sync data every 2 seconds
    const syncInterval = setInterval(() => {
      loadEmployeesData();
      loadAttendanceData();
    }, 2000);
    return () => clearInterval(syncInterval);
  }, []);

  const loadEmployeesData = () => {
    const allEmployees = JSON.parse(localStorage.getItem('allEmployees')) || [];
    setEmployees(allEmployees);
  };

  const loadAttendanceData = () => {
    const attendanceRecords = [];
    const allEmployees = JSON.parse(localStorage.getItem('allEmployees')) || [];
    
    allEmployees.forEach((employee) => {
      const saved = localStorage.getItem(`attendance_${employee.id}`);
      if (saved) {
        const records = JSON.parse(saved);
        records.forEach((record) => {
          attendanceRecords.push({
            employeeId: employee.id,
            employeeName: employee.name,
            email: employee.email,
            ...record,
          });
        });
      }
    });
    setAttendanceData(attendanceRecords);
  };

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email) {
      const employee = {
        id: `emp_${Date.now()}`,
        ...newEmployee,
        createdAt: new Date().toISOString(),
      };
      
      const updated = [...employees, employee];
      localStorage.setItem('allEmployees', JSON.stringify(updated));
      setEmployees(updated);
      setNewEmployee({ name: '', email: '', department: '', position: '' });
      setModalVisible(false);
    }
  };

  const handleDeleteEmployee = (id) => {
    Modal.confirm({
      title: 'Delete Employee',
      content: 'Are you sure you want to delete this employee? This action cannot be undone.',
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        const updated = employees.filter((emp) => emp.id !== id);
        localStorage.setItem('allEmployees', JSON.stringify(updated));
        setEmployees(updated);
      },
    });
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee(employee);
    setModalVisible(true);
  };

  const handleUpdateEmployee = () => {
    if (editingEmployee) {
      const updated = employees.map((emp) =>
        emp.id === editingEmployee.id ? newEmployee : emp
      );
      localStorage.setItem('allEmployees', JSON.stringify(updated));
      setEmployees(updated);
      setEditingEmployee(null);
      setNewEmployee({ name: '', email: '', department: '', position: '' });
      setModalVisible(false);
    }
  };

  const employeeColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEditEmployee(record)}
            size="small"
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEmployee(record.id)}
            size="small"
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const attendanceColumns = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Punch In',
      dataIndex: 'punchIn',
      key: 'punchIn',
    },
    {
      title: 'Punch Out',
      dataIndex: 'punchOut',
      key: 'punchOut',
      render: (text) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Present' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
  ];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchText.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredAttendance = attendanceData.filter((record) =>
    record.employeeName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderEmployeesTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Input.Search
            placeholder="Search employees..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} className="text-right">
          <Button
            type="primary"
            onClick={() => {
              setEditingEmployee(null);
              setNewEmployee({ name: '', email: '', department: '', position: '' });
              setModalVisible(true);
            }}
          >
            + Add Employee
          </Button>
        </Col>
      </Row>

      <Table
        columns={employeeColumns}
        dataSource={filteredEmployees}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 800 }}
      />
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="space-y-4">
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Input.Search
            placeholder="Search by employee name..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      <Table
        columns={attendanceColumns}
        dataSource={filteredAttendance}
        rowKey={(record) => `${record.employeeId}-${record.id}`}
        pagination={{ pageSize: 15 }}
        scroll={{ x: 900 }}
      />
    </div>
  );

  const renderDashboardTab = () => (
    <Row gutter={16}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total Employees"
            value={employees.length}
            prefix={<TeamOutlined />}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Present Today"
            value={attendanceData.filter((r) => {
              const today = new Date().toDateString();
              return new Date(r.date).toDateString() === today && r.status === 'Present';
            }).length}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Absent Today"
            value={employees.length - attendanceData.filter((r) => {
              const today = new Date().toDateString();
              return new Date(r.date).toDateString() === today && r.status === 'Present';
            }).length}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Total Attendance Records"
            value={attendanceData.length}
            prefix={<FileExcelOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
      </Col>
    </Row>
  );

  const tabItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      children: renderDashboardTab(),
    },
    {
      key: 'employees',
      label: 'Employees',
      children: renderEmployeesTab(),
    },
    {
      key: 'attendance',
      label: 'Attendance Records',
      children: renderAttendanceTab(),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="max-w-7xl mx-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
            <p className="text-gray-600 mt-1">{currentEmployer?.company}</p>
          </div>
          <Space>
            <div className="text-sm text-gray-600">
              <Badge status="success" text="Online" />
            </div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={onLogout}
            >
              Logout
            </Button>
          </Space>
        </div>

        <Tabs
          defaultActiveKey="dashboard"
          items={tabItems}
          onChange={(key) => setSelectedTab(key)}
        />
      </Card>

      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        open={modalVisible}
        onOk={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
        onCancel={() => {
          setModalVisible(false);
          setEditingEmployee(null);
          setNewEmployee({ name: '', email: '', department: '', position: '' });
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input
              value={newEmployee.name}
              onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              placeholder="Employee Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              value={newEmployee.email}
              onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              placeholder="employee@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Input
              value={newEmployee.department}
              onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
              placeholder="Department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <Input
              value={newEmployee.position}
              onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
              placeholder="Job Position"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EmployerDashboard;
