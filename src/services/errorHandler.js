/**
 * Error Handler Utility
 * Centralized error handling and user feedback
 */

// Error types
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  CONFLICT: 'CONFLICT',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Error messages mapping
const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK_ERROR]: 'Network error. Please check your internet connection.',
  [ERROR_TYPES.AUTHENTICATION_ERROR]: 'Invalid email or password. Please try again.',
  [ERROR_TYPES.VALIDATION_ERROR]: 'Please check the entered information and try again.',
  [ERROR_TYPES.SERVER_ERROR]: 'Server error. Please try again later.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_TYPES.UNAUTHORIZED]: 'You are not authorized to perform this action. Please login.',
  [ERROR_TYPES.FORBIDDEN]: 'Access denied. You do not have permission to perform this action.',
  [ERROR_TYPES.CONFLICT]: 'Conflict: The resource already exists or the operation conflicts with existing data.',
  [ERROR_TYPES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Parse error response and return structured error object
 */
export const parseError = (error) => {
  let errorType = ERROR_TYPES.UNKNOWN_ERROR;
  let errorMessage = ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR];
  let statusCode = null;
  let details = null;

  if (error instanceof TypeError) {
    // Network error
    errorType = ERROR_TYPES.NETWORK_ERROR;
    errorMessage = ERROR_MESSAGES[ERROR_TYPES.NETWORK_ERROR];
  } else if (error.response) {
    // Server responded with error status
    statusCode = error.response.status;
    const errorData = error.response.data;

    switch (statusCode) {
      case 400:
        errorType = ERROR_TYPES.VALIDATION_ERROR;
        errorMessage = errorData?.message || ERROR_MESSAGES[ERROR_TYPES.VALIDATION_ERROR];
        details = errorData?.errors || null;
        break;
      case 401:
        errorType = ERROR_TYPES.UNAUTHORIZED;
        errorMessage = ERROR_MESSAGES[ERROR_TYPES.UNAUTHORIZED];
        break;
      case 403:
        errorType = ERROR_TYPES.FORBIDDEN;
        errorMessage = ERROR_MESSAGES[ERROR_TYPES.FORBIDDEN];
        break;
      case 404:
        errorType = ERROR_TYPES.NOT_FOUND;
        errorMessage = ERROR_MESSAGES[ERROR_TYPES.NOT_FOUND];
        break;
      case 409:
        errorType = ERROR_TYPES.CONFLICT;
        errorMessage = errorData?.message || ERROR_MESSAGES[ERROR_TYPES.CONFLICT];
        break;
      case 500:
      case 502:
      case 503:
        errorType = ERROR_TYPES.SERVER_ERROR;
        errorMessage = ERROR_MESSAGES[ERROR_TYPES.SERVER_ERROR];
        break;
      default:
        errorMessage = errorData?.message || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN_ERROR];
    }
  } else if (error.message) {
    errorMessage = error.message;
  }

  return {
    type: errorType,
    message: errorMessage,
    statusCode,
    details,
    originalError: error,
  };
};

/**
 * Format validation errors for display
 */
export const formatValidationErrors = (errors) => {
  if (!errors) return {};
  
  const formattedErrors = {};
  
  if (Array.isArray(errors)) {
    errors.forEach((error) => {
      if (error.field) {
        formattedErrors[error.field] = error.message;
      }
    });
  } else if (typeof errors === 'object') {
    Object.keys(errors).forEach((key) => {
      formattedErrors[key] = errors[key];
    });
  }
  
  return formattedErrors;
};

/**
 * Show notification to user (can be integrated with toast library)
 */
export const showErrorNotification = (error) => {
  const parsedError = parseError(error);
  
  // Log error for debugging
  console.error('[Error Notification]', {
    type: parsedError.type,
    message: parsedError.message,
    statusCode: parsedError.statusCode,
    details: parsedError.details,
    originalError: parsedError.originalError,
  });

  // Show toast notification (implement with toast library like react-toastify)
  // toast.error(parsedError.message);
  
  return parsedError;
};

/**
 * Handle authentication errors
 */
export const handleAuthError = (error) => {
  const parsedError = parseError(error);
  
  if (parsedError.type === ERROR_TYPES.UNAUTHORIZED) {
    // Clear auth data and redirect to login
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  return parsedError;
};

/**
 * Retry logic for failed requests
 */
export const retryWithBackoff = async (
  fn,
  maxRetries = 3,
  delayMs = 1000
) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, delayMs * Math.pow(2, i))
      );
    }
  }
};

export default {
  ERROR_TYPES,
  parseError,
  formatValidationErrors,
  showErrorNotification,
  handleAuthError,
  retryWithBackoff,
};
