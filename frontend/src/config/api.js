// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/api/user/login`,
  SIGNUP: `${API_BASE_URL}/api/user/signup`,
  VERIFY_TOKEN: `${API_BASE_URL}/api/user/verify`,

  // Car endpoints
  ADD_CAR: `${API_BASE_URL}/api/car`,
  REMOVE_CAR: `${API_BASE_URL}/api/car`,
  EDIT_CAR: `${API_BASE_URL}/api/car`,
  GET_CARS: `${API_BASE_URL}/api/car`,

  // Order endpoints
  GET_ORDERS: `${API_BASE_URL}/api/order/showallorders`,
  CREATE_ORDER: `${API_BASE_URL}/api/order`,
  GET_ORDER_BY_ID: `${API_BASE_URL}/api/order`,
  UPDATE_ORDER_STATUS: `${API_BASE_URL}/api/order`,

  // Contact endpoints
  CONTACT: `${API_BASE_URL}/api/contact`,

  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Helper function for API calls
export const apiRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('auth-token');

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle unauthorized access (401) by clearing calling logout
      if (response.status === 401) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-role');
        // Optional: Redirect to login or let the UI react to the missing token
        // window.location.href = '/login'; 
      }
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_BASE_URL;
