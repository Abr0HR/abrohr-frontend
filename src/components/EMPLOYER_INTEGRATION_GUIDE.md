# Employer Portal - Integration Guide

## Overview
This guide explains how to integrate the new **EmployerLogin** and **EmployerDashboard** components with real-time data synchronization capabilities.

## New Components Added

### 1. **EmployerLogin.jsx**
- Professional login page for employers
- Form validation using Ant Design
- Mock authentication system (easily replaceable with real API)
- Demo credentials provided

**Features:**
- Email and password validation
- Loading states
- Error handling with user-friendly messages
- Stores employer data in localStorage

### 2. **EmployerDashboard.jsx**
- Comprehensive dashboard for workforce management
- Real-time synchronization with employee data
- Three main tabs:
  - **Dashboard**: Quick stats and analytics
  - **Employees**: Employee management (add, edit, delete)
  - **Attendance Records**: View all employee attendance data

**Features:**
- Dynamic employee management
- Real-time attendance tracking
- Search and filter capabilities
- Statistics and metrics
- Modal-based employee creation/editing

### 3. **SyncContext.jsx**
- React Context for global state management
- Real-time synchronization between portals
- Automatic data syncing every 1 second
- Storage event listening for multi-tab synchronization

**Features:**
- `useDataSync()` - Main hook for accessing sync data
- `useEmployees()` - Get all employees
- `useAttendanceRecords()` - Get all attendance records
- Methods: updateEmployee, addEmployee, deleteEmployee, updateAttendance

## Integration Steps

### Step 1: Wrap App with SyncContext
Update your `App.jsx`:

```jsx
import { DataSyncProvider } from './components/SyncContext';
import EmployerLogin from './components/EmployerLogin';
import EmployerDashboard from './components/EmployerDashboard';

function App() {
  return (
    <DataSyncProvider>
      {/* Your app content */}
    </DataSyncProvider>
  );
}
```

### Step 2: Add Routing Logic
Add conditional rendering based on user type:

```jsx
import { useState, useEffect } from 'react';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null); // 'employee' or 'employer'

  useEffect(() => {
    // Check localStorage for existing sessions
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

  const handleEmployerLogout = () => {
    localStorage.removeItem('loggedInEmployer');
    setCurrentUser(null);
    setUserType(null);
  };

  return (
    <DataSyncProvider>
      {!userType ? (
        <YourLoginPage />
      ) : userType === 'employer' ? (
        <EmployerDashboard 
          currentEmployer={currentUser} 
          onLogout={handleEmployerLogout}
        />
      ) : (
        <EmployeePortal currentUser={currentUser} />
      )}
    </DataSyncProvider>
  );
}
```

### Step 3: Update Authentication
Replace mock authentication with your API:

In `EmployerLogin.jsx`, replace the validation logic in `handleLogin`:

```jsx
const handleLogin = async (values) => {
  try {
    // Call your backend API
    const response = await fetch('/api/employer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    
    const employer = await response.json();
    if (employer.id) {
      localStorage.setItem('loggedInEmployer', JSON.stringify(employer));
      onLoginSuccess(employer);
    }
  } catch (error) {
    setError('Login failed');
  }
};
```

## Data Synchronization

### How it Works
1. **localStorage-based**: Data is stored in browser's localStorage
2. **Periodic sync**: Every 1 second, data is synced
3. **Event-based**: Storage changes in other tabs trigger updates
4. **Bidirectional**: Employee and employer changes sync automatically

### Using the Sync Context

```jsx
import { useDataSync, useEmployees, useAttendanceRecords } from './components/SyncContext';

function MyComponent() {
  const { syncData, updateEmployee, addEmployee } = useDataSync();
  const employees = useEmployees();
  const attendance = useAttendanceRecords();
  
  // Add new employee
  const handleAddEmployee = (emp) => {
    addEmployee(emp);
  };
  
  // Update employee
  const handleUpdateEmployee = (empId, updates) => {
    updateEmployee(empId, updates);
  };
  
  return (
    <div>
      <p>Total Employees: {employees.length}</p>
      <p>Total Records: {attendance.length}</p>
    </div>
  );
}
```

## Demo Credentials

```
Email: hr@company1.com
Password: password123

Email: admin@company2.com
Password: secure456

Email: recruiter@company3.com
Password: recruit789
```

## Data Structure

### Employee Object
```javascript
{
  id: 'emp_1234567890',
  name: 'John Doe',
  email: 'john@example.com',
  department: 'Engineering',
  position: 'Senior Developer',
  createdAt: '2025-01-12T17:00:00.000Z'
}
```

### Attendance Record
```javascript
{
  id: Math.random(),
  date: '2025-01-12T10:30:00.000Z',
  punchIn: '10:30:00 AM',
  punchOut: '6:30:00 PM',
  status: 'Present'
}
```

### Employer Object
```javascript
{
  id: 'emp001',
  email: 'hr@company.com',
  company: 'Tech Corp',
  phone: '+91-9876543210',
  loginTime: '2025-01-12T17:00:00.000Z'
}
```

## Features & Benefits

✅ **Real-time Synchronization**: Data updates instantly across portals
✅ **Multi-tab Support**: Changes sync across browser tabs
✅ **No API Required**: Works with localStorage (upgrade to backend easily)
✅ **Complete Employee Management**: Add, edit, delete employees
✅ **Attendance Tracking**: Track daily punch in/out times
✅ **Dashboard Analytics**: Quick statistics and metrics
✅ **Search & Filter**: Find employees and records quickly
✅ **Responsive Design**: Works on all devices

## Future Enhancements

- [ ] Backend API integration (Node.js/Express or similar)
- [ ] WebSocket for true real-time updates
- [ ] Export attendance to Excel/PDF
- [ ] Advanced analytics and reporting
- [ ] Employee performance tracking
- [ ] Payroll integration
- [ ] Leave management automation
- [ ] Department/team management

## Troubleshooting

### Data not syncing?
1. Check browser console for errors
2. Ensure localStorage is not disabled
3. Verify SyncContext provider wraps your app

### localStorage quota exceeded?
1. Clear old data: `localStorage.clear()`
2. Implement data archival strategy
3. Migrate to IndexedDB for more storage

## Support & Questions

For issues or questions, please refer to the component documentation or create an issue in the repository.
