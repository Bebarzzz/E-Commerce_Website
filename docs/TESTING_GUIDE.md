# Quick Test Reference Guide

## Running Tests

### Backend Tests
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Run all tests
npm test

# Run with coverage report
npm test -- --coverage

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run in watch mode
npm run test:watch

# Run specific test file
npm test -- userModel.test.js
```

### Frontend Tests
```bash
# Navigate to frontend directory
cd frontend

# Run all tests
npm test

# Run with coverage report
npm test -- --coverage --watchAll=false

# Run specific test file
npm test -- Navbar.test.jsx

# Run all tests once (no watch mode)
npm test -- --watchAll=false
```

## Test Structure

### Backend Test Files
```
backend/tests/
├── setup.js                          # Test configuration
├── helpers/
│   └── testHelpers.js               # Helper functions
├── unit/
│   └── models/
│       ├── userModel.test.js        # 27 tests
│       ├── carModel.test.js         # 43 tests
│       └── orderModel.test.js       # 28 tests
└── integration/
    └── api/
        ├── userRoutes.test.js       # 24 tests
        ├── carRoutes.test.js        # 50 tests
        └── orderRoutes.test.js      # 18 tests
```

### Frontend Test Files
```
frontend/src/
├── Components/
│   ├── Navbar/Navbar.test.jsx              # 10 tests
│   ├── CartItems/CartItems.test.jsx        # 13 tests
│   ├── SearchBar/SearchBar.test.jsx        # 10 tests
│   ├── ProductDisplay/ProductDisplay.test.jsx  # 12 tests
│   └── Item/Item.test.jsx                  # 10 tests
└── Pages/
    ├── LoginSignup.test.jsx                # 20 tests
    └── Checkout.test.jsx                   # 19 tests
```

## Test Coverage

### View Coverage Report
```bash
# Backend
cd backend
npm test -- --coverage
# Open coverage/lcov-report/index.html in browser

# Frontend
cd frontend
npm test -- --coverage --watchAll=false
# Open coverage/lcov-report/index.html in browser
```

## Quick Test Examples

### Backend Unit Test Example
```javascript
test('should create a new user with valid data', async () => {
  const user = await User.signup('john', 'john@example.com', 'Password123!', 'user');
  
  expect(user).toBeDefined();
  expect(user.username).toBe('john');
  expect(user.email).toBe('john@example.com');
});
```

### Backend Integration Test Example
```javascript
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
});
```

### Frontend Component Test Example
```javascript
test('displays cart item count', () => {
  renderWithRouter(<Navbar />);
  
  const cartCount = screen.getByText('3');
  expect(cartCount).toBeInTheDocument();
});
```

## Common Commands

### Debug Specific Test
```bash
# Backend
npm test -- --testNamePattern="should create a new user"

# Frontend
npm test -- --testNamePattern="displays cart item count"
```

### Run Tests for Specific File
```bash
# Backend
npm test -- carModel.test.js

# Frontend
npm test -- Navbar.test.jsx
```

### Update Snapshots (if using)
```bash
# Frontend
npm test -- -u
```

## Test Statistics

- **Total Tests**: 270+
- **Backend Tests**: 170
  - Unit Tests: 98
  - Integration Tests: 72
- **Frontend Tests**: 104
  - Component Tests: 55
  - Page Tests: 39

## Coverage Targets

- **Backend**: 80%+ overall
- **Frontend**: 70%+ overall
- **Critical paths**: 90%+

## Troubleshooting

### Tests Hanging
```bash
# Backend - use forceExit flag
npm test -- --forceExit

# Check for open handles
npm test -- --detectOpenHandles
```

### MongoDB Memory Server Issues
```bash
# Clear node_modules and reinstall
cd backend
rm -rf node_modules
npm install
```

### React Testing Library Issues
```bash
# Update testing dependencies
cd frontend
npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Pre-deployment

See `.github/workflows/` for CI configuration.

## Next Steps

1. Install dependencies: `npm install` in both backend and frontend
2. Run tests: `npm test`
3. Check coverage: `npm test -- --coverage`
4. Review docs/TEST_CASES.md for detailed documentation
