# Test Execution Checklist

## Pre-Testing Setup

### ✅ Backend Setup
- [ ] Navigate to backend directory: `cd backend`
- [ ] Verify dependencies installed: `npm list jest supertest mongodb-memory-server`
- [ ] If not installed, run: `npm install`

### ✅ Frontend Setup
- [ ] Navigate to frontend directory: `cd frontend`
- [ ] Verify dependencies installed: `npm list @testing-library/react`
- [ ] If not installed, run: `npm install`

## Running Tests

### Backend Tests

#### 1. Run All Backend Tests
```bash
cd backend
npm test
```
**Expected**: All 170 tests should pass

#### 2. Run Backend Tests with Coverage
```bash
npm test -- --coverage
```
**Expected**: Coverage report showing 80%+ coverage

#### 3. Run Unit Tests Only
```bash
npm run test:unit
```
**Expected**: 98 unit tests should pass

#### 4. Run Integration Tests Only
```bash
npm run test:integration
```
**Expected**: 72 integration tests should pass

### Frontend Tests

#### 1. Run All Frontend Tests
```bash
cd frontend
npm test -- --watchAll=false
```
**Expected**: All 104+ tests should pass

#### 2. Run Frontend Tests with Coverage
```bash
npm test -- --coverage --watchAll=false
```
**Expected**: Coverage report showing 70%+ coverage

## Test Results Checklist

### Backend Test Suites
- [ ] User Model Tests (27 tests) - PASS
- [ ] Car Model Tests (43 tests) - PASS
- [ ] Order Model Tests (28 tests) - PASS
- [ ] User Routes Tests (24 tests) - PASS
- [ ] Car Routes Tests (50 tests) - PASS
- [ ] Order Routes Tests (18 tests) - PASS

### Frontend Test Suites
- [ ] Navbar Component Tests (10 tests) - PASS
- [ ] CartItems Component Tests (13 tests) - PASS
- [ ] SearchBar Component Tests (10 tests) - PASS
- [ ] ProductDisplay Component Tests (12 tests) - PASS
- [ ] Item Component Tests (10 tests) - PASS
- [ ] LoginSignup Page Tests (20 tests) - PASS
- [ ] Checkout Page Tests (19 tests) - PASS

## Coverage Verification

### Backend Coverage Targets
- [ ] Lines: ≥ 80%
- [ ] Functions: ≥ 80%
- [ ] Branches: ≥ 75%
- [ ] Statements: ≥ 80%

### Frontend Coverage Targets
- [ ] Components: ≥ 70%
- [ ] Pages: ≥ 75%
- [ ] Overall: ≥ 70%

## Troubleshooting

### If Tests Fail

#### Backend Issues
1. **MongoDB Connection Error**
   ```bash
   npm install mongodb-memory-server --save-dev
   ```

2. **Tests Hanging**
   ```bash
   npm test -- --forceExit
   ```

3. **Port Already in Use**
   - Check for running processes on port 4000
   - Kill the process or change PORT in .env

#### Frontend Issues
1. **Module Not Found**
   ```bash
   npm install
   ```

2. **React Testing Library Issues**
   ```bash
   npm install --save-dev @testing-library/react@latest @testing-library/jest-dom@latest
   ```

3. **Tests Won't Exit**
   ```bash
   npm test -- --watchAll=false
   ```

## Test Files Verification

### Backend Test Files Created
- [ ] `backend/tests/setup.js`
- [ ] `backend/tests/helpers/testHelpers.js`
- [ ] `backend/tests/unit/models/userModel.test.js`
- [ ] `backend/tests/unit/models/carModel.test.js`
- [ ] `backend/tests/unit/models/orderModel.test.js`
- [ ] `backend/tests/integration/api/userRoutes.test.js`
- [ ] `backend/tests/integration/api/carRoutes.test.js`
- [ ] `backend/tests/integration/api/orderRoutes.test.js`

### Frontend Test Files Created
- [ ] `frontend/src/Components/Navbar/Navbar.test.jsx`
- [ ] `frontend/src/Components/CartItems/CartItems.test.jsx`
- [ ] `frontend/src/Components/SearchBar/SearchBar.test.jsx`
- [ ] `frontend/src/Components/ProductDisplay/ProductDisplay.test.jsx`
- [ ] `frontend/src/Components/Item/Item.test.jsx`
- [ ] `frontend/src/Pages/LoginSignup.test.jsx`
- [ ] `frontend/src/Pages/Checkout.test.jsx`

### Documentation Files Created
- [ ] `docs/TEST_CASES.md` - Comprehensive test documentation
- [ ] `docs/TESTING_GUIDE.md` - Quick reference guide
- [ ] `docs/TEST_IMPLEMENTATION_SUMMARY.md` - Implementation summary
- [ ] `backend/tests/README.md` - Backend test documentation

## Final Verification

### Test Statistics
- [ ] Total tests: 270+
- [ ] Backend tests: 170
- [ ] Frontend tests: 104+
- [ ] All tests passing
- [ ] Coverage goals met

### Documentation Complete
- [ ] docs/TEST_CASES.md exists and is comprehensive
- [ ] docs/TESTING_GUIDE.md provides clear instructions
- [ ] README files explain test structure
- [ ] Code is well-commented

## Deployment Readiness

- [ ] All tests pass locally
- [ ] Coverage thresholds met
- [ ] No warnings or errors in test output
- [ ] Documentation is complete
- [ ] Tests can run in CI/CD pipeline

## Sign-off

**Tests Executed By**: _______________
**Date**: _______________
**Total Tests Run**: _______________
**Tests Passed**: _______________
**Tests Failed**: _______________
**Coverage**: _______________%

**Status**: ⬜ PASS ⬜ FAIL

**Notes**:
_______________________________________________
_______________________________________________
_______________________________________________

---

## Quick Command Reference

### Backend
```bash
# All tests
cd backend && npm test

# With coverage
npm test -- --coverage

# Specific file
npm test -- userModel.test.js
```

### Frontend
```bash
# All tests
cd frontend && npm test -- --watchAll=false

# With coverage
npm test -- --coverage --watchAll=false

# Specific file
npm test -- Navbar.test.jsx
```

### Both
```bash
# Run all tests (from root)
cd backend && npm test && cd ../frontend && npm test -- --watchAll=false
```
