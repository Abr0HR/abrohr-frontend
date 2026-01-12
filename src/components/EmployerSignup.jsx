import React, { useState } from 'react';
import { Form, Input, Button, Card, Steps, Alert, Spin, Select } from 'antd';
import { UserOutlined, MailOutlined, BuildOutlined, PhoneOutlined, EnvironmentOutlined, ArrowRightOutlined } from '@ant-design/icons';
import NotificationService from './NotificationService';
import APIService from './APIService';

const EmployerSignup = ({ onSignupSuccess, onBackToLogin }) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  const handleCompanyDetailsSubmit = async (values) => {
    try {
      setLoading(true);
      setError('');
      
      // Check if company already exists
      const existingCompanies = JSON.parse(localStorage.getItem('employers')) || [];
      const companyExists = existingCompanies.some(e => e.email === values.email);
      
      if (companyExists) {
        setError('This email is already registered. Please login or use a different email.');
        setLoading(false);
        return;
      }

      setFormData(values);
      setCurrentStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Generate unique password
      const tempPassword = generateSecurePassword();

      // Create employer account
      const employer = {
        id: `emp_${Date.now()}`,
        ...formData,
        password: tempPassword,
        createdAt: new Date().toISOString(),
        verified: true,
        passwordReset: false,
      };

      // Save to localStorage (in real app, save to database)
      const employers = JSON.parse(localStorage.getItem('employers')) || [];
      employers.push(employer);
      localStorage.setItem('employers', JSON.stringify(employers));

      // Simulate sending email
      NotificationService.success(
        'Signup Successful!',
        `A password has been generated and sent to ${formData.email}. Please check your email.\n\nFor demo: Temporary Password = ${tempPassword}`
      );

      // Store temporary password locally for demo
      localStorage.setItem(`tempPassword_${formData.email}`, tempPassword);

      setTimeout(() => {
        onSignupSuccess(employer);
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSecurePassword = () => {
    const length = 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const steps = [
    { title: 'Company Details', description: 'Enter your company information' },
    { title: 'Verification', description: 'Confirm and receive password' },
    { title: 'Complete', description: 'Setup is complete' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4">
            <BuildOutlined className="text-3xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Register Your Company</h1>
          <p className="text-gray-600 mt-2">Setup your employer account for AbrO HR</p>
        </div>

        <Steps current={currentStep} items={steps} className="mb-8" />

        {error && (
          <Alert
            message="Registration Error"
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
              onFinish={handleCompanyDetailsSubmit}
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

              <Form.Item
                label="Company Name"
                name="company"
                rules={[{ required: true, message: 'Please enter your company name' }]}
              >
                <Input
                  prefix={<BuildOutlined className="text-gray-400" />}
                  placeholder="Your Company Ltd."
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Contact Person Name"
                name="contactName"
                rules={[{ required: true, message: 'Please enter contact person name' }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="John Doe"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { pattern: /^[0-9+\-\s()]+$/, message: 'Please enter a valid phone number' },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined className="text-gray-400" />}
                  placeholder="+91-9876543210"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Company Size"
                name="companySize"
                rules={[{ required: true, message: 'Please select company size' }]}
              >
                <Select placeholder="Select company size" disabled={loading}>
                  <Select.Option value="1-50">1-50 employees</Select.Option>
                  <Select.Option value="51-200">51-200 employees</Select.Option>
                  <Select.Option value="201-500">201-500 employees</Select.Option>
                  <Select.Option value="501-1000">501-1000 employees</Select.Option>
                  <Select.Option value="1000+">1000+ employees</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Industry"
                name="industry"
                rules={[{ required: true, message: 'Please select industry' }]}
              >
                <Select placeholder="Select your industry" disabled={loading}>
                  <Select.Option value="IT">IT & Technology</Select.Option>
                  <Select.Option value="Finance">Finance & Banking</Select.Option>
                  <Select.Option value="Healthcare">Healthcare</Select.Option>
                  <Select.Option value="Retail">Retail & E-commerce</Select.Option>
                  <Select.Option value="Manufacturing">Manufacturing</Select.Option>
                  <Select.Option value="Education">Education</Select.Option>
                  <Select.Option value="Other">Other</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-12 text-lg font-semibold"
                  icon={<ArrowRightOutlined />}
                >
                  Continue to Verification
                </Button>
              </Form.Item>
            </Form>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <Card className="bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold mb-4">Verify Company Details</h3>
                <div className="space-y-3">
                  <div><strong>Email:</strong> {formData.email}</div>
                  <div><strong>Company:</strong> {formData.company}</div>
                  <div><strong>Contact Person:</strong> {formData.contactName}</div>
                  <div><strong>Phone:</strong> {formData.phone}</div>
                  <div><strong>Company Size:</strong> {formData.companySize}</div>
                  <div><strong>Industry:</strong> {formData.industry}</div>
                </div>
              </Card>

              <Alert
                message="Password Generation"
                description="A secure password will be generated and sent to your email address. You can change it after login."
                type="info"
                showIcon
              />

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
                  block
                  size="large"
                  loading={loading}
                  onClick={handleVerificationSubmit}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 h-12 text-lg font-semibold"
                >
                  Complete Registration
                </Button>
              </div>
            </div>
          )}
        </Spin>

        <div className="mt-6 text-center border-t pt-6">
          <p className="text-gray-600">Already have an account?</p>
          <Button type="link" onClick={onBackToLogin} className="text-blue-600 font-semibold">
            Back to Login
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EmployerSignup;
