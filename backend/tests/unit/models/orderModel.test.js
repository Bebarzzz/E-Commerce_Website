const Order = require('../../../Models/orderModel');
const mongoose = require('mongoose');
require('../../setup');

describe('Order Model Unit Tests', () => {
  
  describe('Create Order', () => {
    test('should create order with valid data', async () => {
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
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
      
      const order = await Order.createOrder(orderData);
      
      expect(order).toBeDefined();
      expect(order.items).toHaveLength(1);
      expect(order.totalAmount).toBe(30000);
      expect(order.shippingAddress.firstName).toBe('John');
      expect(order.status).toBe('pending');
    });

    test('should create order with userID', async () => {
      const userId = new mongoose.Types.ObjectId();
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
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
        },
        userID: userId
      };
      
      const order = await Order.createOrder(orderData);
      
      expect(order.userID.toString()).toBe(userId.toString());
    });

    test('should create order without userID (guest checkout)', async () => {
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            price: 20000
          }
        ],
        totalAmount: 20000,
        shippingAddress: {
          firstName: 'Guest',
          lastName: 'User',
          email: 'guest@example.com',
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA',
          phone: '5555555555'
        }
      };
      
      const order = await Order.createOrder(orderData);
      
      expect(order).toBeDefined();
      expect(order.userID).toBeUndefined();
    });

    test('should create order with multiple items', async () => {
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            price: 30000
          },
          {
            carId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            price: 25000
          }
        ],
        totalAmount: 55000,
        shippingAddress: {
          firstName: 'Multi',
          lastName: 'Item',
          email: 'multi@example.com',
          street: '321 Elm St',
          city: 'Seattle',
          state: 'WA',
          zipCode: '98101',
          country: 'USA',
          phone: '1112223333'
        }
      };
      
      const order = await Order.createOrder(orderData);
      
      expect(order.items).toHaveLength(2);
      expect(order.totalAmount).toBe(55000);
    });

    test('should fail with missing items', async () => {
      const orderData = {
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
      
      await expect(
        Order.createOrder(orderData)
      ).rejects.toThrow();
    });

    test('should fail with missing totalAmount', async () => {
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            price: 30000
          }
        ],
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
      
      await expect(
        Order.createOrder(orderData)
      ).rejects.toThrow();
    });

    test('should fail with missing shippingAddress', async () => {
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
            quantity: 1,
            price: 30000
          }
        ],
        totalAmount: 30000
      };
      
      await expect(
        Order.createOrder(orderData)
      ).rejects.toThrow();
    });

    test('should default status to pending', async () => {
      const orderData = {
        items: [
          {
            carId: new mongoose.Types.ObjectId().toString(),
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
      
      const order = await Order.createOrder(orderData);
      expect(order.status).toBe('pending');
    });
  });

  describe('Show Orders', () => {
    test('should return all orders', async () => {
      // Create multiple orders
      const orderData1 = {
        items: [{ carId: new mongoose.Types.ObjectId().toString(), quantity: 1, price: 30000 }],
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
        items: [{ carId: new mongoose.Types.ObjectId().toString(), quantity: 1, price: 25000 }],
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
      
      await Order.createOrder(orderData1);
      await Order.createOrder(orderData2);
      
      const orders = await Order.showOrders();
      
      expect(orders).toBeDefined();
      expect(orders.length).toBeGreaterThanOrEqual(2);
    });

    test('should return empty array when no orders exist', async () => {
      const orders = await Order.showOrders();
      
      expect(orders).toBeDefined();
      expect(Array.isArray(orders)).toBe(true);
    });

    test('should sort orders by creation date (newest first)', async () => {
      // Create orders with slight delay
      const order1 = await Order.createOrder({
        items: [{ carId: new mongoose.Types.ObjectId().toString(), quantity: 1, price: 30000 }],
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
      });
      
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const order2 = await Order.createOrder({
        items: [{ carId: new mongoose.Types.ObjectId().toString(), quantity: 1, price: 25000 }],
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
      });
      
      const orders = await Order.showOrders();
      
      expect(orders[0]._id.toString()).toBe(order2._id.toString());
      expect(orders[1]._id.toString()).toBe(order1._id.toString());
    });
  });

  describe('Order Schema Validation', () => {
    test('should have required fields', () => {
      const orderSchema = Order.schema.obj;
      
      expect(orderSchema.items.required).toBe(true);
      expect(orderSchema.totalAmount.required).toBe(true);
      expect(orderSchema.shippingAddress.required).toBe(true);
    });

    test('should have timestamps', async () => {
      const order = await Order.createOrder({
        items: [{ carId: new mongoose.Types.ObjectId().toString(), quantity: 1, price: 30000 }],
        totalAmount: 30000,
        shippingAddress: {
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          street: '123 St',
          city: 'City',
          state: 'ST',
          zipCode: '12345',
          country: 'USA',
          phone: '1234567890'
        }
      });
      
      expect(order.createdAt).toBeDefined();
      expect(order.updatedAt).toBeDefined();
    });
  });
});
