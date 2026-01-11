import React, { useState, useEffect } from 'react';
import { Button, Card, Tabs, Tag, Space, Empty } from 'antd';
import { LogoutOutlined, ClockCircleOutlined } from '@ant-design/icons';
import LeaveManagement from './LeaveManagement';

const EmployeePortal = ({ currentUser }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState('attendance');
  const [punchIn, setPunchIn] = useState(null);
  const [punchOut, setPunchOut] = useState(null);
  const [todayPunched, setTodayPunched] = useState(false);
  const [employeeName, setEmployeeName] = useState('');

  useEffect(() => {
    // Load attendance records from localStorage
    const savedRecords = localStorage.getItem(`attendance_${currentUser?.id}`);
    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    }

    // Get employee name
    const allEmployees = JSON.parse(localStorage.getItem('allEmployees')) || [];
    const employee = allEmployees.find((e) => e.email === currentUser?.email);
    if (employee) {
      setEmployeeName(employee.name);
    }

    // Check if today punched in
    const today = new Date().toDateString();
    const todayRecord = attendanceRecords.find(
      (r) => new Date(r.date).toDateString() === today
    );
    setTodayPunched(!!todayRecord);
  }, [currentUser]);

  const handlePunchIn = () => {
    const now = new Date();
    setPunchIn(now.toLocaleTimeString());

    const newRecord = {
      id: Math.random(),
      date: new Date().toISOString(),
      punchIn: now.toLocaleTimeString(),
      punchOut: null,
      status: 'Present',
    };

    const updated = [...attendanceRecords, newRecord];
    setAttendanceRecords(updated);
    localStorage.setItem(`attendance_${currentUser?.id}`, JSON.stringify(updated));
    setTodayPunched(true);
  };

  const handlePunchOut = () => {
    const now = new Date();
    setPunchOut(now.toLocaleTimeString());

    const updated = [...attendanceRecords];
    updated[updated.length - 1].punchOut = now.toLocaleTimeString();
    setAttendanceRecords(updated);
    localStorage.setItem(`attendance_${currentUser?.id}`, JSON.stringify(updated));
  };

  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            <ClockCircleOutlined /> Daily Attendance
          </h3>
          <Space direction="vertical" size="large">
            {todayPunched ? (
              <div className="text-lg">
                <Tag color="green">Punched In: {punchIn}</Tag>
                {punchOut && <Tag color="blue">Punched Out: {punchOut}</Tag>}
              </div>
            ) : (
              <div>No punch recorded for today</div>
            )}
            <Space>
              <Button
                type="primary"
                size="large"
                onClick={handlePunchIn}
                disabled={todayPunched}
              >
                Punch In
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handlePunchOut}
                disabled={!todayPunched || punchOut}
              >
                Punch Out
              </Button>
            </Space>
          </Space>
        </div>
      </Card>

      <Card title="Attendance Records" className="border border-gray-200">
        {attendanceRecords.length === 0 ? (
          <Empty description="No attendance records found" />
        ) : (
          <div className="space-y-3">
            {attendanceRecords.map((record) => (
              <Card key={record.id} size="small" className="bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>{new Date(record.date).toLocaleDateString()}</strong>
                  </div>
                  <Space>
                    <Tag color="blue">
                      In: {record.punchIn}
                    </Tag>
                    {record.punchOut && (
                      <Tag color="cyan">
                        Out: {record.punchOut}
                      </Tag>
                    )}
                    <Tag color={record.status === 'Present' ? 'green' : 'red'}>
                      {record.status}
                    </Tag>
                  </Space>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const tabItems = [
    {
      key: 'attendance',
      label: 'Attendance',
      children: renderAttendanceTab(),
    },
    {
      key: 'leave',
      label: 'Leave Management',
      children: (
        <LeaveManagement
          employeeEmail={currentUser?.email}
          employeeName={employeeName}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employee Portal</h1>
            <p className="text-gray-600 mt-1">Welcome, {employeeName || currentUser?.email}</p>
          </div>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem('loggedInEmployee');
              window.location.reload();
            }}
          >
            Logout
          </Button>
        </div>

        <Tabs
          defaultActiveKey="attendance"
          items={tabItems}
          onChange={(key) => setSelectedTab(key)}
        />
      </Card>
    </div>
  );
};

export default EmployeePortal;
