// Advanced Role-Based Access Control (RBAC) System
// Supports role hierarchies, permissions, and resource-level access control

class AccessControlAdvanced {
  constructor() {
    this.roles = this.initializeRoles();
    this.permissions = this.initializePermissions();
    this.userRoles = {};
    this.userPermissions = {};
  }

  // Initialize system roles with hierarchies
  initializeRoles() {
    return {
      SUPER_ADMIN: { level: 5, name: 'Super Admin', parent: null },
      ADMIN: { level: 4, name: 'Administrator', parent: 'SUPER_ADMIN' },
      HR_MANAGER: { level: 3, name: 'HR Manager', parent: 'ADMIN' },
      EMPLOYEE: { level: 1, name: 'Employee', parent: null },
      CONTRACTOR: { level: 0, name: 'Contractor', parent: null },
    };
  }

  // Initialize system permissions
  initializePermissions() {
    return {
      // Employee permissions
      'employee.view_profile': ['EMPLOYEE', 'HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'employee.edit_profile': ['EMPLOYEE', 'HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'employee.view_payroll': ['EMPLOYEE', 'HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'employee.request_leave': ['EMPLOYEE', 'HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'employee.view_documents': ['EMPLOYEE', 'HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],

      // HR Manager permissions
      'hr.approve_leave': ['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'hr.reject_leave': ['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'hr.view_all_attendance': ['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'hr.view_all_payroll': ['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],
      'hr.manage_leave_types': ['HR_MANAGER', 'ADMIN', 'SUPER_ADMIN'],

      // Admin permissions
      'admin.create_employee': ['ADMIN', 'SUPER_ADMIN'],
      'admin.edit_employee': ['ADMIN', 'SUPER_ADMIN'],
      'admin.delete_employee': ['SUPER_ADMIN'],
      'admin.manage_departments': ['ADMIN', 'SUPER_ADMIN'],
      'admin.manage_roles': ['ADMIN', 'SUPER_ADMIN'],
      'admin.view_analytics': ['ADMIN', 'SUPER_ADMIN'],
      'admin.export_data': ['ADMIN', 'SUPER_ADMIN'],

      // Super Admin permissions (all)
      'system.manage_users': ['SUPER_ADMIN'],
      'system.manage_settings': ['SUPER_ADMIN'],
      'system.view_logs': ['SUPER_ADMIN'],
      'system.configure_auth': ['SUPER_ADMIN'],
    };
  }

  // Assign role to user
  assignRole(userId, role) {
    if (!this.roles[role]) {
      throw new Error(`Invalid role: ${role}`);
    }
    this.userRoles[userId] = role;
    this.updateUserPermissions(userId);
    return true;
  }

  // Get user role
  getUserRole(userId) {
    return this.userRoles[userId] || null;
  }

  // Update permissions based on user role
  updateUserPermissions(userId) {
    const userRole = this.userRoles[userId];
    if (!userRole) return;

    const permissions = {};
    Object.entries(this.permissions).forEach(([permission, allowedRoles]) => {
      if (allowedRoles.includes(userRole)) {
        permissions[permission] = true;
      }
    });
    this.userPermissions[userId] = permissions;
  }

  // Check if user has permission
  hasPermission(userId, permission) {
    if (!this.userPermissions[userId]) {
      this.updateUserPermissions(userId);
    }
    return this.userPermissions[userId]?.[permission] || false;
  }

  // Check if user has any of the permissions
  hasAnyPermission(userId, permissions) {
    return permissions.some(permission => this.hasPermission(userId, permission));
  }

  // Check if user has all permissions
  hasAllPermissions(userId, permissions) {
    return permissions.every(permission => this.hasPermission(userId, permission));
  }

  // Get all permissions for user
  getUserPermissions(userId) {
    return { ...this.userPermissions[userId] || {} };
  }

  // Resource-level access control
  canAccessResource(userId, resourceType, resourceId, action) {
    const permission = `${resourceType}.${action}`;
    if (!this.hasPermission(userId, permission)) {
      return false;
    }
    
    // Additional resource-level checks
    const userRole = this.getUserRole(userId);
    const roleLevel = this.roles[userRole]?.level || 0;
    
    // Employees can only access their own resources
    if (userRole === 'EMPLOYEE' && resourceType === 'employee.profile') {
      return resourceId === userId;
    }
    
    return true;
  }

  // Check if user can edit employee
  canEditEmployee(userId, targetEmployeeId) {
    const userRole = this.getUserRole(userId);
    if (!this.hasPermission(userId, 'admin.edit_employee')) {
      return false;
    }
    return this.canAccessResource(userId, 'employee', targetEmployeeId, 'edit');
  }

  // Check if user can manage payroll
  canManagePayroll(userId) {
    return this.hasPermission(userId, 'hr.view_all_payroll');
  }

  // Check if user can approve leaves
  canApproveLeavals(userId) {
    return this.hasPermission(userId, 'hr.approve_leave');
  }

  // Get role hierarchy
  getRoleHierarchy(role) {
    const hierarchy = [role];
    let current = this.roles[role];
    while (current?.parent) {
      hierarchy.push(current.parent);
      current = this.roles[current.parent];
    }
    return hierarchy;
  }

  // Get role level
  getRoleLevel(role) {
    return this.roles[role]?.level || -1;
  }

  // Check if one role is senior to another
  isRoleSenior(role1, role2) {
    const level1 = this.getRoleLevel(role1);
    const level2 = this.getRoleLevel(role2);
    return level1 > level2;
  }

  // Create custom permission
  addCustomPermission(permissionName, allowedRoles) {
    this.permissions[permissionName] = allowedRoles;
  }

  // Remove permission
  removePermission(permissionName) {
    delete this.permissions[permissionName];
  }

  // Export permissions for UI rendering
  getPermissionsByModule() {
    const modules = {};
    Object.keys(this.permissions).forEach(permission => {
      const [module, action] = permission.split('.');
      if (!modules[module]) modules[module] = [];
      modules[module].push(action);
    });
    return modules;
  }
}

// Create singleton instance
const accessControl = new AccessControlAdvanced();

export default accessControl;
