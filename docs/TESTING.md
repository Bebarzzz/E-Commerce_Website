# Testing Guide

Comprehensive testing documentation for the E-Commerce Car Dealership platform.

> **✅ UPDATE**: Comprehensive test suite has been implemented! See the following documentation:
> - **[TEST_CASES.md](TEST_CASES.md)** - Detailed test case documentation (270+ tests)
> - **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Quick reference guide for running tests
> - **[TEST_IMPLEMENTATION_SUMMARY.md](TEST_IMPLEMENTATION_SUMMARY.md)** - Implementation summary
> - **[TEST_EXECUTION_CHECKLIST.md](TEST_EXECUTION_CHECKLIST.md)** - Testing checklist
> - **[../backend/tests/README.md](../backend/tests/README.md)** - Backend test documentation

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Testing Stack](#testing-stack)
- [Getting Started](#getting-started)
- [Frontend Testing](#frontend-testing)
- [Backend Testing](#backend-testing)
- [Integration Testing](#integration-testing)
- [E2E Testing](#e2e-testing)
- [Manual Testing](#manual-testing)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

---

## Overview

### Current Testing Status ✅ IMPLEMENTED

**Frontend:**
- ✅ Jest configured
- ✅ React Testing Library installed
- ✅ **104+ tests implemented** (Component + Page tests)
- ✅ Coverage: 70%+ target

**Backend:**
- ✅ **Jest + Supertest configured**
- ✅ **MongoDB Memory Server for isolated testing**
- ✅ **170 tests implemented** (98 unit + 72 integration)
- ✅ Coverage: 80%+ target

**Total Test Coverage:**
- ✅ **270+ comprehensive test cases**
- ✅ User Management: 51 tests
- ✅ Car Catalog: 93 tests
- ✅ Order Processing: 46 tests
- ✅ UI Components: 55 tests
- ✅ Page Integration: 39 tests

### Quick Start

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# With coverage
npm test -- --coverage
```

For detailed instructions, see [TESTING_GUIDE.md](TESTING_GUIDE.md).

### Testing Philosophy

- **Test-Driven Development (TDD)**: Write tests before code (recommended)
- **Behavior-Driven Development (BDD)**: Test user behavior, not implementation
- **Coverage Goals**: ✅ 80%+ coverage on critical paths (ACHIEVED)
- **Fast Feedback**: Tests should run quickly
- **Reliability**: Tests should be deterministic

---

## Testing Stack

### Current Stack

**Frontend:**
- **Test Runner**: Jest v27.5.1
- **Testing Library**: React Testing Library v16.3.0
- **Utilities**: @testing-library/jest-dom, @testing-library/user-event

**Backend (Recommended):**
- **Test Runner**: Jest
- **HTTP Testing**: Supertest
- **Mocking**: Jest built-in mocks

### Recommended Additions

```bash
# Backend testing
npm install --save-dev jest supertest mongodb-memory-server

# E2E testing (optional)
npm install --save-dev @playwright/test
# or
npm install --save-dev cypress
```

---

## Getting Started

### Setup Testing Environment

**Frontend:**
```bash
cd frontend
npm test
```

**Backend (after setup):**
```bash
cd backend

# Create test script in package.json
{
  "scripts": {
    "test": "jest --watchAll=false",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}

# Run tests
npm test
```

### Project Structure

```
frontend/
├── src/
│   ├── Components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── __tests__/
│   │   │       └── Navbar.test.js
│   │   └── CartItems/
│   │       ├── CartItems.jsx
│   │       └── __tests__/
│   │           └── CartItems.test.js
│   ├── services/
│   │   └── __tests__/
│   └── setupTests.js

backend/
├── __tests__/
│   ├── integration/
│   │   ├── car.test.js
│   │   ├── user.test.js
│   │   └── order.test.js
│   ├── unit/
│   │   ├── models/
│   │   └── controllers/
│   └── helpers/
│       └── testSetup.js
├── jest.config.js
└── package.json
```

---

## Frontend Testing

### Component Testing

**Basic Component Test:**

```javascript
// Components/__tests__/Item.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Item from '../Item/Item';

describe('Item Component', () => {
  const mockCar = {
    _id: '123',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28000,
    images: ['image1.jpg'],
    condition: 'used'
  };

  const renderItem = () => {
    return render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
  };

  test('renders car information correctly', () => {
    renderItem();
    
    expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
    expect(screen.getByText(/Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/\$28,000/i)).toBeInTheDocument();
  });

  test('displays car image with correct alt text', () => {
    renderItem();
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('image1.jpg'));
    expect(image).toHaveAttribute('alt', expect.stringContaining('Toyota Camry'));
  });

  test('links to correct product detail page', () => {
    renderItem();
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/product/123');
  });
});
```

**Testing User Interactions:**

```javascript
// Components/__tests__/CartItems.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { ShopContext } from '../../Context/ShopContext';
import CartItems from '../CartItems/CartItems';

describe('CartItems Component', () => {
  const mockRemoveFromCart = jest.fn();
  const mockUpdateQuantity = jest.fn();
  
  const mockContextValue = {
    allProducts: [
      { _id: '1', brand: 'Toyota', model: 'Camry', price: 28000, images: ['img1.jpg'] }
    ],
    cartItems: { '1': 2 },
    removeFromCart: mockRemoveFromCart,
    updateCartQuantity: mockUpdateQuantity,
    getTotalCartAmount: jest.fn(() => 56000)
  };

  const renderCartItems = () => {
    return render(
      <ShopContext.Provider value={mockContextValue}>
        <CartItems />
      </ShopContext.Provider>
    );
  };

  test('displays cart items correctly', () => {
    renderCartItems();
    
    expect(screen.getByText(/Toyota Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/\$28,000/i)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument(); // Quantity
  });

  test('calls removeFromCart when remove button is clicked', () => {
    renderCartItems();
    
    const removeButton = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeButton);
    
    expect(mockRemoveFromCart).toHaveBeenCalledWith('1');
  });

  test('updates quantity when increment button is clicked', () => {
    renderCartItems();
    
    const incrementButton = screen.getByRole('button', { name: /\+/ });
    fireEvent.click(incrementButton);
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1', 3);
  });

  test('displays correct total amount', () => {
    renderCartItems();
    
    expect(screen.getByText(/\$56,000/i)).toBeInTheDocument();
  });
});
```

### Context Testing

```javascript
// Context/__tests__/ShopContext.test.js
import { renderHook, act } from '@testing-library/react';
import { ShopContextProvider, useShopContext } from '../ShopContext';

describe('ShopContext', () => {
  test('provides initial state', () => {
    const { result } = renderHook(() => useShopContext(), {
      wrapper: ShopContextProvider
    });
    
    expect(result.current.allProducts).toEqual([]);
    expect(result.current.cartItems).toEqual({});
    expect(result.current.loading).toBe(true);
  });

  test('addToCart increases cart quantity', () => {
    const { result } = renderHook(() => useShopContext(), {
      wrapper: ShopContextProvider
    });
    
    act(() => {
      result.current.addToCart('123');
    });
    
    expect(result.current.cartItems['123']).toBe(1);
    
    act(() => {
      result.current.addToCart('123');
    });
    
    expect(result.current.cartItems['123']).toBe(2);
  });

  test('removeFromCart removes item', () => {
    const { result } = renderHook(() => useShopContext(), {
      wrapper: ShopContextProvider
    });
    
    act(() => {
      result.current.addToCart('123');
    });
    
    expect(result.current.cartItems['123']).toBe(1);
    
    act(() => {
      result.current.removeFromCart('123');
    });
    
    expect(result.current.cartItems['123']).toBeUndefined();
  });
});
```

### Service Testing

```javascript
// services/__tests__/carService.test.js
import { carService } from '../carService';

// Mock fetch globally
global.fetch = jest.fn();

describe('carService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('getAllCars', () => {
    test('fetches all cars successfully', async () => {
      const mockCars = [
        { _id: '1', brand: 'Toyota', model: 'Camry' },
        { _id: '2', brand: 'Honda', model: 'Civic' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, cars: mockCars })
      });

      const result = await carService.getAllCars();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/car/allcars')
      );
      expect(result.cars).toEqual(mockCars);
    });

    test('throws error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      });

      await expect(carService.getAllCars()).rejects.toThrow();
    });
  });

  describe('searchCars', () => {
    test('sends search query correctly', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, cars: [] })
      });

      await carService.searchCars('Toyota', 20000, 30000, 'used');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('query=Toyota'),
        expect.any(Object)
      );
    });
  });
});
```

---

## Backend Testing

### Setup Backend Testing

**Create jest.config.js:**

```javascript
// backend/jest.config.js
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'routes/**/*.js',
    '!**/__tests__/**'
  ]
};
```

**Test Setup Helper:**

```javascript
// __tests__/helpers/testSetup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to in-memory database before tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clear database between tests
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

### Model Testing

```javascript
// __tests__/unit/models/carModel.test.js
require('../helpers/testSetup');
const Car = require('../../../Models/carModel');

describe('Car Model', () => {
  describe('createCar', () => {
    test('creates a valid car', async () => {
      const carData = {
        brand: 'Toyota',
        year: 2023,
        model: 'Camry',
        type: 'Sedan',
        price: 28000,
        mileage: 15000,
        engine: '2.5L 4-Cylinder',
        transmission: 'Automatic',
        color: 'Silver',
        condition: 'used',
        images: ['image1.jpg']
      };

      const car = await Car.createCar(carData);

      expect(car._id).toBeDefined();
      expect(car.brand).toBe('Toyota');
      expect(car.year).toBe(2023);
      expect(car.price).toBe(28000);
    });

    test('throws error for invalid year', async () => {
      const carData = {
        brand: 'Toyota',
        year: 1800, // Invalid year
        model: 'Camry',
        type: 'Sedan',
        price: 28000,
        mileage: 15000,
        engine: '2.5L',
        transmission: 'Automatic',
        color: 'Silver',
        condition: 'used'
      };

      await expect(Car.createCar(carData)).rejects.toThrow();
    });

    test('throws error for negative price', async () => {
      const carData = {
        brand: 'Toyota',
        year: 2023,
        model: 'Camry',
        type: 'Sedan',
        price: -1000, // Invalid
        mileage: 15000,
        engine: '2.5L',
        transmission: 'Automatic',
        color: 'Silver',
        condition: 'used'
      };

      await expect(Car.createCar(carData)).rejects.toThrow();
    });
  });

  describe('deleteCar', () => {
    test('deletes existing car', async () => {
      const car = await Car.create({
        brand: 'Toyota',
        year: 2023,
        model: 'Camry',
        type: 'Sedan',
        price: 28000,
        mileage: 15000,
        engine: '2.5L',
        transmission: 'Automatic',
        color: 'Silver',
        condition: 'used'
      });

      const deleted = await Car.deleteCar(car._id);
      expect(deleted._id.toString()).toBe(car._id.toString());

      const found = await Car.findById(car._id);
      expect(found).toBeNull();
    });

    test('throws error for non-existent car', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await expect(Car.deleteCar(fakeId)).rejects.toThrow('No such car');
    });
  });
});
```

### Controller Testing

```javascript
// __tests__/unit/controllers/carController.test.js
const { getAllCars, getCar, searchCars } = require('../../../controllers/carController');
const Car = require('../../../Models/carModel');
require('../helpers/testSetup');

describe('Car Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getAllCars', () => {
    test('returns all cars', async () => {
      await Car.create([
        { brand: 'Toyota', year: 2023, model: 'Camry', type: 'Sedan', 
          price: 28000, mileage: 15000, engine: '2.5L', 
          transmission: 'Automatic', color: 'Silver', condition: 'used' },
        { brand: 'Honda', year: 2024, model: 'Civic', type: 'Sedan', 
          price: 25000, mileage: 5000, engine: '2.0L', 
          transmission: 'Manual', color: 'Black', condition: 'new' }
      ]);

      await getAllCars(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          cars: expect.arrayContaining([
            expect.objectContaining({ brand: 'Toyota' }),
            expect.objectContaining({ brand: 'Honda' })
          ])
        })
      );
    });
  });

  describe('searchCars', () => {
    beforeEach(async () => {
      await Car.create([
        { brand: 'Toyota', year: 2023, model: 'Camry', type: 'Sedan', 
          price: 28000, mileage: 15000, engine: '2.5L', 
          transmission: 'Automatic', color: 'Silver', condition: 'used' },
        { brand: 'Toyota', year: 2024, model: 'RAV4', type: 'SUV', 
          price: 35000, mileage: 5000, engine: '2.5L Hybrid', 
          transmission: 'Automatic', color: 'Blue', condition: 'new' }
      ]);
    });

    test('searches by brand', async () => {
      req.query = { query: 'Toyota' };
      
      await searchCars(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          cars: expect.arrayContaining([
            expect.objectContaining({ brand: 'Toyota' })
          ])
        })
      );
    });

    test('filters by price range', async () => {
      req.query = { minPrice: '30000', maxPrice: '40000' };
      
      await searchCars(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.cars).toHaveLength(1);
      expect(result.cars[0].model).toBe('RAV4');
    });

    test('filters by condition', async () => {
      req.query = { condition: 'new' };
      
      await searchCars(req, res);

      const result = res.json.mock.calls[0][0];
      expect(result.cars.every(car => car.condition === 'new')).toBe(true);
    });
  });
});
```

### API Integration Testing

```javascript
// __tests__/integration/car.test.js
const request = require('supertest');
const app = require('../../../server');
const Car = require('../../../Models/carModel');
const User = require('../../../Models/userModel');
require('../helpers/testSetup');

describe('Car API Integration Tests', () => {
  let adminToken;

  beforeEach(async () => {
    // Create admin user and get token
    const admin = await User.signup('admin', 'admin@test.com', 'Admin123!');
    await User.updateOne({ _id: admin._id }, { role: 'admin' });
    const loginRes = await request(app)
      .post('/api/user/login')
      .send({ email: 'admin@test.com', password: 'Admin123!' });
    adminToken = loginRes.body.token;
  });

  describe('GET /api/car/allcars', () => {
    test('returns all cars', async () => {
      await Car.create([
        { brand: 'Toyota', year: 2023, model: 'Camry', type: 'Sedan', 
          price: 28000, mileage: 15000, engine: '2.5L', 
          transmission: 'Automatic', color: 'Silver', condition: 'used' }
      ]);

      const response = await request(app)
        .get('/api/car/allcars')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.cars).toHaveLength(1);
      expect(response.body.cars[0].brand).toBe('Toyota');
    });
  });

  describe('POST /api/car/addcar', () => {
    test('adds car with admin auth', async () => {
      const carData = {
        brand: 'Toyota',
        year: 2024,
        model: 'RAV4',
        type: 'SUV',
        price: 35000,
        mileage: 0,
        engine: '2.5L Hybrid',
        transmission: 'Automatic',
        color: 'Blue',
        condition: 'new'
      };

      const response = await request(app)
        .post('/api/car/addcar')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(carData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.car.brand).toBe('Toyota');
    });

    test('rejects without auth', async () => {
      const carData = {
        brand: 'Toyota',
        year: 2024,
        model: 'RAV4',
        type: 'SUV',
        price: 35000,
        mileage: 0,
        engine: '2.5L',
        transmission: 'Automatic',
        color: 'Blue',
        condition: 'new'
      };

      await request(app)
        .post('/api/car/addcar')
        .send(carData)
        .expect(401);
    });
  });
});
```

---

## Integration Testing

### Testing Complete Workflows

```javascript
// __tests__/integration/orderFlow.test.js
const request = require('supertest');
const app = require('../../../server');
const User = require('../../../Models/userModel');
const Car = require('../../../Models/carModel');
const Order = require('../../../Models/orderModel');
require('../helpers/testSetup');

describe('Order Flow Integration', () => {
  let userToken, car;

  beforeEach(async () => {
    // Setup user
    const user = await User.signup('customer', 'customer@test.com', 'Customer123!');
    const loginRes = await request(app)
      .post('/api/user/login')
      .send({ email: 'customer@test.com', password: 'Customer123!' });
    userToken = loginRes.body.token;

    // Setup car
    car = await Car.create({
      brand: 'Toyota',
      year: 2023,
      model: 'Camry',
      type: 'Sedan',
      price: 28000,
      mileage: 15000,
      engine: '2.5L',
      transmission: 'Automatic',
      color: 'Silver',
      condition: 'used'
    });
  });

  test('complete order flow', async () => {
    // 1. Browse cars
    const carsRes = await request(app)
      .get('/api/car/allcars')
      .expect(200);
    
    expect(carsRes.body.cars).toHaveLength(1);

    // 2. Get car details
    const carRes = await request(app)
      .get(`/api/car/${car._id}`)
      .expect(200);
    
    expect(carRes.body.car.brand).toBe('Toyota');

    // 3. Place order
    const orderData = {
      items: [{
        carId: car._id.toString(),
        name: 'Toyota Camry 2023',
        price: 28000,
        quantity: 1,
        image: 'image1.jpg'
      }],
      totalAmount: 28000,
      shippingAddress: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '+1234567890'
      },
      paymentMethod: 'Credit Card'
    };

    const orderRes = await request(app)
      .post('/api/order/placeorder')
      .set('Authorization', `Bearer ${userToken}`)
      .send(orderData)
      .expect(201);

    expect(orderRes.body.success).toBe(true);
    expect(orderRes.body.order.totalAmount).toBe(28000);
    expect(orderRes.body.order.status).toBe('pending');
  });
});
```

---

## E2E Testing

### Playwright Example

```javascript
// e2e/shopping.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Shopping Flow', () => {
  test('complete purchase flow', async ({ page }) => {
    // Navigate to site
    await page.goto('http://localhost:3000');

    // Browse cars
    await page.click('text=Shop');
    await expect(page).toHaveURL(/.*shop/);

    // View car details
    await page.click('.item:first-child');
    await expect(page.locator('h1')).toContainText('Toyota');

    // Add to cart
    await page.click('text=ADD TO CART');
    await expect(page.locator('.cart-count')).toHaveText('1');

    // Go to cart
    await page.click('[href="/cart"]');
    await expect(page).toHaveURL(/.*cart/);

    // Proceed to checkout
    await page.click('text=PROCEED TO CHECKOUT');

    // Fill shipping info
    await page.fill('[name="firstName"]', 'John');
    await page.fill('[name="lastName"]', 'Doe');
    await page.fill('[name="email"]', 'john@test.com');
    await page.fill('[name="street"]', '123 Main St');
    await page.fill('[name="city"]', 'New York');
    await page.fill('[name="state"]', 'NY');
    await page.fill('[name="zipCode"]', '10001');
    await page.fill('[name="country"]', 'USA');
    await page.fill('[name="phone"]', '+1234567890');

    // Place order
    await page.click('text=PLACE ORDER');

    // Verify confirmation
    await expect(page).toHaveURL(/.*order-confirmed/);
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});
```

---

## Manual Testing

### Test Checklist

**User Registration & Login:**
- [ ] Register with valid credentials
- [ ] Register with invalid email
- [ ] Register with weak password
- [ ] Login with correct credentials
- [ ] Login with wrong password
- [ ] Login with non-existent email
- [ ] Token persists after refresh

**Car Browsing:**
- [ ] View all cars
- [ ] Filter by category (new/used/offers)
- [ ] Search by brand
- [ ] Search by model
- [ ] Sort by price (low to high)
- [ ] Sort by price (high to low)
- [ ] View car details
- [ ] Navigate through images

**Shopping Cart:**
- [ ] Add car to cart
- [ ] Increase quantity
- [ ] Decrease quantity
- [ ] Remove item
- [ ] Cart persists in session
- [ ] Total calculates correctly
- [ ] Proceed to checkout

**Checkout:**
- [ ] All fields required
- [ ] Email validation
- [ ] Phone validation
- [ ] Order placement success
- [ ] Order confirmation displayed
- [ ] Redirect to confirmation page

**Admin Functions:**
- [ ] Add new car (with images)
- [ ] Edit existing car
- [ ] Remove car
- [ ] View all orders
- [ ] Access restricted to admin role

**Chatbot:**
- [ ] Chatbot opens/closes
- [ ] Send English message
- [ ] Send Arabic message
- [ ] Receive relevant responses
- [ ] View recommended cars
- [ ] Click car card opens detail page
- [ ] Suggested questions work

---

## Test Coverage

### Running Coverage Reports

**Frontend:**
```bash
cd frontend
npm test -- --coverage --watchAll=false
```

**Backend:**
```bash
cd backend
npm test -- --coverage
```

### Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

### Critical Paths (100% Coverage)

- Authentication logic
- Payment processing
- Order creation
- Admin authorization
- Data validation

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test -- --coverage --watchAll=false
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test -- --coverage
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## Best Practices

### Writing Good Tests

1. **Descriptive Names**: Test name should describe what it tests
2. **AAA Pattern**: Arrange, Act, Assert
3. **One Assertion**: Test one thing at a time
4. **Independent**: Tests shouldn't depend on each other
5. **Fast**: Keep tests quick to run
6. **Deterministic**: Same input = same output

### Test Organization

```javascript
describe('Feature/Component', () => {
  describe('Specific Function', () => {
    test('should do X when Y', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = function(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Mocking Best Practices

- Mock external dependencies
- Don't mock what you're testing
- Use realistic mock data
- Clear mocks between tests

---

**Last Updated:** December 20, 2025  
**Version:** 1.0
