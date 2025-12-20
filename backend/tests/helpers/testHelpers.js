// Test helper functions
const jwt = require('jsonwebtoken');
const User = require('../../Models/userModel');

/**
 * Create a test user
 */
const createTestUser = async (userData = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'customer'
  };

  const user = await User.signup(
    userData.username || defaultUser.username,
    userData.email || defaultUser.email,
    userData.password || defaultUser.password,
    userData.role || defaultUser.role
  );

  return user;
};

/**
 * Create an admin user
 */
const createTestAdmin = async () => {
  return createTestUser({
    username: 'adminuser',
    email: 'admin@example.com',
    password: 'AdminPass123!',
    role: 'admin'
  });
};

/**
 * Generate JWT token for a user
 */
const generateToken = (userId) => {
  return jwt.sign({ _id: userId }, process.env.JWT_SECRET, { expiresIn: '3d' });
};

/**
 * Create a test car
 */
const createTestCar = async (carData = {}) => {
  const Car = require('../../Models/carModel');
  
  const defaultCar = {
    model: 'Test Model',
    manufactureYear: 2023,
    brand: 'Test Brand',
    type: 'Sedan',
    price: 25000,
    engineCapacity: 2.0,
    wheelDriveType: 'FWD',
    engineType: 'Gasoline',
    transmissionType: 'Automatic',
    condition: 'new',
    images: ['https://example.com/image1.jpg']
  };

  const car = await Car.addNewCar(
    carData.model || defaultCar.model,
    carData.manufactureYear || defaultCar.manufactureYear,
    carData.brand || defaultCar.brand,
    carData.type || defaultCar.type,
    carData.price || defaultCar.price,
    carData.engineCapacity || defaultCar.engineCapacity,
    carData.wheelDriveType || defaultCar.wheelDriveType,
    carData.engineType || defaultCar.engineType,
    carData.transmissionType || defaultCar.transmissionType,
    carData.condition || defaultCar.condition,
    carData.images || defaultCar.images
  );

  return car;
};

/**
 * Create a test order
 */
const createTestOrder = async (orderData = {}) => {
  const Order = require('../../Models/orderModel');
  
  const defaultOrder = {
    items: [
      {
        carId: '507f1f77bcf86cd799439011',
        quantity: 1,
        price: 25000
      }
    ],
    totalAmount: 25000,
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      phone: '1234567890'
    }
  };

  const order = await Order.createOrder({
    items: orderData.items || defaultOrder.items,
    totalAmount: orderData.totalAmount || defaultOrder.totalAmount,
    shippingAddress: orderData.shippingAddress || defaultOrder.shippingAddress,
    userID: orderData.userID || null
  });

  return order;
};

module.exports = {
  createTestUser,
  createTestAdmin,
  generateToken,
  createTestCar,
  createTestOrder
};
