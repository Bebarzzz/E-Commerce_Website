import { API_ENDPOINTS, apiRequest } from '../config/api';

/**
 * Order Service - Handles all order-related API calls
 */

/**
 * Get all orders for the current user
 * @returns {Promise<Array>} Array of order objects
 */
export const getAllOrders = async () => {
  try {
    const response = await apiRequest(API_ENDPOINTS.GET_ORDERS, {
      method: 'GET',
    });
    // Backend returns { success: true, orders: [...] }
    return response.orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

/**
 * Create a new order
 * @param {Object} orderData - Order details
 * @param {Array} orderData.items - Array of cart items
 * @param {number} orderData.totalAmount - Total order amount
 * @param {Object} orderData.shippingAddress - Shipping address details
 * @returns {Promise<Object>} Created order object
 */
export const createOrder = async (orderData) => {
  try {
    const data = await apiRequest(API_ENDPOINTS.CREATE_ORDER, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Format cart items for order submission
 * @param {Object} cartItems - Cart items object
 * @param {Array} products - All products array
 * @returns {Array} Formatted order items
 */
export const formatCartForOrder = (cartItems, products) => {
  const items = [];
  
  for (const itemId in cartItems) {
    if (cartItems[itemId] > 0) {
      const product = products.find(p => p._id === itemId || p.id === Number(itemId));
      if (product) {
        items.push({
          carId: product._id || product.id,
          name: product.name || `${product.brand} ${product.model}`,
          price: product.price || product.new_price,
          quantity: cartItems[itemId],
          image: product.image || (product.images && product.images[0]) || ''
        });
      }
    }
  }
  
  return items;
};

/**
 * Calculate total order amount
 * @param {Object} cartItems - Cart items object
 * @param {Array} products - All products array
 * @returns {number} Total amount
 */
export const calculateOrderTotal = (cartItems, products) => {
  let total = 0;
  
  for (const itemId in cartItems) {
    if (cartItems[itemId] > 0) {
      const product = products.find(p => p._id === itemId || p.id === Number(itemId));
      if (product) {
        const price = product.price || product.new_price || 0;
        total += price * cartItems[itemId];
      }
    }
  }
  
  return total;
};
