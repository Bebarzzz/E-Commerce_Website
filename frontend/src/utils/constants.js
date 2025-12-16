/**
 * Application Constants
 * Centralized constants used throughout the application
 */

// Car Categories/Conditions
export const CAR_CONDITIONS = {
  NEW: 'new',
  USED: 'used',
};

// Sort Types
export const SORT_TYPES = {
  DEFAULT: 'default',
  PRICE_LOW: 'price-low',
  PRICE_HIGH: 'price-high',
  YEAR_NEW: 'year-new',
  YEAR_OLD: 'year-old',
};

// Authentication States
export const AUTH_STATES = {
  LOGGED_IN: 'logged_in',
  LOGGED_OUT: 'logged_out',
  LOADING: 'loading',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  USER_EMAIL: 'user-email',
  CART: 'cart-items',
};

// Route Paths
export const ROUTES = {
  HOME: '/',
  NEW_CARS: '/new-cars',
  USED_CARS: '/used-cars',
  OFFERS: '/offers',
  PRODUCT: '/product',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  CONTACT: '/contact',
};

// API Response States
export const API_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Car Types
export const CAR_TYPES = {
  SEDAN: 'Sedan',
  SUV: 'SUV',
  TRUCK: 'Truck',
  COUPE: 'Coupe',
  CONVERTIBLE: 'Convertible',
  HATCHBACK: 'Hatchback',
  VAN: 'Van',
  WAGON: 'Wagon',
};

// Transmission Types
export const TRANSMISSION_TYPES = {
  AUTOMATIC: 'Automatic',
  MANUAL: 'Manual',
  CVT: 'CVT',
  SEMI_AUTOMATIC: 'Semi-Automatic',
};

// Engine Types
export const ENGINE_TYPES = {
  GASOLINE: 'Gasoline',
  DIESEL: 'Diesel',
  ELECTRIC: 'Electric',
  HYBRID: 'Hybrid',
  PLUG_IN_HYBRID: 'Plug-in Hybrid',
};

// Drive Types
export const DRIVE_TYPES = {
  FWD: 'Front-Wheel Drive',
  RWD: 'Rear-Wheel Drive',
  AWD: 'All-Wheel Drive',
  FOUR_WD: '4-Wheel Drive',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to server. Please check your internet connection.',
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  SIGNUP_FAILED: 'Signup failed. Please try again.',
  FETCH_FAILED: 'Failed to load data. Please try again.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PASSWORD: 'Password must be at least 6 characters long.',
  REQUIRED_FIELD: 'This field is required.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  ORDER_SUCCESS: 'Order placed successfully!',
  CART_ADDED: 'Item added to cart!',
  CART_REMOVED: 'Item removed from cart!',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 36, 48],
};

// Price Ranges (for filters)
export const PRICE_RANGES = [
  { label: 'Under $20,000', min: 0, max: 20000 },
  { label: '$20,000 - $30,000', min: 20000, max: 30000 },
  { label: '$30,000 - $40,000', min: 30000, max: 40000 },
  { label: '$40,000 - $50,000', min: 40000, max: 50000 },
  { label: 'Over $50,000', min: 50000, max: Infinity },
];

// Year Ranges (for filters)
export const YEAR_RANGES = [
  { label: '2024', min: 2024, max: 2024 },
  { label: '2023', min: 2023, max: 2023 },
  { label: '2022', min: 2022, max: 2022 },
  { label: '2021 and older', min: 0, max: 2021 },
];

// Form Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  PASSWORD: {
    minLength: 6,
    message: 'Password must be at least 6 characters long',
  },
  USERNAME: {
    minLength: 3,
    maxLength: 50,
    message: 'Username must be between 3 and 50 characters',
  },
};

// Debounce Delays (in milliseconds)
export const DEBOUNCE_DELAYS = {
  SEARCH: 300,
  AUTOCOMPLETE: 500,
  RESIZE: 250,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Image Placeholders
export const PLACEHOLDER_IMAGES = {
  CAR: '/images/placeholder-car.png',
  USER: '/images/placeholder-user.png',
  BANNER: '/images/placeholder-banner.png',
};

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
};

// Breakpoints (for responsive design)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 768,
  DESKTOP: 1024,
  LARGE_DESKTOP: 1440,
};

export default {
  CAR_CONDITIONS,
  SORT_TYPES,
  AUTH_STATES,
  STORAGE_KEYS,
  ROUTES,
  API_STATES,
  CAR_TYPES,
  TRANSMISSION_TYPES,
  ENGINE_TYPES,
  DRIVE_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  PRICE_RANGES,
  YEAR_RANGES,
  VALIDATION_RULES,
  DEBOUNCE_DELAYS,
  HTTP_STATUS,
  PLACEHOLDER_IMAGES,
  ANIMATION_DURATION,
  BREAKPOINTS,
};
