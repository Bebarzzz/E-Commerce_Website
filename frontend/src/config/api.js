// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const API_ENDPOINTS = {
  // User endpoints
  LOGIN: `${API_BASE_URL}/api/user/login`,
  SIGNUP: `${API_BASE_URL}/api/user/signup`,
  
  // Car endpoints
  ADD_CAR: `${API_BASE_URL}/api/car/add`,
  REMOVE_CAR: `${API_BASE_URL}/api/car/remove`,
  GET_CARS: `${API_BASE_URL}/api/car/all`,
  
  // Order endpoints
  GET_ORDERS: `${API_BASE_URL}/api/order/showallorders`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/api/health`,
};

// Helper function for API calls
export const apiRequest = async (url, options = {}) => {
  try {
    const token = localStorage.getItem('authToken');
    
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
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_BASE_URL;
