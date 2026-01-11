import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Tag, Empty, Spin, Descriptions, Card, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const LeaveManagement = ({ employeeEmail, employeeName }) => {
  const [leaves, setLeaves] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leaveRecords, setLeaveRecords] = useState([]);

  const LEAVE_TYPES = [
    { label: 'Casual Leave (CL)', value: 'casual_leave', limit: 12 },
    { label: 'Sick Leave (SL)', value: 'sick_leave', limit: 12 },
    { label: 'Earned Leave (EL)', value: 'earned_leave', limit: 20 },
    { label: 'Compensatory Off (CO)', value: 'comp_off', limit: 10 },
    { label: 'Maternity Leave (ML)', value: 'maternity_leave', limit: 180 },
    { label: 'Paternity Leave (PL)', value: 'paternity_leave', limit: 15 },
    { label: 'Marriage Leave', value: 'marriage_leave', limit: 3 },
    { label: 'Bereavement Leave', value: 'bereavement_leave', limit: 3 },
    { label: 'Study Leave', value: 'study_leave', limit: 15 },
  ];

  // Load leaves from localStorage
  useEffect(() => {
    const allLeaves = JSON.parse(localStorage.getItem('allLeaves')) || {};
    if (allLeaves[employeeEmail]) {
      setLeaves(allLeaves[employeeEmail]);
    }
  }, [employeeEmail]);

  // Calculate leave usage
  const calculateLeaveUsage = (leaveType) => {
    const typeLeaves = leaves.filter(
      (l) => l.leaveType === leaveType && (l.status === 'approved' || l.status === 'pending')
    );
    return typeLeaves.reduce((sum, l) => sum + parseInt(l.days || 0), 0);
  };

  // Get leave limit
  const getLeaveLimit = (leaveType) => {
    const type = LEAVE_TYPES.find((t) => t.value === leaveType);
    return type ? type.limit : 0;
  };

  // Show modal
  const showModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = (values) => {
    const newLeave = {
      id: Date.now(),
      email: employeeEmail,
      name: employeeName,
      leaveType: values.leaveType,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
      days: values.endDate.diff(values.startDate, 'days') + 1,
      reason: values.reason,
      status: 'pending',
      appliedOn: new Date().toISOString(),
    };

    const allLeaves = JSON.parse(localStorage.getItem('allLeaves')) || {};
    if (!allLeaves[employeeEmail]) {
      allLeaves[employeeEmail] = [];
    }
    allLeaves[employeeEmail].push(newLeave);
    localStorage.setItem('allLeaves', JSON.stringify(allLeaves));
    setLeaves(allLeaves[employeeEmail]);

    setIsModalVisible(false);
    form.resetFields();
  };

  // Delete leave request
  const handleDeleteLeave = (id) => {
    const allLeaves = JSON.parse(localStorage.getItem('allLeaves')) || {};
    allLeaves[employeeEmail] = allLeaves[employeeEmail].filter((l) => l.id !== id);
    localStorage.setItem('allLeaves', JSON.stringify(allLeaves));
    setLeaves(allLeaves[employeeEmail]);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'processing',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  // Render leave records
  const renderLeaveRecords = () => {
    if (leaves.length === 0) {
      return <Empty description="No leave records found" />;
    }

    return (
      <div className="space-y-4">
        {leaves.map((leave) => (
          <Card key={leave.id} size="small" className="bg-white border border-gray-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <strong className="text-lg">
                    {LEAVE_TYPES.find((t) => t.value === leave.leaveType)?.label}
                  </strong>
                  <Tag color={getStatusColor(leave.status)}>
                    {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                  </Tag>
                </div>
                <p className="text-gray-600 mb-1">
                  <strong>Duration:</strong> {leave.startDate} to {leave.endDate} ({leave.days} day
                  {leave.days > 1 ? 's' : ''})
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Reason:</strong> {leave.reason}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Applied on:</strong> {new Date(leave.appliedOn).toLocaleDateString()}
                </p>
              </div>
              {leave.status === 'pending' && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteLeave(leave.id)}
                  size="small"
                />
              )}
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Render leave balance
  const renderLeaveBalance = () => {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {LEAVE_TYPES.map((type) => (
          <Card key={type.value} size="small" className="text-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="font-semibold text-gray-700 mb-2 text-sm">{type.label}</div>
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {type.limit - calculateLeaveUsage(type.value)}/{type.limit}
            </div>
            <div className="text-xs text-gray-500">Available / Total</div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Leave Management</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Apply Leave
        </Button>
      </div>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: 'Leave Balance',
            children: renderLeaveBalance(),
          },
          {
            key: '2',
            label: 'Leave Records',
            children: renderLeaveRecords(),
          },
        ]}
      />

      <Modal
        title="Apply for Leave"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        centered
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Leave Type"
            name="leaveType"
            rules={[{ required: true, message: 'Please select leave type' }]}
          >
            <Select
              placeholder="Select leave type"
              options={LEAVE_TYPES}
            />
          </Form.Item>
          <Form.Item
            label="From Date"
            name="startDate"
            rules={[{ required: true, message: 'Please select start date' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="To Date"
            name="endDate"
            rules={[{ required: true, message: 'Please select end date' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: 'Please enter reason' }]}
          >
            <Input.TextArea rows={3} placeholder="Please enter reason for leave" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LeaveManagement;
