const request = require('supertest');
const express = require('express');
const carRoutes = require('../../../routes/car');
const { createTestUser, createTestAdmin, generateToken } = require('../../helpers/testHelpers');
require('../../setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/car', carRoutes);

describe('Car API Integration Tests', () => {
  
  let userToken;
  let adminToken;
  let userId;
  let adminId;

  beforeEach(async () => {
    // Create test user and admin
    const user = await createTestUser();
    const admin = await createTestAdmin();
    
    userId = user._id.toString();
    adminId = admin._id.toString();
    
    userToken = generateToken(userId);
    adminToken = generateToken(adminId);
  });

  describe('GET /api/car', () => {
    test('should return all cars', async () => {
      const response = await request(app)
        .get('/api/car');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    test('should return empty array when no cars exist', async () => {
      const response = await request(app)
        .get('/api/car');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    test('should return cars sorted by creation date (newest first)', async () => {
      // Create test cars as admin
      await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'First Car',
          manufactureYear: 2022,
          brand: 'Toyota',
          type: 'Sedan',
          price: 25000,
          engineCapacity: 2.0,
          wheelDriveType: 'FWD',
          engineType: 'Gasoline',
          transmissionType: 'Automatic',
          condition: 'new'
        });

      await new Promise(resolve => setTimeout(resolve, 10));

      await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Second Car',
          manufactureYear: 2023,
          brand: 'Honda',
          type: 'SUV',
          price: 30000,
          engineCapacity: 2.5,
          wheelDriveType: 'AWD',
          engineType: 'Hybrid',
          transmissionType: 'Automatic',
          condition: 'new'
        });

      const response = await request(app)
        .get('/api/car');

      expect(response.body[0].model).toBe('Second Car');
      expect(response.body[1].model).toBe('First Car');
    });
  });

  describe('GET /api/car/search', () => {
    beforeEach(async () => {
      // Create test cars
      await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Camry',
          manufactureYear: 2022,
          brand: 'Toyota',
          type: 'Sedan',
          price: 25000,
          engineCapacity: 2.5,
          wheelDriveType: 'FWD',
          engineType: 'Gasoline',
          transmissionType: 'Automatic',
          condition: 'new'
        });

      await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Civic',
          manufactureYear: 2023,
          brand: 'Honda',
          type: 'Sedan',
          price: 22000,
          engineCapacity: 1.8,
          wheelDriveType: 'FWD',
          engineType: 'Gasoline',
          transmissionType: 'Manual',
          condition: 'new'
        });
    });

    test('should search cars by model', async () => {
      const response = await request(app)
        .get('/api/car/search?query=Camry');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].model).toBe('Camry');
    });

    test('should search cars by brand', async () => {
      const response = await request(app)
        .get('/api/car/search?query=Toyota');
      
      expect(response.status).toBe(200);
      expect(response.body.some(car => car.brand === 'Toyota')).toBe(true);
    });

    test('should search cars by type', async () => {
      const response = await request(app)
        .get('/api/car/search?query=Sedan');
      
      expect(response.status).toBe(200);
      expect(response.body.every(car => car.type === 'Sedan')).toBe(true);
    });

    test('should be case-insensitive', async () => {
      const response = await request(app)
        .get('/api/car/search?query=TOYOTA');
      
      expect(response.status).toBe(200);
      expect(response.body.some(car => car.brand === 'Toyota')).toBe(true);
    });

    test('should return 3 most recent cars when no query provided', async () => {
      const response = await request(app)
        .get('/api/car/search');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(3);
    });

    test('should limit results to 3 cars', async () => {
      // Create additional cars
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/car')
          .set('Authorization', `Bearer ${adminToken}`)
          .send({
            model: `TestCar${i}`,
            manufactureYear: 2023,
            brand: 'TestBrand',
            type: 'Sedan',
            price: 20000,
            engineCapacity: 2.0,
            wheelDriveType: 'FWD',
            engineType: 'Gasoline',
            transmissionType: 'Automatic',
            condition: 'new'
          });
      }

      const response = await request(app)
        .get('/api/car/search?query=TestBrand');
      
      expect(response.status).toBe(200);
      expect(response.body.length).toBeLessThanOrEqual(3);
    });
  });

  describe('GET /api/car/:id', () => {
    let carId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Test Car',
          manufactureYear: 2022,
          brand: 'Toyota',
          type: 'Sedan',
          price: 25000,
          engineCapacity: 2.0,
          wheelDriveType: 'FWD',
          engineType: 'Gasoline',
          transmissionType: 'Automatic',
          condition: 'new'
        });
      
      carId = createResponse.body._id;
    });

    test('should get single car by ID', async () => {
      const response = await request(app)
        .get(`/api/car/${carId}`);
      
      expect(response.status).toBe(200);
      expect(response.body._id).toBe(carId);
      expect(response.body.model).toBe('Test Car');
    });

    test('should return 404 for non-existent car', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .get(`/api/car/${fakeId}`);
      
      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });

    test('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/car/invalid-id');
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Invalid car ID');
    });
  });

  describe('POST /api/car', () => {
    const validCarData = {
      model: 'New Car',
      manufactureYear: 2023,
      brand: 'Toyota',
      type: 'SUV',
      price: 35000,
      engineCapacity: 3.0,
      wheelDriveType: 'AWD',
      engineType: 'Hybrid',
      transmissionType: 'Automatic',
      condition: 'new'
    };

    test('should create car with admin token', async () => {
      const response = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validCarData);
      
      expect(response.status).toBe(201);
      expect(response.body.model).toBe('New Car');
      expect(response.body.price).toBe(35000);
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/car')
        .send(validCarData);
      
      expect(response.status).toBe(401);
    });

    test('should return 403 with user token (not admin)', async () => {
      const response = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validCarData);
      
      expect(response.status).toBe(403);
      expect(response.body.error).toContain('Admin');
    });

    test('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Incomplete Car',
          brand: 'Toyota'
          // Missing other required fields
        });
      
      expect(response.status).toBe(400);
    });

    test('should accept car without images', async () => {
      const response = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validCarData);
      
      expect(response.status).toBe(201);
      expect(response.body.images).toEqual([]);
    });
  });

  describe('PATCH /api/car/:id', () => {
    let carId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Original Car',
          manufactureYear: 2022,
          brand: 'Toyota',
          type: 'Sedan',
          price: 25000,
          engineCapacity: 2.0,
          wheelDriveType: 'FWD',
          engineType: 'Gasoline',
          transmissionType: 'Automatic',
          condition: 'new'
        });
      
      carId = createResponse.body._id;
    });

    test('should update car with admin token', async () => {
      const response = await request(app)
        .patch(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 23000,
          condition: 'used'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.updatedCar.price).toBe(23000);
      expect(response.body.updatedCar.condition).toBe('used');
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .patch(`/api/car/${carId}`)
        .send({ price: 23000 });
      
      expect(response.status).toBe(401);
    });

    test('should return 403 with user token (not admin)', async () => {
      const response = await request(app)
        .patch(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ price: 23000 });
      
      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent car', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .patch(`/api/car/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 23000 });
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/car/:id', () => {
    let carId;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/api/car')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          model: 'Car to Delete',
          manufactureYear: 2022,
          brand: 'Toyota',
          type: 'Sedan',
          price: 25000,
          engineCapacity: 2.0,
          wheelDriveType: 'FWD',
          engineType: 'Gasoline',
          transmissionType: 'Automatic',
          condition: 'new'
        });
      
      carId = createResponse.body._id;
    });

    test('should delete car with admin token', async () => {
      const response = await request(app)
        .delete(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.message).toContain('deleted');
      
      // Verify car is deleted
      const getResponse = await request(app)
        .get(`/api/car/${carId}`);
      expect(getResponse.status).toBe(404);
    });

    test('should return 401 without token', async () => {
      const response = await request(app)
        .delete(`/api/car/${carId}`);
      
      expect(response.status).toBe(401);
    });

    test('should return 403 with user token (not admin)', async () => {
      const response = await request(app)
        .delete(`/api/car/${carId}`)
        .set('Authorization', `Bearer ${userToken}`);
      
      expect(response.status).toBe(403);
    });

    test('should return 404 for non-existent car', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app)
        .delete(`/api/car/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(response.status).toBe(404);
    });
  });
});

