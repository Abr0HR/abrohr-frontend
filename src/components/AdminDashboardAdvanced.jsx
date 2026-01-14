import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Statistic, Table, Button, Select, DatePicker, Modal, Form, Input, Progress, Tag, Chart, Chart as ReactChart } from 'antd';
import { TeamOutlined, DollarOutlined, FileOutlined, AlertOutlined, UserAddOutlined, LogoutOutlined, FileExcelOutlined, DownloadOutlined } from '@ant-design/icons';

const AdminDashboardAdvanced = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'John Doe', email: 'john@company.com', department: 'Engineering', salary: 50000, status: 'Active', joinDate: '2022-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@company.com', department: 'HR', salary: 45000, status: 'Active', joinDate: '2021-06-10' },
    { id: 3, name: 'Mike Johnson', email: 'mike@company.com', department: 'Sales', salary: 55000, status: 'Active', joinDate: '2023-03-20' },
  ]);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, employee: 'John Doe', type: 'Sick', from: '2024-12-20', to: '2024-12-22', status: 'Pending' },
    { id: 2, employee: 'Jane Smith', type: 'Personal', from: '2024-12-25', to: '2024-12-26', status: 'Approved' },
  ]);
  const [attendance, setAttendance] = useState([
    { date: '2024-12-15', present: 28, absent: 2, late: 1, leave: 2 },
    { date: '2024-12-14', present: 29, absent: 1, late: 2, leave: 1 },
    { date: '2024-12-13', present: 30, absent: 2, late: 1, leave: 0 },
  ]);
  const [payrollData, setPayrollData] = useState([
    { month: 'December 2024', totalSalary: 1500000, tax: 150000, deductions: 50000, netPayout: 1300000 },
    { month: 'November 2024', totalSalary: 1500000, tax: 150000, deductions: 50000, netPayout: 1300000 },
  ]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [form] = Form.useForm();

  const employeeColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Department', dataIndex: 'department', key: 'department' },
    { title: 'Salary', dataIndex: 'salary', key: 'salary', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag> },
    { title: 'Join Date', dataIndex: 'joinDate', key: 'joinDate' },
  ];

  const leaveColumns = [
    { title: 'Employee', dataIndex: 'employee', key: 'employee' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'From', dataIndex: 'from', key: 'from' },
    { title: 'To', dataIndex: 'to', key: 'to' },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => {
      let color = status === 'Approved' ? 'green' : status === 'Pending' ? 'orange' : 'red';
      return <Tag color={color}>{status}</Tag>;
    } },
    { title: 'Action', key: 'action', render: () => (
      <>
        <Button type="primary" size="small" style={{ marginRight: 8 }}>Approve</Button>
        <Button danger size="small">Reject</Button>
      </>
    ) },
  ];

  const attendanceColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Present', dataIndex: 'present', key: 'present' },
    { title: 'Absent', dataIndex: 'absent', key: 'absent' },
    { title: 'Late', dataIndex: 'late', key: 'late' },
    { title: 'On Leave', dataIndex: 'leave', key: 'leave' },
  ];

  const payrollColumns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Total Salary', dataIndex: 'totalSalary', key: 'totalSalary', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Tax', dataIndex: 'tax', key: 'tax', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Deductions', dataIndex: 'deductions', key: 'deductions', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Net Payout', dataIndex: 'netPayout', key: 'netPayout', render: (val) => `₹${val.toLocaleString()}` },
  ];

  const handleAddEmployee = () => {
    setShowAddEmployee(false);
    form.resetFields();
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Button danger onClick={onLogout} style={{ float: 'right', marginBottom: '20px' }}>Logout</Button>
      <h1>Admin Dashboard</h1>

      {/* Key Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Employees" value={employees.length} prefix={<TeamOutlined />} valueStyle={{ color: '#1890ff' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Total Payroll" value={1500000} prefix="₹" valueStyle={{ color: '#52c41a' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Pending Leaves" value={leaveRequests.filter(l => l.status === 'Pending').length} prefix={<AlertOutlined />} valueStyle={{ color: '#faad14' }} /></Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card><Statistic title="Attendance Rate" value={93.3} suffix="%" valueStyle={{ color: '#ff4d4f' }} /></Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Employees Tab */}
          <Tabs.TabPane tab="Employees" key="1">
            <Button type="primary" icon={<UserAddOutlined />} onClick={() => setShowAddEmployee(true)} style={{ marginBottom: '16px' }}>Add Employee</Button>
            <Table columns={employeeColumns} dataSource={employees} pagination={{ pageSize: 10 }} />
          </Tabs.TabPane>

          {/* Leave Management Tab */}
          <Tabs.TabPane tab="Leave Requests" key="2">
            <Table columns={leaveColumns} dataSource={leaveRequests} pagination={false} />
          </Tabs.TabPane>

          {/* Attendance Tab */}
          <Tabs.TabPane tab="Attendance" key="3">
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={12}>
                <Button icon={<DownloadOutlined />} type="primary">Export Attendance</Button>
              </Col>
            </Row>
            <Table columns={attendanceColumns} dataSource={attendance} pagination={false} />
          </Tabs.TabPane>

          {/* Payroll Tab */}
          <Tabs.TabPane tab="Payroll" key="4">
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col xs={24} sm={12}>
                <Button icon={<FileExcelOutlined />} type="primary">Generate Payroll Report</Button>
              </Col>
            </Row>
            <Table columns={payrollColumns} dataSource={payrollData} pagination={false} />
          </Tabs.TabPane>

          {/* Analytics Tab */}
          <Tabs.TabPane tab="Analytics" key="5">
            <Row gutter={16}>
              <Col xs={24} lg={12}>
                <Card title="Attendance Trend">
                  <p>Present: 30 | Absent: 2 | Late: 1 | Leave: 0</p>
                  <Progress type="circle" percent={93.75} />
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Department Breakdown">
                  <p>Engineering: 15 | HR: 5 | Sales: 13</p>
                  <Progress type="circle" percent={100} />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* Add Employee Modal */}
      <Modal title="Add New Employee" visible={showAddEmployee} onOk={handleAddEmployee} onCancel={() => setShowAddEmployee(false)}>
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Department" name="department" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Engineering">Engineering</Select.Option>
              <Select.Option value="HR">HR</Select.Option>
              <Select.Option value="Sales">Sales</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Salary" name="salary" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboardAdvanced;
