# Backend Tests

This directory contains comprehensive test suites for the E-Commerce backend application.

## Directory Structure

```
tests/
├── setup.js                    # Global test setup and configuration
├── helpers/
│   └── testHelpers.js         # Reusable test helper functions
├── unit/
│   └── models/                # Model unit tests
│       ├── userModel.test.js  # User model tests (27 cases)
│       ├── carModel.test.js   # Car model tests (43 cases)
│       └── orderModel.test.js # Order model tests (28 cases)
└── integration/
    └── api/                   # API integration tests
        ├── userRoutes.test.js # User routes tests (24 cases)
        ├── carRoutes.test.js  # Car routes tests (50 cases)
        └── orderRoutes.test.js # Order routes tests (18 cases)
```

## Test Environment

- **Framework**: Jest 29.7.0
- **HTTP Testing**: Supertest 6.3.3
- **Database**: MongoDB Memory Server 9.1.5

## Running Tests

### All Tests
```bash
npm test
```

### With Coverage
```bash
npm test -- --coverage
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

### Specific Test File
```bash
npm test -- userModel.test.js
```

## Test Categories

### Unit Tests (98 tests)
Test individual models and their methods in isolation:
- User model: Signup, login, validation
- Car model: CRUD operations, validation
- Order model: Creation, retrieval, validation

### Integration Tests (72 tests)
Test API endpoints with HTTP requests:
- User routes: Authentication, authorization
- Car routes: CRUD with auth middleware
- Order routes: Order creation and listing

## Test Helpers

Located in `helpers/testHelpers.js`:

- `createTestUser()` - Create a test user
- `createTestAdmin()` - Create an admin user
- `generateToken(userId)` - Generate JWT token
- `createTestCar()` - Create a test car
- `createTestOrder()` - Create a test order

## Setup and Teardown

The `setup.js` file:
- Creates in-memory MongoDB instance
- Connects to database before tests
- Clears data after each test
- Closes connections after all tests
- Sets test environment variables

## Writing New Tests

### Unit Test Template
```javascript
const Model = require('../../../Models/modelName');
require('../../setup');

describe('Model Name Unit Tests', () => {
  describe('Method Name', () => {
    test('should do something', async () => {
      // Arrange
      const data = { /* test data */ };
      
      // Act
      const result = await Model.method(data);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.field).toBe(expectedValue);
    });
  });
});
```

### Integration Test Template
```javascript
const request = require('supertest');
const express = require('express');
const routes = require('../../../routes/routeName');
require('../../setup');

const app = express();
app.use(express.json());
app.use('/api/resource', routes);

describe('Resource API Integration Tests', () => {
  test('should perform action', async () => {
    const response = await request(app)
      .post('/api/resource')
      .send({ /* request data */ });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('field');
  });
});
```

## Coverage Goals

- **Lines**: 80%+
- **Functions**: 80%+
- **Branches**: 75%+
- **Statements**: 80%+

## Common Patterns

### Testing Authentication
```javascript
const { generateToken, createTestUser } = require('../../helpers/testHelpers');

const user = await createTestUser();
const token = generateToken(user._id);

const response = await request(app)
  .get('/api/protected')
  .set('Authorization', `Bearer ${token}`);
```

### Testing Authorization (Admin)
```javascript
const { createTestAdmin, generateToken } = require('../../helpers/testHelpers');

const admin = await createTestAdmin();
const adminToken = generateToken(admin._id);

const response = await request(app)
  .post('/api/admin-only')
  .set('Authorization', `Bearer ${adminToken}`);
```

### Testing Validation Errors
```javascript
test('should fail with missing field', async () => {
  await expect(
    Model.method(invalidData)
  ).rejects.toThrow('Error message');
});
```

## Tips

1. **Isolation**: Each test should be independent
2. **Cleanup**: Database is cleared after each test automatically
3. **Async**: Use async/await for database operations
4. **Descriptive**: Write clear test names
5. **Edge Cases**: Test both success and failure scenarios

## Troubleshooting

### Tests hanging
Add `--forceExit` flag:
```bash
npm test -- --forceExit
```

### MongoDB connection issues
Check MongoDB Memory Server is properly installed:
```bash
npm install mongodb-memory-server --save-dev
```

### Port conflicts
The in-memory DB uses random ports, so no conflicts should occur.

## CI/CD

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before deployment

## More Information

See the main project's docs/TEST_CASES.md for detailed test documentation.
