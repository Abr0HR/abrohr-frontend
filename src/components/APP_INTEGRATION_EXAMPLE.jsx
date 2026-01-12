/**
 * APP_INTEGRATION_EXAMPLE.jsx
 * 
 * This file shows how to integrate all the new Employer Portal components
 * with the existing Employee Portal components in your main App.jsx
 * 
 * Key Components:
 * - EmployerLogin: Employer authentication page
 * - EmployerDashboard: Employer workforce management dashboard
 * - EmployeePortal: Existing employee portal (unchanged)
 * - SyncContext: Real-time data synchronization provider
 */

import React, { useState, useEffect } from 'react';
import { Layout, Button, Space, Result } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// Import components
import { DataSyncProvider } from './SyncContext';
import EmployerLogin from './EmployerLogin';
import EmployerDashboard from './EmployerDashboard';
import EmployeePortal from './EmployeePortal';

// Import other existing components as needed
// import EnhancedDashboard from './EnhancedDashboard';
// import LeaveManagement from './LeaveManagement';

const { Header, Content, Footer } = Layout;

/**
 * Main App Component
 * Handles routing between employer and employee portals
 */
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'employer' or 'employee' or null

  // Check for existing sessions on component mount
  useEffect(() => {
    const employer = localStorage.getItem('loggedInEmployer');
    const employee = localStorage.getItem('loggedInEmployee');

    if (employer) {
      setCurrentUser(JSON.parse(employer));
      setUserType('employer');
    } else if (employee) {
      setCurrentUser(JSON.parse(employee));
      setUserType('employee');
    }
  }, []);

  // Handle employer login
  const handleEmployerLoginSuccess = (employer) => {
    setCurrentUser(employer);
    setUserType('employer');
  };

  // Handle employer logout
  const handleEmployerLogout = () => {
    localStorage.removeItem('loggedInEmployer');
    setCurrentUser(null);
    setUserType(null);
  };

  // Handle employee login (example)
  const handleEmployeeLoginSuccess = (employee) => {
    setCurrentUser(employee);
    setUserType('employee');
  };

  // Handle employee logout
  const handleEmployeeLogout = () => {
    localStorage.removeItem('loggedInEmployee');
    setCurrentUser(null);
    setUserType(null);
  };

  // Switch between employer and employee (for testing/development)
  const handleSwitchUserType = () => {
    if (userType === 'employer') {
      // Log out and show login screen
      localStorage.removeItem('loggedInEmployer');
      setCurrentUser(null);
      setUserType(null);
    } else {
      localStorage.removeItem('loggedInEmployee');
      setCurrentUser(null);
      setUserType(null);
    }
  };

  return (
    <DataSyncProvider>
      <Layout style={{ minHeight: '100vh' }}>
        {/* Show header only when user is logged in */}
        {currentUser && (
          <Header
            style={{
              background: '#001529',
              padding: '0 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
              AbrO HR System - {userType === 'employer' ? 'Employer' : 'Employee'} Portal
            </div>
            <Space>
              <span style={{ color: 'white' }}>
                <UserOutlined /> {currentUser?.company || currentUser?.name || currentUser?.email}
              </span>
              <Button
                type="primary"
                onClick={handleEmployerLogout || handleEmployeeLogout}
              >
                Logout
              </Button>
            </Space>
          </Header>
        )}

        <Content style={{ padding: '0', minHeight: 'calc(100vh - 64px)' }}>
          {/* No User Logged In - Show Selection Screen */}
          {!userType && (
            <Result
              status="info"
              title="Welcome to AbrO HR System"
              subTitle="Choose your login option below"
              extra={[
                <Space key="buttons" size="large">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setUserType('employer-login')}
                  >
                    Login as Employer
                  </Button>
                  <Button
                    size="large"
                    onClick={() => setUserType('employee-login')}
                  >
                    Login as Employee
                  </Button>
                </Space>,
              ]}
            />
          )}

          {/* Employer Login Screen */}
          {userType === 'employer-login' && (
            <EmployerLogin onLoginSuccess={handleEmployerLoginSuccess} />
          )}

          {/* Employer Dashboard */}
          {userType === 'employer' && currentUser && (
            <EmployerDashboard
              currentEmployer={currentUser}
              onLogout={handleEmployerLogout}
            />
          )}

          {/* Employee Login Screen (Example) */}
          {userType === 'employee-login' && (
            <div style={{ padding: '50px', textAlign: 'center' }}>
              <h2>Employee Login</h2>
              {/* You can use your existing employee login component here */}
              <p>Your existing employee login component would go here</p>
              <Button onClick={() => setUserType(null)}>Back</Button>
            </div>
          )}

          {/* Employee Portal */}
          {userType === 'employee' && currentUser && (
            <EmployeePortal currentUser={currentUser} />
          )}
        </Content>

        {/* Footer */}
        <Footer style={{ textAlign: 'center', background: '#f5f5f5' }}>
          <p>&copy; 2025 AbrO HR System. All rights reserved.</p>
          <p>
            {currentUser && (
              <Button
                type="link"
                size="small"
                onClick={handleSwitchUserType}
              >
                {userType === 'employer' ? 'Switch to Employee' : 'Switch to Employer'}
              </Button>
            )}
          </p>
        </Footer>
      </Layout>
    </DataSyncProvider>
  );
}

export default App;

/**
 * IMPLEMENTATION CHECKLIST:
 * 
 * 1. Replace your current App.jsx with this structure
 * 2. Update imports based on your actual component locations
 * 3. Ensure SyncContext wraps all components
 * 4. Add your existing employee login component
 * 5. Test both employer and employee logins
 * 6. Verify data synchronization works across portals
 * 7. Test localStorage persistence
 * 
 * DEMO CREDENTIALS:
 * Employer:
 *   Email: hr@company1.com
 *   Password: password123
 * 
 * NOTES:
 * - This is a basic example. Customize as needed
 * - Add your own styling and theme
 * - Implement proper error handling
 * - Add form validation
 * - Integrate with your backend API
 */
