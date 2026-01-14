import React, { useState } from 'react';
import { Card, Tabs, Button, Table, Modal, Form, Input, Select, DatePicker, Upload, Row, Col, Statistic, Space, Tag, Timeline, Progress, Alert, Spin } from 'antd';
import { DollarOutlined, FileOutlined, HeartOutlined, LogoutOutlined, ClockCircleOutlined, CheckCircleOutlined, FileDownloadOutlined, PlusOutlined } from '@ant-design/icons';

const EmployeePortalEnhanced = ({ employee, onLogout }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [payrollHistory, setPayrollHistory] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leaveForm] = Form.useForm();

  // Sample data
  const mockPayrollData = [
    { month: 'December 2024', salary: 50000, tax: 5000, deductions: 2000, net: 43000, status: 'Credited' },
    { month: 'November 2024', salary: 50000, tax: 5000, deductions: 2000, net: 43000, status: 'Credited' },
    { month: 'October 2024', salary: 50000, tax: 5000, deductions: 2000, net: 43000, status: 'Credited' },
  ];

  const mockBenefits = [
    { id: 1, name: 'Health Insurance', provider: 'Apollo Hospitals', status: 'Active', expiry: '2025-12-31' },
    { id: 2, name: '401(k) Plan', provider: 'Fidelity', status: 'Active', contribution: '10%' },
    { id: 3, name: 'Life Insurance', provider: 'LIC', status: 'Active', coverage: '₹50,00,000' },
  ];

  const mockDocuments = [
    { id: 1, name: 'Offer Letter', date: '2022-01-15', type: 'PDF', size: '250 KB' },
    { id: 2, name: 'Employment Agreement', date: '2022-01-20', type: 'PDF', size: '180 KB' },
    { id: 3, name: 'Latest Appraisal', date: '2024-12-01', type: 'PDF', size: '320 KB' },
  ];

  const handleLeaveRequest = () => {
    setIsModalVisible(false);
    leaveForm.resetFields();
  };

  const payrollColumns = [
    { title: 'Month', dataIndex: 'month', key: 'month' },
    { title: 'Salary', dataIndex: 'salary', key: 'salary', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Tax', dataIndex: 'tax', key: 'tax', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Deductions', dataIndex: 'deductions', key: 'deductions', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Net', dataIndex: 'net', key: 'net', render: (val) => `₹${val.toLocaleString()}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (val) => <Tag color="green">{val}</Tag> },
  ];

  const documentColumns = [
    { title: 'Document', dataIndex: 'name', key: 'name' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Size', dataIndex: 'size', key: 'size' },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="primary" icon={<FileDownloadOutlined />} size="small">Download</Button>,
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Button danger onClick={onLogout} style={{ float: 'right', marginBottom: '20px' }}>Logout</Button>
      <h1>Welcome, {employee?.name || 'Employee'}</h1>

      {/* Key Statistics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Annual Salary" value={600000} prefix="₹" valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Leave Balance" value={12} suffix="days" valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Attendance" value={95.5} suffix="%" valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Pending Requests" value={2} valueStyle={{ color: '#ff4d4f' }} />
          </Card>
        </Col>
      </Row>

      {/* Main Tabs */}
      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          {/* Payroll Tab */}
          <Tabs.TabPane tab="Payroll" key="1">
            <Table columns={payrollColumns} dataSource={mockPayrollData} pagination={false} />
          </Tabs.TabPane>

          {/* Benefits Tab */}
          <Tabs.TabPane tab="Benefits" key="2">
            <Row gutter={16}>
              {mockBenefits.map((benefit) => (
                <Col xs={24} sm={12} lg={8} key={benefit.id}>
                  <Card title={benefit.name} extra={<Tag color="green">Active</Tag>}>
                    <p>Provider: {benefit.provider}</p>
                    {benefit.expiry && <p>Expiry: {benefit.expiry}</p>}
                    {benefit.contribution && <p>Contribution: {benefit.contribution}</p>}
                    {benefit.coverage && <p>Coverage: {benefit.coverage}</p>}
                  </Card>
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>

          {/* Documents Tab */}
          <Tabs.TabPane tab="Documents" key="3">
            <Table columns={documentColumns} dataSource={mockDocuments} pagination={false} />
          </Tabs.TabPane>

          {/* Leave Management Tab */}
          <Tabs.TabPane tab="Leave" key="4">
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)} style={{ marginBottom: '16px' }}>
              Request Leave
            </Button>
            <Table columns={[
              { title: 'Type', dataIndex: 'type', key: 'type' },
              { title: 'From', dataIndex: 'from', key: 'from' },
              { title: 'To', dataIndex: 'to', key: 'to' },
              { title: 'Days', dataIndex: 'days', key: 'days' },
              { title: 'Status', dataIndex: 'status', key: 'status', render: (status) => {
                let color = status === 'Approved' ? 'green' : status === 'Pending' ? 'orange' : 'red';
                return <Tag color={color}>{status}</Tag>;
              } },
            ]} dataSource={leaveRequests} pagination={false} />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      {/* Leave Request Modal */}
      <Modal title="Request Leave" visible={isModalVisible} onOk={handleLeaveRequest} onCancel={() => setIsModalVisible(false)}>
        <Form form={leaveForm} layout="vertical">
          <Form.Item label="Leave Type" name="leaveType" rules={[{ required: true }]}>
            <Select placeholder="Select leave type">
              <Select.Option value="sick">Sick Leave</Select.Option>
              <Select.Option value="personal">Personal Leave</Select.Option>
              <Select.Option value="casual">Casual Leave</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="From Date" name="fromDate" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="To Date" name="toDate" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item label="Reason" name="reason">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeePortalEnhanced;
