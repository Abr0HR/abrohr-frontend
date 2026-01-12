import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the sync context
const DataSyncContext = createContext();

/**
 * DataSyncProvider Component
 * Manages real-time synchronization between Employee Portal and Employer Dashboard
 * Uses localStorage as a shared data store with periodic sync intervals
 */
export const DataSyncProvider = ({ children }) => {
  const [syncData, setSyncData] = useState({
    employees: [],
    attendance: [],
    lastSyncTime: null,
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync all data from localStorage
  const syncAllData = useCallback(() => {
    setIsSyncing(true);
    try {
      const employees = JSON.parse(localStorage.getItem('allEmployees')) || [];
      const attendanceRecords = [];

      // Collect all attendance records
      employees.forEach((emp) => {
        const empAttendance = JSON.parse(localStorage.getItem(`attendance_${emp.id}`)) || [];
        attendanceRecords.push(...empAttendance.map((record) => ({
          ...record,
          employeeId: emp.id,
          employeeName: emp.name,
          email: emp.email,
        })));
      });

      setSyncData({
        employees,
        attendance: attendanceRecords,
        lastSyncTime: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Update employee data
  const updateEmployee = useCallback((employeeId, updates) => {
    const employees = JSON.parse(localStorage.getItem('allEmployees')) || [];
    const updated = employees.map((emp) =>
      emp.id === employeeId ? { ...emp, ...updates } : emp
    );
    localStorage.setItem('allEmployees', JSON.stringify(updated));
    syncAllData();
  }, [syncAllData]);

  // Add new employee
  const addEmployee = useCallback((employee) => {
    const employees = JSON.parse(localStorage.getItem('allEmployees')) || [];
    const newEmployee = {
      id: `emp_${Date.now()}`,
      ...employee,
      createdAt: new Date().toISOString(),
    };
    employees.push(newEmployee);
    localStorage.setItem('allEmployees', JSON.stringify(employees));
    syncAllData();
    return newEmployee;
  }, [syncAllData]);

  // Delete employee
  const deleteEmployee = useCallback((employeeId) => {
    const employees = JSON.parse(localStorage.getItem('allEmployees')) || [];
    const updated = employees.filter((emp) => emp.id !== employeeId);
    localStorage.setItem('allEmployees', JSON.stringify(updated));
    localStorage.removeItem(`attendance_${employeeId}`);
    syncAllData();
  }, [syncAllData]);

  // Update attendance record
  const updateAttendance = useCallback((employeeId, attendanceRecord) => {
    const records = JSON.parse(localStorage.getItem(`attendance_${employeeId}`)) || [];
    records.push(attendanceRecord);
    localStorage.setItem(`attendance_${employeeId}`, JSON.stringify(records));
    syncAllData();
  }, [syncAllData]);

  // Listen for storage changes (for real-time sync across tabs/windows)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'allEmployees' || event.key?.startsWith('attendance_')) {
        syncAllData();
      }
    };

    // Perform initial sync
    syncAllData();

    // Set up periodic sync (every 1 second for real-time feel)
    const syncInterval = setInterval(syncAllData, 1000);

    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [syncAllData]);

  const value = {
    syncData,
    isSyncing,
    syncAllData,
    updateEmployee,
    addEmployee,
    deleteEmployee,
    updateAttendance,
  };

  return (
    <DataSyncContext.Provider value={value}>
      {children}
    </DataSyncContext.Provider>
  );
};

/**
 * Custom hook to use the DataSync context
 * Usage: const { syncData, updateEmployee } = useDataSync();
 */
export const useDataSync = () => {
  const context = useContext(DataSyncContext);
  if (!context) {
    throw new Error('useDataSync must be used within DataSyncProvider');
  }
  return context;
};

// Helper hook for getting employees
export const useEmployees = () => {
  const { syncData } = useDataSync();
  return syncData.employees;
};

// Helper hook for getting attendance records
export const useAttendanceRecords = () => {
  const { syncData } = useDataSync();
  return syncData.attendance;
};

export default DataSyncContext;
