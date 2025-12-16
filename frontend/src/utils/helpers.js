/**
 * Utility Functions for Frontend
 * Common helper functions used across the application
 */

/**
 * Format currency with $ symbol
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '$0.00';
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text with ellipsis
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get image URL or fallback placeholder
 * @param {string|Array} images - Image URL or array of URLs
 * @returns {string} Image URL or placeholder
 */
export const getImageUrl = (images) => {
  if (!images) return '/placeholder-car.png';
  if (Array.isArray(images)) {
    return images.length > 0 ? images[0] : '/placeholder-car.png';
  }
  return images;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters long'
    };
  }
  return {
    isValid: true,
    message: 'Password is valid'
  };
};

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean} True if empty
 */
export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Generate unique ID
 * @returns {string} Unique ID string
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Calculate discount percentage
 * @param {number} oldPrice - Original price
 * @param {number} newPrice - Sale price
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
};

/**
 * Build car display name from parts
 * @param {Object} car - Car object
 * @returns {string} Formatted car name
 */
export const buildCarName = (car) => {
  if (!car) return 'Unknown Car';
  const { manufactureYear, brand, model } = car;
  return `${manufactureYear || ''} ${brand || ''} ${model || ''}`.trim();
};

/**
 * Get condition badge color
 * @param {string} condition - Car condition (new/used)
 * @returns {string} CSS color class
 */
export const getConditionColor = (condition) => {
  const colors = {
    new: 'green',
    used: 'blue',
  };
  return colors[condition?.toLowerCase()] || 'gray';
};

/**
 * Handle API error and return user-friendly message
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleApiError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // Network errors
  if (error.message === 'Failed to fetch' || error.message.includes('Network')) {
    return 'Unable to connect to server. Please check your internet connection.';
  }
  
  // Custom error messages from backend
  if (error.message) {
    return error.message;
  }
  
  return 'Something went wrong. Please try again.';
};

/**
 * Store data in localStorage with error handling
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 */
export const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
  }
};

/**
 * Get data from localStorage with error handling
 * @param {string} key - Storage key
 * @returns {any} Stored value or null
 */
export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading data from localStorage:', error);
    return null;
  }
};

/**
 * Remove data from localStorage
 * @param {string} key - Storage key
 */
export const removeLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data from localStorage:', error);
  }
};
