# Testing Frequently Asked Questions

## Database Testing

### Q: Do tests create real data in MongoDB?

**No! Tests use MongoDB Memory Server**, which creates an **in-memory database** that is completely isolated from your production/development database.

#### How It Works:

```javascript
// backend/tests/setup.js
beforeAll(async () => {
  // Creates TEMPORARY in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connects to memory DB (NOT your real database)
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Destroys the in-memory database completely
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});
```

#### Benefits:

✅ **No real data affected** - Tests never touch your actual MongoDB  
✅ **Fast execution** - In-memory is much faster than disk  
✅ **Isolated** - Each test run starts with clean slate  
✅ **No setup needed** - No MongoDB installation required for testing  
✅ **Parallel safe** - Each test suite gets its own database  

#### What Gets Created:

- **During test**: Temporary data in RAM only
- **After test**: Everything is deleted automatically
- **Your real DB**: Completely untouched

---

## CI/CD Pipeline

### Q: Why run tests multiple times?

**Optimized Hybrid Approach:**

#### test.yml (Comprehensive Quality Gate)
- **Runs on**: Every push to any branch + Pull Requests
- **Purpose**: Comprehensive validation before code review/merge
- **Tests**: All 270+ tests with coverage reports
- **Time**: ~2-5 minutes
- **Why**: Catch bugs early in development

#### backend-deploy.yml (Smoke Test)
- **Runs on**: Push to main (deployment)
- **Purpose**: Quick sanity check before deployment
- **Tests**: Only critical model tests (~20 tests)
- **Time**: ~30 seconds
- **Why**: Fast deployment safety net

#### frontend-deploy.yml (Smoke Test)
- **Runs on**: Push to main (deployment)
- **Purpose**: Quick sanity check before deployment
- **Tests**: Only Navbar component (~10 tests)
- **Time**: ~20 seconds
- **Why**: Fast deployment safety net

### Workflow Example:

```
Developer pushes to feature/new-search branch
├─ test.yml runs ALL 270+ tests ✅
└─ If passes, developer creates PR

PR review → Merge to main
├─ test.yml runs again (PR validation) ✅
├─ backend-deploy.yml runs smoke tests (~30s) ✅
│  └─ Deploys to EC2
└─ frontend-deploy.yml runs smoke tests (~20s) ✅
   └─ Deploys to S3/CloudFront
```

### Q: Can I skip tests during deployment?

**Not recommended**, but you can use `[skip ci]` in commit messages:

```bash
git commit -m "Update README [skip ci]"
```

This skips ALL workflows (use sparingly, only for docs/non-code changes).

---

## Test Execution

### Q: How often should I run tests locally?

**Recommended frequency:**

- **Before every commit**: `npm test` (quick sanity check)
- **Before pushing**: `npm run test:unit && npm run test:integration`
- **Before creating PR**: `npm test -- --coverage` (full suite + coverage)

### Q: Tests are slow, what can I do?

**Speed up local testing:**

```bash
# Run specific test file
npm test userModel.test.js

# Run tests matching pattern
npm test -- --testPathPattern="user"

# Run only changed files
npm test -- --onlyChanged

# Run with parallel workers
npm test -- --maxWorkers=4

# Watch mode for development
npm run test:watch
```

### Q: Can I run tests without MongoDB Memory Server?

**No**, it's required for integration tests. But it's lightweight:
- Downloads once: ~50MB
- Runs in RAM: No disk space used
- Auto-manages: No manual setup needed

---

## Coverage Reports

### Q: What do coverage percentages mean?

- **Statements**: % of code lines executed
- **Branches**: % of if/else paths tested
- **Functions**: % of functions called
- **Lines**: Similar to statements

**Current thresholds:**
- Global: 70% minimum
- High-value modules: 80% minimum

### Q: Where can I see coverage reports?

**Locally:**
```bash
cd backend
npm test -- --coverage
# Opens: backend/coverage/lcov-report/index.html
```

**In CI/CD:**
- Codecov dashboard (after setup)
- GitHub PR comments (automatic)
- GitHub Actions artifacts

---

## Troubleshooting

### Q: Tests fail with "MongoServerSelectionError"

**Solution**: MongoDB Memory Server needs to download binary on first run:

```bash
cd backend
npm test
# First run might take 1-2 minutes to download
```

### Q: Tests pass locally but fail in CI/CD

**Common causes:**
1. **Environment variables missing** - Check workflow env section
2. **Different Node version** - Workflows use Node 20
3. **Timing issues** - Add `jest.setTimeout(10000)` for slow tests
4. **Dependencies not installed** - Check `npm ci` runs successfully

### Q: How do I debug a failing test?

**Add debug output:**

```javascript
test('should create user', async () => {
  const user = await User.create({ name: 'Test' });
  console.log('Created user:', user); // Debug output
  expect(user.name).toBe('Test');
});
```

Run in verbose mode:
```bash
npm test -- --verbose userModel.test.js
```

---

## Best Practices

### ✅ Do:
- Run tests before every commit
- Write tests for new features
- Keep test data isolated (use factories/fixtures)
- Use descriptive test names
- Clean up after tests (Memory Server does this automatically)

### ❌ Don't:
- Skip tests to "save time" (you'll lose more time debugging)
- Test against real database
- Commit code that breaks tests
- Ignore failing tests
- Write tests that depend on other tests

---

## Quick Commands Reference

```bash
# Backend Tests
cd backend
npm test                      # Run all tests
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests only
npm run test:watch            # Watch mode
npm test -- --coverage        # With coverage

# Frontend Tests
cd frontend
npm test                      # Interactive watch mode
npm test -- --watchAll=false  # Run once
npm test -- --coverage        # With coverage

# CI/CD Simulation
# (Run from project root)
cd backend && npm ci && npm test
cd ../frontend && npm install && npm test -- --watchAll=false
```

---

## Related Documentation

- [TESTING.md](TESTING.md) - Complete testing guide
- [TEST_CASES.md](TEST_CASES.md) - Detailed test case tables
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Quick setup guide
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - General troubleshooting

---

**Last Updated**: December 20, 2025
