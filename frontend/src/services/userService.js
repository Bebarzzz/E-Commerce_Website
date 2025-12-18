import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * User Service - Handles all user authentication and profile API calls
 */

/**
 * Login user
 * @param {Object} credentials - User credentials
 * @param {string} credentials.email - User email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} Response containing token and user data
 */
export const loginUser = async (credentials) => {
  try {
    const data = await apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Store auth token
    if (data.token) {
      localStorage.setItem('auth-token', data.token);
      if (credentials.email) {
        localStorage.setItem('user-email', credentials.email);
      }
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Signup new user
 * @param {Object} userData - New user data
 * @param {string} userData.username - Username
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Response containing token and user data
 */
export const signupUser = async (userData) => {
  try {
    const data = await apiRequest(API_ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Store auth token
    if (data.token) {
      localStorage.setItem('auth-token', data.token);
      if (userData.email) {
        localStorage.setItem('user-email', userData.email);
      }
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = () => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('user-email');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth-token');
  return !!token;
};

/**
 * Get current user email from storage
 * @returns {string|null} User email or null
 */
export const getCurrentUserEmail = () => {
  return localStorage.getItem('user-email');
};

/**
 * Get auth token
 * @returns {string|null} Auth token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem('auth-token');
};
