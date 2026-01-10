import { useState } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Table, Button, Space, Dropdown, Avatar, Input, Badge, DatePicker, Select, Modal, Form, message, Tabs } from 'antd';
import { UserOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined, DashboardOutlined, TeamOutlined, FileTextOutlined, SettingOutlined, SearchOutlined, BellOutlined, CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, HourglassOutlined, FileExcelOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import './App.css';

const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const { Option } = Select;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [attendanceData, setAttendanceData] = useState([
    { key: '1', empId: 'EMP001', name: 'John Doe', department: 'Engineering', status: 'Present', time: '09:15 AM', date: '10-Jan-2026' },
    { key: '2', empId: 'EMP002', name: 'Jane Smith', department: 'HR', status: 'Present', time: '09:30 AM', date: '10-Jan-2026' },
    { key: '3', empId: 'EMP003', name: 'Mike Johnson', department: 'Sales', status: 'Absent', time: '-', date: '10-Jan-2026' },
    { key: '4', empId: 'EMP004', name: 'Sarah Williams', department: 'Engineering', status: 'On Leave', time: '-', date: '10-Jan-2026' },
    { key: '5', empId: 'EMP005', name: 'Robert Brown', department: 'Finance', status: 'Late', time: '10:45 AM', date: '10-Jan-2026' },
  ]);

  const attendanceColumns = [
    { title: 'Emp ID', dataIndex: 'empId', key: 'empId', width: 100 },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 150 },
    { title: 'Department', dataIndex: 'department', key: 'department', width: 130 },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        let color = 'green';
        let icon = <CheckCircleOutlined />;
        if (status === 'Absent') { color = 'red'; icon = <CloseCircleOutlined />; }
        else if (status === 'On Leave') { color = 'orange'; icon = <HourglassOutlined />; }
        else if (status === 'Late') { color = 'blue'; icon = <ClockCircleOutlined />; }
        return <Badge icon={icon} text={status} color={color} />;
      },
    },
    { title: 'Check-in', dataIndex: 'time', key: 'time', width: 120 },
    { title: 'Date', dataIndex: 'date', key: 'date', width: 120 },
  ];

  const dashboardContent = (
    <>
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <Statistic
              title="Present Today"
              value={12}
              suffix="/ 25"
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <Statistic
              title="Absent Today"
              value={3}
              suffix="/ 25"
              valueStyle={{ color: '#f5222d' }}
              prefix={<CloseCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <Statistic
              title="On Leave"
              value={5}
              suffix="/ 25"
              valueStyle={{ color: '#faad14' }}
              prefix={<HourglassOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            <Statistic
              title="Late Arrivals"
              value={2}
              suffix="/ 25"
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px' }}>
        <div style={{ marginBottom: '20px' }}>
          <Row gutter={16}>
            <Col xs={24} sm={12} lg={8}>
              <DatePicker.RangePicker style={{ width: '100%' }} placeholder={['Start Date', 'End Date']} />
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Select placeholder="Filter by Department" style={{ width: '100%' }}>
                <Option value="all">All Departments</Option>
                <Option value="eng">Engineering</Option>
                <Option value="hr">HR</Option>
                <Option value="sales">Sales</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Input placeholder="Search employee..." prefix={<SearchOutlined />} />
            </Col>
          </Row>
        </div>
        <Table columns={attendanceColumns} dataSource={attendanceData} size="small" pagination={{ pageSize: 10 }} />
      </Card>
    </>
  );

  const analyticsContent = (
    <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <h2>Analytics Coming Soon</h2>
      <p>Detailed attendance analytics and reports will be available here.</p>
    </Card>
  );

  const employeesContent = (
    <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button type="primary" icon={<PlusOutlined />}>Add Employee</Button>
      </div>
      <Table
        columns={[
          { title: 'Emp ID', dataIndex: 'empId', key: 'empId' },
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Department', dataIndex: 'department', key: 'department' },
          { title: 'Status', dataIndex: 'status', key: 'status' },
        ]}
        dataSource={attendanceData}
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );

  const settingsContent = (
    <Card bordered={false} style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
      <h2>Settings</h2>
      <p>Settings page coming soon...</p>
    </Card>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return dashboardContent;
      case 'analytics': return analyticsContent;
      case 'employees': return employeesContent;
      case 'settings': return settingsContent;
      default: return dashboardContent;
    }
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', onClick: () => setActivePage('dashboard') },
    { key: 'analytics', icon: <FileTextOutlined />, label: 'Analytics', onClick: () => setActivePage('analytics') },
    { key: 'employees', icon: <TeamOutlined />, label: 'Employees', onClick: () => setActivePage('employees') },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings', onClick: () => setActivePage('settings') },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={220} style={{ background: '#001529' }}>
        <div style={{ padding: '16px', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>AbrO HR</h1>
          <p style={{ color: '#8c8c8c', fontSize: '12px', margin: '4px 0 0 0' }}>Employee Tracking</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={menuItems}
          style={{ background: '#001529' }}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '18px' }}
          />
          <Space size="large">
            <Button type="text" icon={<BellOutlined style={{ fontSize: '18px' }} />} />
            <Avatar size="large" icon={<UserOutlined />} style={{ background: '#1890ff' }} />
            <Button type="text" icon={<LogoutOutlined />} danger />
          </Space>
        </Header>
        <Content style={{ margin: '24px', background: '#f5f5f5', borderRadius: '4px', padding: '24px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
