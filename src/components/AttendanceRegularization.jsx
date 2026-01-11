import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Tag, Empty, Card, Tabs, Space, Checkbox, DatePicker } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const AttendanceRegularization = ({ employees }) => {
  const [regularizationRequests, setRegularizationRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [form] = Form.useForm();

  const REGULARIZATION_REASONS = [
    { label: 'Biometric System Failure', value: 'biometric_failure' },
    { label: 'Network Issue', value: 'network_issue' },
    { label: 'Client Visit/Off-site Meeting', value: 'client_visit' },
    { label: 'Medical Emergency', value: 'medical_emergency' },
    { label: 'System Error', value: 'system_error' },
    { label: 'Forgot to Mark Attendance', value: 'forgot_marking' },
    { label: 'WFH (Work From Home)', value: 'wfh' },
    { label: 'Field Work', value: 'field_work' },
    { label: 'Other', value: 'other' },
  ];

  // Load regularization requests from localStorage
  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('regularizationRequests')) || [];
    setRegularizationRequests(allRequests);
  }, []);

  // Handle approval
  const handleApprove = (requestId) => {
    const updatedRequests = regularizationRequests.map((req) =>
      req.id === requestId
        ? { ...req, status: 'approved', approvedOn: new Date().toISOString(), approvedBy: 'employer@abrohr.com' }
        : req
    );
    setRegularizationRequests(updatedRequests);
    localStorage.setItem('regularizationRequests', JSON.stringify(updatedRequests));

    // Update employee attendance record if approved
    updateEmployeeAttendance(requestId, updatedRequests);
  };

  // Handle rejection
  const handleReject = (requestId, reason) => {
    const updatedRequests = regularizationRequests.map((req) =>
      req.id === requestId
        ? { ...req, status: 'rejected', rejectedOn: new Date().toISOString(), rejectionReason: reason }
        : req
    );
    setRegularizationRequests(updatedRequests);
    localStorage.setItem('regularizationRequests', JSON.stringify(updatedRequests));
  };

  // Update employee's attendance record when regularization is approved
  const updateEmployeeAttendance = (requestId, requests) => {
    const request = requests.find((r) => r.id === requestId);
    if (request && request.status === 'approved') {
      const attendanceKey = `attendance_${request.employeeId}`;
      const existingRecords = JSON.parse(localStorage.getItem(attendanceKey)) || [];

      // Add or update attendance record
      const updatedRecords = [
        ...existingRecords,
        {
          id: Math.random(),
          date: request.attendanceDate,
          punchIn: request.punchIn || '09:00:00',
          punchOut: request.punchOut || '18:00:00',
          status: 'Present',
          regularized: true,
          regularizationId: requestId,
        },
      ];

      localStorage.setItem(attendanceKey, JSON.stringify(updatedRecords));
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      pending: 'processing',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  // Render pending requests
  const renderPendingRequests = () => {
    const pendingRequests = regularizationRequests.filter((r) => r.status === 'pending');

    if (pendingRequests.length === 0) {
      return <Empty description="No pending regularization requests" />;
    }

    return (
      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <Card key={request.id} className="border-l-4 border-l-yellow-500">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-lg font-bold mb-2">
                  {request.employeeName} ({request.employeeEmail})
                </h4>
                <p className="text-gray-600 mb-1">
                  <strong>Date:</strong> {request.attendanceDate}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Reason:</strong>{' '}
                  {REGULARIZATION_REASONS.find((r) => r.value === request.reason)?.label || request.reason}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Description:</strong> {request.description}
                </p>
                {request.supportingDocument && (
                  <p className="text-gray-600 mb-1">
                    <strong>Document:</strong> {request.supportingDocument}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  <strong>Requested on:</strong> {new Date(request.requestedOn).toLocaleDateString()}
                </p>
              </div>
              <Space direction="vertical" size="small">
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  size="small"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: 'Reject Regularization Request',
                      content: (
                        <div>
                          <p>Provide reason for rejection:</p>
                          <Input.TextArea
                            id="rejection-reason"
                            placeholder="Reason for rejection"
                            rows={3}
                          />
                        </div>
                      ),
                      okText: 'Reject',
                      cancelText: 'Cancel',
                      onOk() {
                        const reason = document.getElementById('rejection-reason')?.value || '';
                        handleReject(request.id, reason);
                      },
                    });
                  }}
                >
                  Reject
                </Button>
              </Space>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Render processed requests
  const renderProcessedRequests = () => {
    const processed = regularizationRequests.filter((r) => r.status !== 'pending');

    if (processed.length === 0) {
      return <Empty description="No processed requests" />;
    }

    return (
      <div className="space-y-3">
        {processed.map((request) => (
          <Card key={request.id} size="small" className="bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(request.status)}
                  <strong>{request.employeeName}</strong>
                  <Tag color={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Tag>
                </div>
                <p className="text-gray-600 text-sm">
                  <strong>Date:</strong> {request.attendanceDate} | <strong>Reason:</strong>{' '}
                  {REGULARIZATION_REASONS.find((r) => r.value === request.reason)?.label}
                </p>
                {request.status === 'approved' && (
                  <p className="text-green-600 text-sm mt-1">
                    Approved on {new Date(request.approvedOn).toLocaleDateString()}
                  </p>
                )}
                {request.status === 'rejected' && (
                  <p className="text-red-600 text-sm mt-1">
                    Rejected: {request.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  // Render statistics
  const totalRequests = regularizationRequests.length;
  const pendingCount = regularizationRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = regularizationRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = regularizationRequests.filter((r) => r.status === 'rejected').length;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Attendance Regularization</h2>
        <p className="text-gray-600 mb-6">
          Manage employee attendance regularization requests with approval workflow
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="text-center bg-white">
          <div className="text-3xl font-bold text-blue-600">{totalRequests}</div>
          <div className="text-gray-600 text-sm mt-2">Total Requests</div>
        </Card>
        <Card className="text-center bg-white">
          <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-gray-600 text-sm mt-2">Pending</div>
        </Card>
        <Card className="text-center bg-white">
          <div className="text-3xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-gray-600 text-sm mt-2">Approved</div>
        </Card>
        <Card className="text-center bg-white">
          <div className="text-3xl font-bold text-red-600">{rejectedCount}</div>
          <div className="text-gray-600 text-sm mt-2">Rejected</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: `Pending Requests (${pendingCount})`,
            children: renderPendingRequests(),
          },
          {
            key: '2',
            label: `Processed Requests (${approvedCount + rejectedCount})`,
            children: renderProcessedRequests(),
          },
        ]}
      />
    </div>
  );
};

export default AttendanceRegularization;
