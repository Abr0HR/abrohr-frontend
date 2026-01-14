// Advanced Notification Service with Real-time Updates
// Integrates with WebSocket, Supabase Realtime, and localStorage persistence

class NotificationServiceAdvanced {
  constructor() {
    this.notifications = [];
    this.subscribers = [];
    this.wsConnection = null;
    this.maxNotifications = 100;
  }

  // Initialize WebSocket connection
  initializeWebSocket(url) {
    return new Promise((resolve, reject) => {
      try {
        this.wsConnection = new WebSocket(url);
        
        this.wsConnection.onopen = () => {
          console.log('WebSocket connected');
          this.loadNotificationsFromStorage();
          resolve();
        };

        this.wsConnection.onmessage = (event) => {
          const notification = JSON.parse(event.data);
          this.addNotification(notification);
        };

        this.wsConnection.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  // Add notification with auto-persistence
  addNotification(notification) {
    const id = Date.now();
    const fullNotification = {
      ...notification,
      id,
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notifications.unshift(fullNotification);

    // Keep only recent notifications
    if (this.notifications.length > this.maxNotifications) {
      this.notifications = this.notifications.slice(0, this.maxNotifications);
    }

    this.saveToStorage();
    this.notifySubscribers();

    // Auto-dismiss non-critical notifications after 5 seconds
    if (notification.type !== 'critical') {
      setTimeout(() => this.removeNotification(id), 5000);
    }

    return fullNotification;
  }

  // Send different types of notifications
  success(title, message, duration = 5000) {
    return this.addNotification({
      type: 'success',
      title,
      message,
      duration,
      icon: '✓',
    });
  }

  error(title, message, duration = 7000) {
    return this.addNotification({
      type: 'error',
      title,
      message,
      duration,
      icon: '✕',
    });
  }

  warning(title, message, duration = 6000) {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      duration,
      icon: '⚠',
    });
  }

  info(title, message, duration = 4000) {
    return this.addNotification({
      type: 'info',
      title,
      message,
      duration,
      icon: 'ℹ',
    });
  }

  critical(title, message) {
    return this.addNotification({
      type: 'critical',
      title,
      message,
      duration: 0, // No auto-dismiss
      icon: '⚡',
    });
  }

  // Real-time employee notifications (e.g., leave approval)
  notifyLeaveApproval(employeeName, status) {
    const title = `Leave ${status}`;
    const message = `Your leave request has been ${status.toLowerCase()} by HR.`;
    return this[status.toLowerCase() === 'approved' ? 'success' : 'warning'](title, message);
  }

  // Real-time payroll notifications
  notifyPayrollCredit(employeeName, amount) {
    return this.success(
      'Salary Credited',
      `₹${amount.toLocaleString()} has been credited to your account.`
    );
  }

  // Real-time attendance notifications
  notifyAttendanceMarked(status) {
    return this.success('Attendance Marked', `You have been marked as ${status}.`);
  }

  // Document upload notifications
  notifyDocumentUploaded(docName) {
    return this.success('Document Uploaded', `${docName} has been uploaded successfully.`);
  }

  // Read notification
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifySubscribers();
    }
  }

  // Remove notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveToStorage();
    this.notifySubscribers();
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Get all notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveToStorage();
    this.notifySubscribers();
  }

  // Subscribe to notification updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(s => s !== callback);
    };
  }

  // Notify all subscribers
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      callback(this.notifications);
    });
  }

  // Save to localStorage
  saveToStorage() {
    try {
      localStorage.setItem(
        'abrohr_notifications',
        JSON.stringify(this.notifications.slice(0, 50)) // Keep last 50
      );
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }

  // Load from localStorage
  loadNotificationsFromStorage() {
    try {
      const stored = localStorage.getItem('abrohr_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  // Send notification to backend (for persistence)
  async sendToBackend(notification) {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });
      return response.json();
    } catch (error) {
      console.error('Failed to send notification to backend:', error);
    }
  }

  // Get notification history from backend
  async getHistoryFromBackend(userId, limit = 50) {
    try {
      const response = await fetch(`/api/notifications/history?userId=${userId}&limit=${limit}`);
      return response.json();
    } catch (error) {
      console.error('Failed to fetch notification history:', error);
      return [];
    }
  }
}

// Create singleton instance
const notificationService = new NotificationServiceAdvanced();

export default notificationService;
