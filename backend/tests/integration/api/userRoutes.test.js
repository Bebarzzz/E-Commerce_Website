const request = require('supertest');
const express = require('express');
const userRoutes = require('../../../routes/user');
require('../../setup');

// Create Express app for testing
const app = express();
app.use(express.json());
app.use('/api/user', userRoutes);

describe('User API Integration Tests', () => {
  
  describe('POST /api/user/signup', () => {
    test('should create new user with valid data', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'newuser',
          email: 'newuser@example.com',
          password: 'Password123!',
          role: 'user'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.username).toBe('newuser');
      expect(response.body.email).toBe('newuser@example.com');
      expect(response.body.role).toBe('user');
    });

    test('should create admin user', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'adminuser',
          email: 'admin@example.com',
          password: 'AdminPass123!',
          role: 'admin'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.role).toBe('admin');
    });

    test('should return 400 for missing username', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          email: 'test@example.com',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'testuser',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'testuser',
          email: 'invalid-email',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Email');
    });

    test('should return 400 for weak password', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'weak'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Password');
    });

    test('should return 400 for duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/user/signup')
        .send({
          username: 'user1',
          email: 'duplicate@example.com',
          password: 'Password123!'
        });
      
      // Try to create second user with same email
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'user2',
          email: 'duplicate@example.com',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Email already in use');
    });

    test('should return JWT token', async () => {
      const response = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'tokentest',
          email: 'token@example.com',
          password: 'Password123!'
        });
      
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/user/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/user/signup')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'Password123!',
          role: 'user'
        });
    });

    test('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.username).toBe('loginuser');
      expect(response.body.email).toBe('login@example.com');
    });

    test('should return user role on login', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });
      
      expect(response.body.role).toBe('user');
    });

    test('should return 400 for missing email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          password: 'Password123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for incorrect email', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'wrong@example.com',
          password: 'Password123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('email');
    });

    test('should return 400 for incorrect password', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword123!'
        });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('password');
    });

    test('should return valid JWT token on successful login', async () => {
      const response = await request(app)
        .post('/api/user/login')
        .send({
          email: 'login@example.com',
          password: 'Password123!'
        });
      
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      
      // Verify token format (JWT has 3 parts separated by dots)
      const tokenParts = response.body.token.split('.');
      expect(tokenParts).toHaveLength(3);
    });
  });

  describe('Authentication Flow', () => {
    test('should signup and then login with same credentials', async () => {
      // Signup
      const signupResponse = await request(app)
        .post('/api/user/signup')
        .send({
          username: 'flowuser',
          email: 'flow@example.com',
          password: 'Password123!'
        });
      
      expect(signupResponse.status).toBe(200);
      const signupToken = signupResponse.body.token;
      
      // Login
      const loginResponse = await request(app)
        .post('/api/user/login')
        .send({
          email: 'flow@example.com',
          password: 'Password123!'
        });
      
      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.token).toBeDefined();
      expect(loginResponse.body.username).toBe('flowuser');
    });
  });
});
