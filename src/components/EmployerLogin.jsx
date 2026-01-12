import React, { useState } from 'react';
import { Form, Input, Button, Card, Alert, Spin } from 'antd';
import { LoginOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const EmployerLogin = ({ onLoginSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Mock employers database
  const validEmployers = [
    { id: 'emp001', email: 'hr@company1.com', password: 'password123', company: 'Tech Corp', phone: '+91-9876543210' },
    { id: 'emp002', email: 'admin@company2.com', password: 'secure456', company: 'Health Plus', phone: '+91-9876543211' },
    { id: 'emp003', email: 'recruiter@company3.com', password: 'recruit789', company: 'Global Services', phone: '+91-9876543212' },
  ];

  const handleLogin = async (values) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const employer = validEmployers.find(
        (emp) => emp.email === values.email && emp.password === values.password
      );

      if (employer) {
        // Store employer data in localStorage
        localStorage.setItem('loggedInEmployer', JSON.stringify({
          id: employer.id,
          email: employer.email,
          company: employer.company,
          phone: employer.phone,
          loginTime: new Date().toISOString(),
        }));

        form.resetFields();
        onLoginSuccess(employer);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <LoginOutlined className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Employer Portal</h1>
          <p className="text-gray-600 mt-2">Manage your workforce efficiently</p>
        </div>

        {error && (
          <Alert
            message="Login Failed"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
            size="large"
          >
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="hr@company.com"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input
                prefix={<LockOutlined className="text-gray-400" />}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-12 text-lg font-semibold"
              >
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </Form.Item>
          </Form>
        </Spin>

        <div className="mt-6 border-t pt-6">
          <p className="text-xs text-gray-500 text-center mb-4">Demo Credentials:</p>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <div><strong>Email:</strong> hr@company1.com</div>
            <div><strong>Password:</strong> password123</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployerLogin;
