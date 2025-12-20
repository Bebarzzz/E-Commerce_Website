const request = require('supertest');
const express = require('express');
const orderRoutes = require('../../../routes/order');
const { createTestUser, generateToken } = require('../../helpers/testHelpers');
const mongoose = require('mongoose');
require('../../setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/order', orderRoutes);

describe('Order API Integration Tests', () => {
  
  let userToken;
  let userId;

  beforeEach(async () => {
    const user = await createTestUser();
    userId = user._id.toString();
    userToken = generateToken(userId);
  });

  describe('POST /api/order', () => {
    const validOrderData = {
      items: [
        {
          carId: new mongoose.Types.ObjectId().toString(),
          name: 'Test Car',
          image: 'https://example.com/car.jpg',
          quantity: 1,
          price: 30000
        }
      ],
      totalAmount: 30000,
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

    test('should create order with authentication', async () => {
      const response = await request(app)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validOrderData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
      expect(response.body.order.totalAmount).toBe(30000);
    });

    test('should create order without authentication (guest checkout)', async () => {
      const response = await request(app)
        .post('/api/order')
        .send(validOrderData);
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.order).toBeDefined();
    });

    test('should associate order with user when authenticated', async () => {
      const response = await request(app)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validOrderData);
      
      expect(response.status).toBe(201);
      expect(response.body.order.userID).toBeDefined();
    });

    test('should create order with multiple items', async () => {
      const multiItemOrder = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            name: 'Test Car',
            image: 'https://example.com/car.jpg',
            quantity: 1,
            price: 30000
          },
          {
            carId: new mongoose.Types.ObjectId().toString(),
            name: 'Test Car',
            image: 'https://example.com/car.jpg',
            quantity: 1,
            price: 25000
          }
        ],
        totalAmount: 55000,
        shippingAddress: validOrderData.shippingAddress
      };

      const response = await request(app)
        .post('/api/order')
        .send(multiItemOrder);
      
      expect(response.status).toBe(201);
      expect(response.body.order.items).toHaveLength(2);
      expect(response.body.order.totalAmount).toBe(55000);
    });

    test('should return 400 for missing items', async () => {
      const invalidOrder = {
        totalAmount: 30000,
        shippingAddress: validOrderData.shippingAddress
      };

      const response = await request(app)
        .post('/api/order')
        .send(invalidOrder);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for missing totalAmount', async () => {
      const invalidOrder = {
        items: validOrderData.items,
        shippingAddress: validOrderData.shippingAddress
      };

      const response = await request(app)
        .post('/api/order')
        .send(invalidOrder);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should return 400 for missing shippingAddress', async () => {
      const invalidOrder = {
        items: validOrderData.items,
        totalAmount: 30000
      };

      const response = await request(app)
        .post('/api/order')
        .send(invalidOrder);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should validate shipping address fields', async () => {
      const invalidOrder = {
        items: validOrderData.items,
        totalAmount: 30000,
        shippingAddress: {
          firstName: 'John'
          // Missing other required address fields
        }
      };

      const response = await request(app)
        .post('/api/order')
        .send(invalidOrder);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test('should handle invalid JWT token gracefully', async () => {
      const response = await request(app)
        .post('/api/order')
        .set('Authorization', 'Bearer invalid-token')
        .send(validOrderData);
      
      // Should still create order but without userID
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/order/showallorders', () => {
    beforeEach(async () => {
      // Create test orders
      const orderData1 = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            name: 'Test Car',
            image: 'https://example.com/car.jpg',
            quantity: 1,
            price: 30000
          }
        ],
        totalAmount: 30000,
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

      const orderData2 = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            name: 'Test Car',
            image: 'https://example.com/car.jpg',
            quantity: 1,
            price: 25000
          }
        ],
        totalAmount: 25000,
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane@example.com',
          street: '456 Oak Ave',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA',
          phone: '9876543210'
        }
      };

      await request(app).post('/api/order').send(orderData1);
      await request(app).post('/api/order').send(orderData2);
    });

    test('should return all orders', async () => {
      const response = await request(app)
        .get('/api/order/showallorders');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.orders)).toBe(true);
      expect(response.body.orders.length).toBeGreaterThanOrEqual(2);
    });

    test('should return orders with all required fields', async () => {
      const response = await request(app)
        .get('/api/order/showallorders');
      
      expect(response.status).toBe(200);
      const order = response.body.orders[0];
      
      expect(order).toHaveProperty('items');
      expect(order).toHaveProperty('totalAmount');
      expect(order).toHaveProperty('shippingAddress');
      expect(order).toHaveProperty('orderStatus');
      expect(order).toHaveProperty('createdAt');
    });

    test('should return orders sorted by creation date (newest first)', async () => {
      const response = await request(app)
        .get('/api/order/showallorders');
      
      expect(response.status).toBe(200);
      const orders = response.body.orders;
      
      for (let i = 0; i < orders.length - 1; i++) {
        const date1 = new Date(orders[i].createdAt);
        const date2 = new Date(orders[i + 1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });

    test('should return empty array when no orders exist', async () => {
      // Clear all orders
      const Order = require('../../../Models/orderModel');
      await Order.deleteMany({});
      
      const response = await request(app)
        .get('/api/order/showallorders');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.orders).toEqual([]);
    });
  });

  describe('Order Workflow', () => {
    test('should create order and retrieve it from all orders', async () => {
      // Create an order
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            name: 'Test Car',
            image: 'https://example.com/car.jpg',
            quantity: 1,
            price: 30000
          }
        ],
        totalAmount: 30000,
        shippingAddress: {
          firstName: 'Workflow',
          lastName: 'Test',
          email: 'workflow@example.com',
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
          phone: '5555555555'
        }
      };

      const createResponse = await request(app)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData);
      
      expect(createResponse.status).toBe(201);
      const createdOrderId = createResponse.body.order._id;
      
      // Retrieve all orders
      const getAllResponse = await request(app)
        .get('/api/order/showallorders');
      
      expect(getAllResponse.status).toBe(200);
      const foundOrder = getAllResponse.body.orders.find(
        order => order._id === createdOrderId
      );
      
      expect(foundOrder).toBeDefined();
      expect(foundOrder.shippingAddress.firstName).toBe('Workflow');
    });

    test('should create multiple orders for same user', async () => {
      const orderData1 = {
        items: [{ carId: new mongoose.Types.ObjectId().toString(), name: 'Test Car', image: 'https://example.com/car.jpg', quantity: 1, price: 30000 }],
        totalAmount: 30000,
        shippingAddress: {
          firstName: 'First',
          lastName: 'Order',
          email: 'first@example.com',
          street: '123 St',
          city: 'City',
          state: 'ST',
          zipCode: '12345',
          country: 'USA',
          phone: '1234567890'
        }
      };

      const orderData2 = {
        items: [{ carId: new mongoose.Types.ObjectId().toString(), name: 'Test Car', image: 'https://example.com/car.jpg', quantity: 1, price: 25000 }],
        totalAmount: 25000,
        shippingAddress: {
          firstName: 'Second',
          lastName: 'Order',
          email: 'second@example.com',
          street: '456 Ave',
          city: 'Town',
          state: 'ST',
          zipCode: '54321',
          country: 'USA',
          phone: '0987654321'
        }
      };

      const response1 = await request(app)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData1);
      
      const response2 = await request(app)
        .post('/api/order')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderData2);
      
      expect(response1.status).toBe(201);
      expect(response2.status).toBe(201);
      expect(response1.body.order.userID).toBe(response2.body.order.userID);
    });
  });
});


