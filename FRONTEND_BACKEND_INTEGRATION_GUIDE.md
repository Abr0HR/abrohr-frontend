# AbrO HR - Frontend-Backend Integration Guide
**Date:** January 15, 2026
**Status:** Integration Ready ✅

## OVERVIEW

This guide explains how to connect the React frontend with the production backend API. All API calls have been implemented in `src/services/apiClient.js`.

## QUICK START

### 1. Import the API Client

```javascript
import apiClient from '@/services/apiClient';
```

### 2. Use in Components

```javascript
// Example: Marking attendance
const markAttendance = async () => {
  try {
    const result = await apiClient.markAttendance(employeeId, 'present', 'office', 'On time');
    console.log('Attendance marked:', result);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## API CLIENT METHODS

### Authentication

```javascript
// Login
const { user, token } = await apiClient.login(email, password);

// Register
const { user, token } = await apiClient.register(email, password, name, companyId);

// Logout
apiClient.logout();

// Check authentication
if (apiClient.isAuthenticated()) {
  console.log('User is logged in');
}
```

### Employees

```javascript
// Get all employees for a company
const employees = await apiClient.getEmployees(companyId);

// Get single employee
const employee = await apiClient.getEmployee(employeeId);

// Create employee
const newEmployee = await apiClient.createEmployee({
  name: 'John Doe',
  email: 'john@company.com',
  position: 'Developer',
  department: 'Engineering',
  company_id: companyId,
  phone: '9876543210'
});
```

### Attendance

```javascript
// Mark attendance
const attendance = await apiClient.markAttendance(
  employeeId,
  'present',      // status: 'present', 'absent', 'leave'
  'office',       // mode: 'office', 'wfh', 'on-duty'
  'On time'       // remarks (optional)
);

// Get attendance records for month/year
const records = await apiClient.getAttendance(employeeId, 1, 2026); // January 2026

// Get attendance summary
const summary = await apiClient.getAttendanceSummary(employeeId, 2026);
// Returns: { present_count, absent_count, leave_count, wfh_count }
```

### Leaves

```javascript
// Apply for leave
const leave = await apiClient.applyLeave(
  employeeId,
  'casual',                    // leave_type
  '2026-01-20',                // from_date
  '2026-01-22',                // to_date
  'Personal work'              // reason
);

// Get leave history
const leaves = await apiClient.getLeaves(employeeId);

// Approve leave (manager only)
const approved = await apiClient.approveLeave(leaveId, managerId);

// Reject leave (manager only)
const rejected = await apiClient.rejectLeave(
  leaveId,
  'Insufficient balance',      // rejection_reason
  managerId
);
```

### Regularizations

```javascript
// Apply for regularization
const regularization = await apiClient.applyRegularization(
  employeeId,
  attendanceId,           // attendance record to regularize
  'Forgot to mark attendance'  // reason
);

// Get pending regularizations (manager/admin only)
const pending = await apiClient.getRegularizations(companyId, 'pending');

// Approve regularization (manager/admin only)
const approved = await apiClient.approveRegularization(
  regularizationId,
  managerId
);
```

### Companies

```javascript
// Register company
const company = await apiClient.registerCompany(
  'Tech Corp',
  'admin@techcorp.com',
  '+91-9876543210',
  '123 Tech Street, Bangalore',
  'IT Services'
);

// Get company details
const company = await apiClient.getCompany(companyId);
```

### Health Checks

```javascript
// Check backend health
const isHealthy = await apiClient.checkHealth();
if (isHealthy) {
  console.log('Backend is running');
}
```

## COMPONENT INTEGRATION EXAMPLES

### Example 1: Employee Dashboard

```javascript
import apiClient from '@/services/apiClient';
import { useState, useEffect } from 'react';

function EmployeeDashboard() {
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = apiClient.getUser();
        const summary = await apiClient.getAttendanceSummary(user.id, 2026);
        setAttendanceSummary(summary);
      } catch (error) {
        console.error('Error fetching summary:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {attendanceSummary && (
        <div>
          <p>Present: {attendanceSummary.present_count}</p>
          <p>Absent: {attendanceSummary.absent_count}</p>
          <p>Leaves: {attendanceSummary.leave_count}</p>
          <p>WFH: {attendanceSummary.wfh_count}</p>
        </div>
      )}
    </div>
  );
}
```

### Example 2: Mark Attendance Button

```javascript
import apiClient from '@/services/apiClient';
import { useState } from 'react';

function MarkAttendanceButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleMarkAttendance = async () => {
    setLoading(true);
    try {
      const user = apiClient.getUser();
      await apiClient.markAttendance(user.id, 'present', 'office');
      setMessage('✅ Attendance marked successfully!');
    } catch (error) {
      setMessage('❌ Error marking attendance: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleMarkAttendance} disabled={loading}>
        {loading ? 'Marking...' : 'Mark Attendance'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}
```

### Example 3: Leave Application Form

```javascript
import apiClient from '@/services/apiClient';
import { useState } from 'react';

function LeaveApplicationForm() {
  const [formData, setFormData] = useState({
    leave_type: 'casual',
    from_date: '',
    to_date: '',
    reason: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = apiClient.getUser();
      await apiClient.applyLeave(
        user.id,
        formData.leave_type,
        formData.from_date,
        formData.to_date,
        formData.reason
      );
      setMessage('✅ Leave application submitted!');
      setFormData({ leave_type: 'casual', from_date: '', to_date: '', reason: '' });
    } catch (error) {
      setMessage('❌ Error: ' + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={formData.leave_type}
        onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
      >
        <option value="casual">Casual Leave</option>
        <option value="sick">Sick Leave</option>
        <option value="earned">Earned Leave</option>
      </select>
      <input
        type="date"
        value={formData.from_date}
        onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
        required
      />
      <input
        type="date"
        value={formData.to_date}
        onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
        required
      />
      <textarea
        value={formData.reason}
        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        placeholder="Reason for leave"
      />
      <button type="submit">Apply Leave</button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

## ENVIRONMENT VARIABLES

Add to `.env` file:

```env
VITE_API_BASE_URL=https://abrohr-backend.railway.app
```

Or for local development:

```env
VITE_API_BASE_URL=http://localhost:5000
```

## ERROR HANDLING

All API client methods throw errors that should be caught:

```javascript
try {
  const result = await apiClient.markAttendance(employeeId, 'present', 'office');
  console.log('Success:', result);
} catch (error) {
  // Handle error
  if (error.message.includes('401')) {
    // Unauthorized - redirect to login
    apiClient.logout();
    window.location.href = '/login';
  } else if (error.message.includes('500')) {
    // Server error
    console.error('Server error:', error);
  } else {
    // Other error
    console.error('Error:', error);
  }
}
```

## TESTING

Test the integration:

```bash
# 1. Open browser console
# 2. Run:

// Login
await window.apiClient.login('john@abrohr.com', 'john123');

// Check authenticated
console.log(window.apiClient.isAuthenticated());

// Get user
console.log(window.apiClient.getUser());

// Mark attendance
await window.apiClient.markAttendance(1, 'present', 'office');

// Get attendance
await window.apiClient.getAttendance(1, 1, 2026);
```

## NEXT STEPS

1. ✅ API client created (`src/services/apiClient.js`)
2. ⏳ Import API client in components
3. ⏳ Update login page to use `apiClient.login()`
4. ⏳ Update dashboard to fetch real data
5. ⏳ Update buttons to make API calls
6. ⏳ Deploy frontend changes
7. ⏳ Test with live backend
8. ⏳ Go live!

## SUPPORT

For issues:
1. Check browser console for errors
2. Verify backend is running: `https://abrohr-backend.railway.app/health`
3. Check API response in Network tab
4. Review error message from API
5. Check `PRODUCTION_IMPLEMENTATION_GUIDE.md` in backend repo

---

**Ready to integrate!** 🚀
