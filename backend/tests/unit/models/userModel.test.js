const User = require('../../../Models/userModel');
require('../../setup');

describe('User Model Unit Tests', () => {
  
  describe('User Signup', () => {
    test('should create a new user with valid data', async () => {
      const user = await User.signup('john', 'john@example.com', 'Password123!', 'user');
      
      expect(user).toBeDefined();
      expect(user.username).toBe('john');
      expect(user.email).toBe('john@example.com');
      expect(user.role).toBe('user');
      expect(user.password).not.toBe('Password123!'); // Should be hashed
    });

    test('should create an admin user', async () => {
      const admin = await User.signup('admin', 'admin@example.com', 'AdminPass123!', 'admin');
      
      expect(admin.role).toBe('admin');
    });

    test('should fail with missing username', async () => {
      await expect(
        User.signup('', 'test@example.com', 'Password123!', 'user')
      ).rejects.toThrow('All fields must be filled');
    });

    test('should fail with missing email', async () => {
      await expect(
        User.signup('testuser', '', 'Password123!', 'user')
      ).rejects.toThrow('All fields must be filled');
    });

    test('should fail with missing password', async () => {
      await expect(
        User.signup('testuser', 'test@example.com', '', 'user')
      ).rejects.toThrow('All fields must be filled');
    });

    test('should fail with invalid email', async () => {
      await expect(
        User.signup('testuser', 'invalid-email', 'Password123!', 'user')
      ).rejects.toThrow('Email is not valid');
    });

    test('should fail with weak password', async () => {
      await expect(
        User.signup('testuser', 'test@example.com', 'weak', 'user')
      ).rejects.toThrow('Password not strong enough');
    });

    test('should fail with duplicate email', async () => {
      await User.signup('user1', 'duplicate@example.com', 'Password123!', 'user');
      
      await expect(
        User.signup('user2', 'duplicate@example.com', 'Password123!', 'user')
      ).rejects.toThrow('Email already in use');
    });

    test('should default to user role when no role specified', async () => {
      const user = await User.signup('noRole', 'norole@example.com', 'Password123!');
      expect(user.role).toBe('user');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await User.signup('logintest', 'login@example.com', 'Password123!', 'user');
    });

    test('should login with correct credentials', async () => {
      const user = await User.login('login@example.com', 'Password123!');
      
      expect(user).toBeDefined();
      expect(user.email).toBe('login@example.com');
      expect(user.username).toBe('logintest');
    });

    test('should fail with missing email', async () => {
      await expect(
        User.login('', 'Password123!')
      ).rejects.toThrow('All fields must be filled');
    });

    test('should fail with missing password', async () => {
      await expect(
        User.login('login@example.com', '')
      ).rejects.toThrow('All fields must be filled');
    });

    test('should fail with incorrect email', async () => {
      await expect(
        User.login('wrong@example.com', 'Password123!')
      ).rejects.toThrow('Incorrect email');
    });

    test('should fail with incorrect password', async () => {
      await expect(
        User.login('login@example.com', 'WrongPassword123!')
      ).rejects.toThrow('Incorrect password');
    });
  });

  describe('User Schema Validation', () => {
    test('should have required fields', () => {
      const userSchema = User.schema.obj;
      
      expect(userSchema.username.required).toBe(true);
      expect(userSchema.email.required).toBe(true);
      expect(userSchema.password.required).toBe(true);
    });

    test('should have unique email constraint', () => {
      const userSchema = User.schema.obj;
      expect(userSchema.email.unique).toBe(true);
    });

    test('should have role enum with user and admin', () => {
      const userSchema = User.schema.obj;
      expect(userSchema.role.enum).toContain('user');
      expect(userSchema.role.enum).toContain('admin');
    });
  });
});
