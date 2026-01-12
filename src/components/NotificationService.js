import { notification, message } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

/**
 * NotificationService
 * Centralized service for showing notifications, toasts, and alerts
 * Provides consistent UX across the application
 */

const NotificationService = {
  /**
   * Show success notification
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   * @param {number} duration - Duration in seconds (default: 4.5)
   */
  success: (title, msg = '', duration = 4.5) => {
    notification.success({
      message: title,
      description: msg,
      duration,
      placement: 'topRight',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    });
  },

  /**
   * Show error notification
   * @param {string} title - Notification title
   * @param {string} message - Error message
   * @param {number} duration - Duration in seconds
   */
  error: (title, msg = '', duration = 0) => {
    notification.error({
      message: title,
      description: msg,
      duration,
      placement: 'topRight',
      icon: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
    });
  },

  /**
   * Show warning notification
   * @param {string} title - Notification title
   * @param {string} message - Warning message
   * @param {number} duration - Duration in seconds
   */
  warning: (title, msg = '', duration = 4.5) => {
    notification.warning({
      message: title,
      description: msg,
      duration,
      placement: 'topRight',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    });
  },

  /**
   * Show info notification
   * @param {string} title - Notification title
   * @param {string} message - Info message
   * @param {number} duration - Duration in seconds
   */
  info: (title, msg = '', duration = 4.5) => {
    notification.info({
      message: title,
      description: msg,
      duration,
      placement: 'topRight',
      icon: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    });
  },

  /**
   * Show quick success message (shorter duration)
   * @param {string} text - Message text
   */
  successMessage: (text) => {
    message.success({
      content: text,
      duration: 2,
    });
  },

  /**
   * Show quick error message
   * @param {string} text - Error text
   */
  errorMessage: (text) => {
    message.error({
      content: text,
      duration: 3,
    });
  },

  /**
   * Show loading message
   * @param {string} text - Loading text
   * @returns {function} Close function to dismiss the message
   */
  loading: (text) => {
    return message.loading({
      content: text,
      duration: 0,
    });
  },
};

export default NotificationService;
