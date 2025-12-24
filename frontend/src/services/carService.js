import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Car Service - Handles all car-related API calls
 */

/**
 * Fetch all cars from the backend
 * @returns {Promise<Array>} Array of car objects
 */
export const getAllCars = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.GET_CARS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cars = await response.json();
    return cars;
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
};

/**
 * Add a new car (Admin only)
 * @param {FormData} carData - Form data containing car details and images
 * @returns {Promise<Object>} Created car object
 */
export const addCar = async (carData) => {
  try {
    const token = localStorage.getItem('auth-token');

    const response = await fetch(API_ENDPOINTS.ADD_CAR, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: carData, // FormData for multipart/form-data
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-role');
      }
      throw new Error(data.error || 'Failed to add car');
    }

    return data;
  } catch (error) {
    console.error('Error adding car:', error);
    throw error;
  }
};

/**
 * Remove a car (Admin only)
 * @param {string} carId - ID of the car to remove
 * @returns {Promise<Object>} Deletion result
 */
export const removeCar = async (carId) => {
  try {
    const data = await apiRequest(`${API_ENDPOINTS.REMOVE_CAR}/${carId}`, {
      method: 'DELETE',
    });
    return data;
  } catch (error) {
    console.error('Error removing car:', error);
    throw error;
  }
};

/**
 * Filter cars by category
 * @param {Array} cars - Array of all cars
 * @param {string} category - Category to filter by ('new', 'used')
 * @returns {Array} Filtered cars
 */
export const filterCarsByCategory = (cars, category) => {
  if (!category) return cars;
  return cars.filter(car => car.condition === category);
};

/**
 * Get a single car by ID
 * @param {string} carId - ID of the car to fetch
 * @returns {Promise<Object>} Car object
 */
export const getCarById = async (carId) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.GET_CARS}/${carId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const car = await response.json();
    return car;
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
};

/**
 * Edit a car (Admin only)
 * @param {string} carId - ID of the car to edit
 * @param {FormData} carData - Form data containing updated car details and images
 * @returns {Promise<Object>} Updated car object
 */
export const editCar = async (carId, carData) => {
  try {
    const token = localStorage.getItem('auth-token');

    const response = await fetch(`${API_ENDPOINTS.EDIT_CAR}/${carId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: carData, // FormData for multipart/form-data
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-email');
        localStorage.removeItem('user-role');
      }
      throw new Error(data.error || 'Failed to edit car');
    }

    return data;
  } catch (error) {
    console.error('Error editing car:', error);
    throw error;
  }
};

/**
 * Search cars using backend API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching cars
 */
export const searchCarsAPI = async (query) => {
  try {
    const response = await fetch(`${API_ENDPOINTS.GET_CARS}/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cars = await response.json();
    return cars;
  } catch (error) {
    console.error('Error searching cars:', error);
    throw error;
  }
};

/**
 * Search cars by keyword (client-side filtering)
 * @param {Array} cars - Array of all cars
 * @param {string} query - Search query
 * @returns {Array} Filtered cars
 */
export const searchCars = (cars, query) => {
  if (!query) return cars;
  const lowerQuery = query.toLowerCase();
  return cars.filter(car =>
    car.model?.toLowerCase().includes(lowerQuery) ||
    car.brand?.toLowerCase().includes(lowerQuery) ||
    car.type?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Sort cars by price
 * @param {Array} cars - Array of cars to sort
 * @param {string} sortType - 'price-low' or 'price-high'
 * @returns {Array} Sorted cars
 */
export const sortCars = (cars, sortType) => {
  const sorted = [...cars];

  switch (sortType) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    default:
      return sorted;
  }
};
