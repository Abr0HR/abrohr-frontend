import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, Tag, Empty, Card, Space, Upload, message } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const RegularizationRequest = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  // Load requests from localStorage
  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem('regularizationRequests')) || [];
    const userRequests = allRequests.filter((r) => r.employeeEmail === currentUser?.email);
    setRequests(userRequests);
  }, [currentUser]);

  // Handle form submission
  const handleSubmit = (values) => {
    const newRequest = {
      id: Date.now(),
      employeeId: currentUser?.id,
      employeeName: currentUser?.name,
      employeeEmail: currentUser?.email,
      attendanceDate: values.attendanceDate.format('YYYY-MM-DD'),
      reason: values.reason,
      description: values.description,
      supportingDocument: values.supportingDocument || null,
      punchIn: values.punchIn || null,
      punchOut: values.punchOut || null,
      status: 'pending',
      requestedOn: new Date().toISOString(),
    };

    const allRequests = JSON.parse(localStorage.getItem('regularizationRequests')) || [];
    allRequests.push(newRequest);
    localStorage.setItem('regularizationRequests', JSON.stringify(allRequests));
    setRequests([...requests, newRequest]);

    setIsModalVisible(false);
    form.resetFields();
    message.success('Regularization request submitted successfully!');
  };

  // Get status icon and color
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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'processing',
      approved: 'success',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  // Render requests
  const renderRequests = () => {
    if (requests.length === 0) {
      return <Empty description="No regularization requests" />;
    }

    return (
      <div className="space-y-4">
        {requests.map((request) => (
          <Card key={request.id} className="border-l-4" style={{
            borderLeftColor: request.status === 'approved' ? '#52c41a' : request.status === 'rejected' ? '#ff4d4f' : '#faad14',
          }}>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {getStatusIcon(request.status)}
                  <strong className="text-lg">Regularization for {request.attendanceDate}</strong>
                  <Tag color={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Tag>
                </div>
                <p className="text-gray-600 mb-1">
                  <strong>Reason:</strong>{' '}
                  {REGULARIZATION_REASONS.find((r) => r.value === request.reason)?.label}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Description:</strong> {request.description}
                </p>
                {request.punchIn && (
                  <p className="text-gray-600 mb-1">
                    <strong>Time:</strong> {request.punchIn} - {request.punchOut || 'N/A'}
                  </p>
                )}
                <p className="text-gray-500 text-sm">
                  <strong>Requested on:</strong> {new Date(request.requestedOn).toLocaleDateString()}
                </p>
                {request.status === 'rejected' && (
                  <p className="text-red-600 text-sm mt-2">
                    <strong>Rejection Reason:</strong> {request.rejectionReason}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800">Attendance Regularization</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Submit Request
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center bg-white">
          <div className="text-2xl font-bold text-blue-600">{requests.length}</div>
          <div className="text-gray-600 text-sm mt-2">Total Requests</div>
        </Card>
        <Card className="text-center bg-white">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-gray-600 text-sm mt-2">Approved</div>
        </Card>
        <Card className="text-center bg-white">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-gray-600 text-sm mt-2">Pending</div>
        </Card>
      </div>

      {/* Requests List */}
      {renderRequests()}

      {/* Modal for submitting request */}
      <Modal
        title="Submit Attendance Regularization Request"
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Attendance Date"
            name="attendanceDate"
            rules={[{ required: true, message: 'Please select date' }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            label="Reason for Regularization"
            name="reason"
            rules={[{ required: true, message: 'Please select reason' }]}
          >
            <Select placeholder="Select reason" options={REGULARIZATION_REASONS} />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Explain the situation" />
          </Form.Item>
          <Form.Item
            label="Punch In Time (Optional)"
            name="punchIn"
          >
            <Input type="time" placeholder="HH:MM" />
          </Form.Item>
          <Form.Item
            label="Punch Out Time (Optional)"
            name="punchOut"
          >
            <Input type="time" placeholder="HH:MM" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RegularizationRequest;
