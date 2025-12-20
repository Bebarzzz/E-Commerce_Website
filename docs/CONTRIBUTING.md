# Developer Contribution Guide

Welcome to the E-Commerce Car Dealership project! This guide will help you set up your development environment and contribute effectively to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Common Development Tasks](#common-development-tasks)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: v6.0 or higher (local or Atlas)
- **Git**: v2.30 or higher
- **Code Editor**: VS Code (recommended) or your preferred editor
- **AWS Account**: For S3 testing (optional for local development)

### Recommended Tools

- **MongoDB Compass**: Database GUI
- **Postman**: API testing
- **React Developer Tools**: Browser extension
- **ESLint Extension**: For VS Code
- **Prettier Extension**: Code formatting

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/E-Commerce_Website.git
cd E-Commerce_Website
```

### 2. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 3. Environment Configuration

**Backend `.env`:**
```env
# Create backend/.env
MONGO_URI=mongodb://localhost:27017/car-dealership
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=4000
NODE_ENV=development

# CORS (use frontend URL)
ALLOWED_ORIGINS=http://localhost:3000

# AWS S3 (optional for local dev - will fallback to local storage)
S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1

# Claude AI (for chatbot)
CLAUDE_API_KEY=your_claude_api_key
```

**Frontend `.env`:**
```env
# Create frontend/.env
REACT_APP_API_URL=http://localhost:4000/api
```

### 4. Database Setup

**Local MongoDB:**
```bash
# Start MongoDB
mongod --dbpath /path/to/your/db

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in backend/.env with Atlas connection string
```

**Seed Data (Optional):**
```javascript
// Create backend/seed.js for test data
const mongoose = require('mongoose');
const Car = require('./Models/carModel');

const seedCars = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  
  const cars = [
    {
      brand: "Toyota",
      year: 2023,
      model: "Camry",
      type: "Sedan",
      price: 28000,
      mileage: 15000,
      engine: "2.5L 4-Cylinder",
      transmission: "Automatic",
      color: "Silver",
      condition: "used",
      images: []
    },
    // Add more test cars...
  ];
  
  await Car.insertMany(cars);
  console.log('Seed data inserted');
  process.exit();
};

seedCars();
```

### 5. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

**Frontend:**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

### 6. Verify Setup

- Visit `http://localhost:3000` - should see homepage
- Check `http://localhost:4000/api/health` - should return `{"status":"OK"}`
- Try logging in/signing up
- Browse cars
- Test chatbot (requires CLAUDE_API_KEY)

---

## Project Structure

### Backend Architecture

```
backend/
├── config/              # Configuration files
│   └── multerS3.js      # S3 upload configuration
├── controllers/         # Business logic
│   ├── carController.js
│   ├── chatbotController.js
│   ├── orderController.js
│   └── userController.js
├── middleware/          # Express middleware
│   └── requireAuth.js   # JWT authentication
├── Models/              # Mongoose schemas
│   ├── carModel.js
│   ├── orderModel.js
│   └── userModel.js
├── routes/              # API routes
│   ├── car.js
│   ├── order.js
│   └── user.js
├── upload/              # Local file storage (dev)
├── server.js            # Entry point
├── .env                 # Environment variables
└── package.json
```

### Frontend Architecture

```
frontend/
├── public/              # Static files
├── src/
│   ├── Components/      # Reusable components
│   │   ├── Navbar/
│   │   ├── CartItems/
│   │   ├── Chatbot.jsx
│   │   └── ...
│   ├── Pages/           # Page components
│   │   ├── Shop.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   └── ...
│   ├── Context/         # React Context
│   │   ├── ShopContext.jsx
│   │   └── NotificationContext.js
│   ├── services/        # API service layer
│   │   ├── carService.js
│   │   ├── userService.js
│   │   └── orderService.js
│   ├── config/          # Configuration
│   │   └── api.js       # API base URL
│   ├── utils/           # Helper functions
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.js           # Main component
│   └── index.js         # Entry point
└── package.json
```

---

## Coding Standards

### JavaScript/React Style Guide

**General Principles:**
- Write clean, readable, self-documenting code
- Follow DRY (Don't Repeat Yourself)
- Use meaningful variable and function names
- Keep functions small and focused
- Comment complex logic

**Naming Conventions:**

```javascript
// Variables and functions: camelCase
const userName = "John";
function getUserData() { }

// Components: PascalCase
function ProductCard() { }
class OrderManager { }

// Constants: UPPER_SNAKE_CASE
const MAX_UPLOAD_SIZE = 5000000;
const API_BASE_URL = process.env.REACT_APP_API_URL;

// Private functions: prefix with _
function _helperFunction() { }
```

**File Naming:**
- Components: `PascalCase.jsx` (e.g., `ProductCard.jsx`)
- Services: `camelCase.js` (e.g., `userService.js`)
- Utils: `camelCase.js` (e.g., `helpers.js`)
- Styles: `ComponentName.css` (e.g., `Navbar.css`)

### Code Formatting

**Use Prettier for consistent formatting:**

```json
// .prettierrc (create in project root)
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

**ESLint Configuration:**

```json
// .eslintrc.json (create in project root)
{
  "extends": ["react-app"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn",
    "prefer-const": "error"
  }
}
```

### React Best Practices

**Component Structure:**

```javascript
import React, { useState, useEffect } from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2 }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 4. Render helpers
  const renderSection = () => {
    return <div>...</div>;
  };
  
  // 5. Return JSX
  return (
    <div className="component-name">
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

**Service Layer Pattern:**

```javascript
// services/exampleService.js
import { getAuthHeaders } from '../utils/helpers';
import API_BASE_URL from '../config/api';

export const exampleService = {
  // GET request
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/resource`);
    if (!response.ok) throw new Error('Failed to fetch');
    return response.json();
  },
  
  // POST with auth
  async create(data) {
    const response = await fetch(`${API_BASE_URL}/resource`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create');
    return response.json();
  },
};
```

### Backend Best Practices

**Controller Pattern:**

```javascript
// controllers/exampleController.js

// GET all
const getAll = async (req, res) => {
  try {
    const items = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST create
const create = async (req, res) => {
  try {
    const { field1, field2 } = req.body;
    
    // Validation
    if (!field1 || !field2) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    const item = await Model.create({ field1, field2 });
    res.status(201).json({ success: true, item });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAll, create };
```

**Error Handling:**

```javascript
// Async error wrapper
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Usage
const getResource = asyncHandler(async (req, res) => {
  const data = await Model.findById(req.params.id);
  if (!data) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json({ success: true, data });
});
```

---

## Git Workflow

### Branch Naming

```
feature/description       # New features
bugfix/description        # Bug fixes
hotfix/description        # Urgent production fixes
refactor/description      # Code refactoring
docs/description          # Documentation updates
test/description          # Adding tests
```

**Examples:**
- `feature/add-wishlist`
- `bugfix/fix-cart-total-calculation`
- `docs/update-api-reference`

### Commit Messages

Follow the **Conventional Commits** specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(cart): add quantity selector to cart items

Add increment/decrement buttons for adjusting item quantities
in the shopping cart. Updates cart total dynamically.

Closes #123
```

```bash
fix(auth): resolve token expiration issue

Fixed bug where tokens were not being properly validated
after 3-day expiration period.

Fixes #456
```

```bash
docs(api): update API reference with new endpoints

Added documentation for chatbot endpoints and updated
authentication flow diagrams.
```

### Git Commands

```bash
# Create a new branch
git checkout -b feature/your-feature-name

# Stage changes
git add .

# Commit with message
git commit -m "feat(scope): description"

# Push to your fork
git push origin feature/your-feature-name

# Update from main branch
git checkout main
git pull upstream main
git checkout feature/your-feature-name
git rebase main

# Interactive rebase (clean up commits)
git rebase -i HEAD~3
```

---

## Making Changes

### Step-by-Step Workflow

1. **Create an Issue** (if one doesn't exist)
   - Describe the feature/bug
   - Add relevant labels
   - Discuss approach if complex

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Your Changes**
   - Follow coding standards
   - Write clean, documented code
   - Test locally

4. **Test Thoroughly**
   - Run existing tests
   - Add new tests if applicable
   - Test in browser

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push to Fork**
   ```bash
   git push origin feature/your-feature
   ```

7. **Create Pull Request**
   - Use PR template
   - Link related issues
   - Request reviews

### Adding a New Feature

**Example: Adding a Wishlist Feature**

1. **Backend Changes:**

```javascript
// Models/wishlistModel.js
const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
```

```javascript
// controllers/wishlistController.js
const Wishlist = require('../Models/wishlistModel');

const addToWishlist = async (req, res) => {
  try {
    const { carId } = req.body;
    const userId = req.user._id;
    
    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId, cars: [carId] });
    } else {
      if (!wishlist.cars.includes(carId)) {
        wishlist.cars.push(carId);
        await wishlist.save();
      }
    }
    
    res.status(200).json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToWishlist };
```

```javascript
// routes/wishlist.js
const express = require('express');
const { addToWishlist, removeFromWishlist, getWishlist } = require('../controllers/wishlistController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth); // All routes require auth

router.post('/add', addToWishlist);
router.delete('/remove/:carId', removeFromWishlist);
router.get('/', getWishlist);

module.exports = router;
```

```javascript
// server.js - Add route
const wishlistRoute = require('./routes/wishlist');
app.use('/api/wishlist', wishlistRoute);
```

2. **Frontend Changes:**

```javascript
// services/wishlistService.js
import { getAuthHeaders } from '../utils/helpers';
import API_BASE_URL from '../config/api';

export const wishlistService = {
  async add(carId) {
    const response = await fetch(`${API_BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ carId }),
    });
    if (!response.ok) throw new Error('Failed to add to wishlist');
    return response.json();
  },
  
  async getAll() {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
  },
};
```

```javascript
// Components/WishlistButton.jsx
import React from 'react';
import { wishlistService } from '../services/wishlistService';
import { useNotification } from '../Context/NotificationContext';

const WishlistButton = ({ carId }) => {
  const { showNotification } = useNotification();
  
  const handleAddToWishlist = async () => {
    try {
      await wishlistService.add(carId);
      showNotification('Added to wishlist!', 'success');
    } catch (error) {
      showNotification('Failed to add to wishlist', 'error');
    }
  };
  
  return (
    <button onClick={handleAddToWishlist} className="wishlist-btn">
      ♥ Add to Wishlist
    </button>
  );
};

export default WishlistButton;
```

3. **Update Documentation**
   - Add endpoints to API_REFERENCE.md
   - Update user guide
   - Add developer notes

4. **Test**
   - Test all CRUD operations
   - Test authentication
   - Test edge cases
   - Verify UI updates

---

## Testing

### Current Testing Setup

**Frontend:**
- Jest + React Testing Library
- Run: `npm test` in frontend directory

**Backend:**
- No tests currently implemented
- Recommended: Jest + Supertest

### Writing Tests

**Frontend Component Test:**

```javascript
// Components/__tests__/ProductCard.test.js
import { render, screen } from '@testing-library/react';
import ProductCard from '../ProductCard';

describe('ProductCard', () => {
  const mockCar = {
    _id: '1',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 28000,
    images: ['image1.jpg'],
  };
  
  test('renders car information correctly', () => {
    render(<ProductCard car={mockCar} />);
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('$28,000')).toBeInTheDocument();
    expect(screen.getByText('2023')).toBeInTheDocument();
  });
  
  test('displays first image', () => {
    render(<ProductCard car={mockCar} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('image1.jpg'));
  });
});
```

**Backend API Test (recommended):**

```javascript
// __tests__/car.test.js
const request = require('supertest');
const app = require('../server');
const Car = require('../Models/carModel');

describe('Car API', () => {
  describe('GET /api/car/allcars', () => {
    test('should return all cars', async () => {
      const response = await request(app)
        .get('/api/car/allcars')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.cars)).toBe(true);
    });
  });
  
  describe('POST /api/car/addcar', () => {
    test('should require authentication', async () => {
      await request(app)
        .post('/api/car/addcar')
        .expect(401);
    });
  });
});
```

### Running Tests

```bash
# Frontend
cd frontend
npm test              # Run all tests
npm test -- --coverage # With coverage report

# Backend (when implemented)
cd backend
npm test
```

---

## Pull Request Process

### Before Submitting

- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] New tests added (if applicable)
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] Code is properly commented
- [ ] Commits are clean and descriptive
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #123

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
```

### Review Process

1. **Automated Checks** (future implementation)
   - Linting passes
   - Tests pass
   - Build succeeds

2. **Code Review**
   - At least 1 approval required
   - Address all comments
   - Request re-review after changes

3. **Merge**
   - Squash and merge (preferred)
   - Delete branch after merge

---

## Code Review Guidelines

### As a Reviewer

**Look For:**
- Code correctness and logic
- Edge cases handled
- Error handling
- Security vulnerabilities
- Performance issues
- Code readability
- Test coverage
- Documentation

**Provide:**
- Constructive feedback
- Specific suggestions
- Praise for good work
- Links to resources when relevant

**Review Checklist:**
- [ ] Code is understandable
- [ ] No obvious bugs
- [ ] Follows project conventions
- [ ] Tests are adequate
- [ ] Documentation is clear
- [ ] No security issues
- [ ] Performance is acceptable

### As a Contributor

**Responding to Feedback:**
- Be open to suggestions
- Ask questions if unclear
- Make requested changes
- Thank reviewers for their time
- Mark conversations as resolved

---

## Common Development Tasks

### Debugging

**Backend:**
```javascript
// Use VS Code debugger or console.log
console.log('Debug:', variable);

// Or use debug package
const debug = require('debug')('app:controller');
debug('Processing request', req.body);
```

**Frontend:**
```javascript
// React DevTools
console.log('Component rendered', props);

// Debug in browser
debugger; // Creates breakpoint
```

### Database Operations

**MongoDB Compass:**
- Connect to: `mongodb://localhost:27017`
- Browse collections
- Run queries
- View/edit documents

**Common Queries:**
```javascript
// Find users
db.users.find({ role: 'admin' });

// Update car price
db.cars.updateOne(
  { _id: ObjectId('...') },
  { $set: { price: 30000 } }
);

// Delete order
db.orders.deleteOne({ _id: ObjectId('...') });
```

### Adding Dependencies

```bash
# Backend
cd backend
npm install package-name
npm install --save-dev package-name # Dev dependency

# Frontend
cd frontend
npm install package-name
```

**Document why new dependencies are added!**

---

## Resources

### Learning Resources

- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Project-Specific Docs

- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [API_REFERENCE.md](./API_REFERENCE.md) - API documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

## Getting Help

- **Questions?** Open a GitHub Discussion
- **Bug Report?** Create an Issue
- **Chat:** [Project Discord/Slack] (if available)
- **Email:** dev-team@example.com

---

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person
- Report inappropriate behavior

---

**Thank you for contributing!** 🚀

---

**Last Updated:** December 20, 2025  
**Version:** 1.0
