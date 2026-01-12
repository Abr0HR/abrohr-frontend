import React, { useState } from 'react';
import { Form, Input, Button, Card, Steps, Alert, Spin, message } from 'antd';
import { LockOutlined, MailOutlined, ArrowRightOutlined } from '@ant-design/icons';
import NotificationService from './NotificationService';

const PasswordReset = ({ onResetSuccess, onBackToLogin }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailForReset, setEmailForReset] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleEmailSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');

      // Check if employer exists
      const employers = JSON.parse(localStorage.getItem('employers')) || [];
      const employer = employers.find(e => e.email === values.email);

      if (!employer) {
        setError('No account found with this email address.');
        setLoading(false);
        return;
      }

      // Generate reset token
      const token = `reset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setResetToken(token);
      setEmailForReset(values.email);

      // Store reset request
      const resetRequests = JSON.parse(localStorage.getItem('passwordResets')) || [];
      resetRequests.push({
        email: values.email,
        token,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      });
      localStorage.setItem('passwordResets', JSON.stringify(resetRequests));

      NotificationService.success(
        'Reset Link Sent',
        `A password reset link has been sent to ${values.email}. For demo, here's your token: ${token.substring(0, 20)}...`
      );

      setCurrentStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTokenVerification = async (values) => {
    try {
      setLoading(true);
      setError('');

      // Verify token
      const resetRequests = JSON.parse(localStorage.getItem('passwordResets')) || [];
      const validRequest = resetRequests.find(
        r => r.email === emailForReset && r.token === values.token
      );

      if (!validRequest) {
        setError('Invalid or expired reset token.');
        setLoading(false);
        return;
      }

      if (new Date(validRequest.expiresAt) < new Date()) {
        setError('Reset token has expired. Please request a new one.');
        setLoading(false);
        return;
      }

      setCurrentStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (values) => {
    try {
      setLoading(true);
      setError('');

      if (values.newPassword !== values.confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }

      if (values.newPassword.length < 8) {
        setError('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }

      // Update employer password
      const employers = JSON.parse(localStorage.getItem('employers')) || [];
      const employer = employers.find(e => e.email === emailForReset);

      if (employer) {
        employer.password = values.newPassword;
        employer.passwordReset = true;
        employer.lastPasswordChangeAt = new Date().toISOString();
        localStorage.setItem('employers', JSON.stringify(employers));

        // Clear reset token
        const resetRequests = JSON.parse(localStorage.getItem('passwordResets')) || [];
        const filtered = resetRequests.filter(r => r.email !== emailForReset);
        localStorage.setItem('passwordResets', JSON.stringify(filtered));

        NotificationService.success(
          'Password Reset Successfully',
          'Your password has been reset. You can now login with your new password.'
        );

        setTimeout(() => {
          onResetSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Enter Email', description: 'Verify your email' },
    { title: 'Verify Token', description: 'Enter reset code' },
    { title: 'New Password', description: 'Set new password' },
    { title: 'Complete', description: 'Done' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <LockOutlined className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Reset Your Password</h1>
          <p className="text-gray-600 mt-2">Securely reset your employer account password</p>
        </div>

        <Steps current={currentStep} items={steps} className="mb-8" />

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        <Spin spinning={loading}>
          {currentStep === 0 && (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleEmailSubmit}
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
                  placeholder="hr@yourcompany.com"
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
                  className="bg-gradient-to-r from-red-600 to-orange-600 h-12 text-lg font-semibold"
                  icon={<ArrowRightOutlined />}
                >
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <Form
              layout="vertical"
              onFinish={handleTokenVerification}
              autoComplete="off"
              size="large"
            >
              <Alert
                message="Check Your Email"
                description={`A reset code has been sent to ${emailForReset}`}
                type="success"
                showIcon
                className="mb-6"
              />

              <Form.Item
                label="Reset Token"
                name="token"
                rules={[{ required: true, message: 'Please enter the reset token from your email' }]}
              >
                <Input
                  placeholder="Paste the token from your email"
                  disabled={loading}
                />
              </Form.Item>

              <div className="flex gap-4">
                <Button
                  block
                  size="large"
                  onClick={() => setCurrentStep(0)}
                  disabled={loading}
                  className="h-12 text-lg"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  className="bg-gradient-to-r from-red-600 to-orange-600 h-12 text-lg font-semibold"
                  icon={<ArrowRightOutlined />}
                >
                  Verify Token
                </Button>
              </div>
            </Form>
          )}

          {currentStep === 2 && (
            <Form
              layout="vertical"
              onFinish={handlePasswordReset}
              autoComplete="off"
              size="large"
            >
              <Alert
                message="Create New Password"
                description="Password must be at least 8 characters long and include a mix of characters."
                type="info"
                showIcon
                className="mb-6"
              />

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Enter your new password"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[{ required: true, message: 'Please confirm your password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Re-enter your password"
                  disabled={loading}
                />
              </Form.Item>

              <div className="flex gap-4">
                <Button
                  block
                  size="large"
                  onClick={() => setCurrentStep(1)}
                  disabled={loading}
                  className="h-12 text-lg"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  className="bg-gradient-to-r from-red-600 to-orange-600 h-12 text-lg font-semibold"
                >
                  Reset Password
                </Button>
              </div>
            </Form>
          )}
        </Spin>

        <div className="mt-6 text-center border-t pt-6">
          <Button type="link" onClick={onBackToLogin} className="text-blue-600 font-semibold">
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PasswordReset;
