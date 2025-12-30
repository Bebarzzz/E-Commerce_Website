# Car Dealership E-Commerce Platform (RevNRun)
## Technical Project Report

---

**Project Website:** www.revnrun.store  
**Repository:** E-Commerce_Website  
**Course:** CSCI313 – Software Engineering  
**Date:** December 2025

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Introduction](#2-introduction)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Implementation Details](#5-implementation-details)
6. [Database Design](#6-database-design)
7. [AI Chatbot Integration](#7-ai-chatbot-integration)
8. [Security](#8-security)
9. [Testing](#9-testing)
10. [Deployment](#10-deployment)
11. [Team & Process](#11-team--process)
12. [Conclusion](#12-conclusion)

---

## 1. Executive Summary

**RevNRun** is a full-stack e-commerce platform for buying and selling new and used vehicles. The application features inventory management, shopping cart, checkout, and an AI-powered bilingual chatbot assistant.

### Key Achievements
- Full-stack implementation with React.js and Node.js/Express.js
- Cloud deployment on AWS EC2 with S3 storage and MongoDB Atlas
- AI chatbot using Groq API (Llama 3.3 70B) with English/Arabic support
- 270+ test cases with 80%+ coverage
- Live production deployment at www.revnrun.store

---

## 2. Introduction

### 2.1 Problem Statement

Traditional car dealerships face challenges in the digital marketplace:
- Limited online inventory visibility
- Lack of automated customer service
- Poor web/mobile user experiences
- Language barriers for diverse customers

### 2.2 Solution

RevNRun addresses these through:
- Modern React.js responsive interface
- RESTful API backend architecture
- AI chatbot supporting English and Arabic
- Secure authentication and order management
- Cloud-based scalable infrastructure

### 2.3 Project Scope

**In Scope:**
- User authentication system
- Car inventory with search/filtering
- Shopping cart and checkout
- Admin panel for CRUD operations
- Bilingual AI chatbot
- Contact form

**Out of Scope (Future):**
- Payment gateway integration
- Vehicle comparison feature
- User reviews/ratings

---

## 3. System Architecture

### 3.1 Three-Tier Architecture

```
┌────────────────────────────────────────────────────┐
│              PRESENTATION TIER                      │
│         React.js Single Page Application            │
└────────────────────────┬───────────────────────────┘
                         │ HTTP/HTTPS + JWT
                         ▼
┌────────────────────────────────────────────────────┐
│              APPLICATION TIER                       │
│           Express.js REST API Server                │
└────────────────────────┬───────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ MongoDB Atlas│ │   AWS S3     │ │  Groq API    │
│  (Database)  │ │  (Images)    │ │ (AI Chatbot) │
└──────────────┘ └──────────────┘ └──────────────┘
```

### 3.2 Production Deployment

```
Internet → DNS → AWS EC2 → Nginx (80/443) → PM2 → Node.js (4000)
                                                      ↓
                                    MongoDB Atlas / AWS S3 / Groq API
```

---

## 4. Technology Stack

### 4.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI component library |
| React Router DOM | 7.9.6 | Client-side routing |
| Context API | Built-in | State management |
| Jest + RTL | 16.3.0 | Testing |

### 4.2 Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x+ | Runtime environment |
| Express.js | 5.1.0 | Web framework |
| Mongoose | 8.19.2 | MongoDB ODM |
| JWT | 9.0.2 | Authentication |
| bcrypt | 6.0.0 | Password hashing |
| AWS SDK | 3.948.0 | S3 image storage |
| Groq SDK | 0.37.0 | AI chatbot |

### 4.3 Infrastructure

| Technology | Purpose |
|------------|---------|
| AWS EC2 | Server hosting |
| AWS S3 | Image storage |
| MongoDB Atlas | Cloud database |
| Nginx | Reverse proxy |
| PM2 | Process management |
| Let's Encrypt | SSL certificates |

---

## 5. Implementation Details

### 5.1 Frontend Structure

```
frontend/src/
├── App.js                 # Root component with routing
├── Components/
│   ├── Chatbot.jsx        # AI chatbot widget
│   ├── Admin/             # Admin panel (Dashboard, Cars, Orders)
│   ├── Navbar/            # Navigation
│   ├── ProductDisplay/    # Product details
│   ├── CartItems/         # Shopping cart
│   └── SearchBar/         # Search functionality
├── Pages/
│   ├── Shop.jsx           # Main shop
│   ├── Cart.jsx           # Cart page
│   ├── Checkout.jsx       # Checkout
│   └── LoginSignup.jsx    # Authentication
├── Context/
│   └── ShopContext.jsx    # Global state
└── services/
    ├── carService.js      # Car API calls
    ├── userService.js     # User API calls
    └── orderService.js    # Order API calls
```

### 5.2 Backend Structure

```
backend/
├── server.js              # Entry point
├── controllers/
│   ├── carController.js   # Car CRUD logic
│   ├── userController.js  # Authentication
│   ├── orderController.js # Order processing
│   └── chatbotController.js # AI chatbot
├── Models/
│   ├── carModel.js        # Car schema
│   ├── userModel.js       # User schema
│   └── orderModel.js      # Order schema
├── middleware/
│   └── requireAuth.js     # JWT middleware
└── routes/
    ├── car.js, user.js, order.js, chatbot.js
```

### 5.3 API Endpoints Summary

| Resource | Endpoints | Auth Required |
|----------|-----------|---------------|
| **Users** | POST /signup, /login; GET /profile | Login: No, Profile: Yes |
| **Cars** | GET /allcars, /search, /:id; POST /addcar; PUT /:id; DELETE /:id | Read: No, Write: Admin |
| **Orders** | GET /, /:id; POST /; PATCH /:id | Yes (Admin for all) |
| **Chatbot** | POST /chat; GET /cars; POST /clear | No |

### 5.4 State Management

The application uses React Context API for global state:

```javascript
// ShopContext provides:
{
  all_product: [],           // Product list
  cartItems: {},             // Cart state
  addToCart, removeFromCart, clearCart,
  getTotalCartItems, getTotalCartAmount,
  loading, error, refreshProducts
}
```

---

## 6. Database Design

### 6.1 Collections

**Users Collection:**
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique, validated),
  password: String (bcrypt hashed),
  role: 'customer' | 'admin',
  createdAt, updatedAt
}
```

**Cars Collection:**
```javascript
{
  _id: ObjectId,
  brand: String,
  model: String,
  manufactureYear: Number (1900-current),
  type: String (Sedan, SUV, etc.),
  price: Number (positive),
  engineCapacity: Number,
  wheelDriveType: String,
  engineType: String,
  transmissionType: String,
  condition: 'new' | 'used',
  description: String,
  images: [String] (S3 URLs),
  createdAt, updatedAt
}
```

**Orders Collection:**
```javascript
{
  _id: ObjectId,
  userID: ObjectId (ref: User),
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
  items: [{
    carId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  shippingAddress: {
    firstName, lastName, email, street,
    city, state, zipCode, country, phone
  },
  createdAt, updatedAt
}
```

### 6.2 Entity Relationships

```
USERS (1) ←──────── (N) ORDERS (N) ────────→ (N) CARS
  │                       │                      │
  └── _id (PK)           └── items[].carId ──────┘
```

---

## 7. AI Chatbot Integration

### 7.1 Overview

The chatbot is an AI-powered sales assistant using **Groq API** with the **Llama 3.3 70B** model, supporting both English and Arabic.

### 7.2 Key Features

- **Bilingual Support:** Full English/Arabic conversation
- **Real-Time Inventory:** Queries MongoDB for current listings
- **Session Management:** Tracks conversation history (10-message window)
- **Smart Recommendations:** Budget and preference-based suggestions

### 7.3 Implementation

```javascript
const chatWithBot = async (req, res) => {
  const { message, language, sessionId } = req.body;
  
  // Fetch inventory and format context
  const cars = await getAvailableCarsData();
  const carsContext = formatCarsContext(cars);
  
  // Build conversation with system prompt
  const messages = [
    { role: 'system', content: getSystemPrompt(carsContext, language) },
    ...conversationHistory.get(sessionId)
  ];
  
  // Call Groq API
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    temperature: 0.7,
    max_tokens: 1024
  });
  
  return res.json({ response: completion.choices[0].message.content });
};
```

### 7.4 Frontend Widget

- Floating toggle button
- Message history display
- Language switch (EN/AR)
- Suggested questions
- Loading indicators

---

## 8. Security

### 8.1 Authentication

**JWT Implementation:**
- 3-day token expiration
- HS256 algorithm
- Secret key in environment variables

```javascript
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
};
```

### 8.2 Password Security

- **Bcrypt** with 10 salt rounds
- Strong password requirements: 8+ chars, mixed case, numbers, symbols

### 8.3 Authorization Middleware

```javascript
const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: 'Token required' });
  
  const token = authorization.split(' ')[1];
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findOne({ _id }).select('_id role');
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

### 8.4 Additional Security

- **CORS:** Whitelist-based origin validation
- **Input Validation:** validator.js for email/password
- **MongoDB Sanitization:** Mongoose schema validation

---

## 9. Testing

### 9.1 Test Coverage Summary

| Category | Tests | Target |
|----------|-------|--------|
| User Management | 51 | 80%+ |
| Car Catalog | 93 | 80%+ |
| Order Processing | 46 | 80%+ |
| UI Components | 55 | 70%+ |
| Page Integration | 39 | 70%+ |
| **Total** | **270+** | |

### 9.2 Testing Stack

**Backend:** Jest, Supertest, MongoDB Memory Server  
**Frontend:** Jest, React Testing Library

### 9.3 Test Types

- **Unit Tests (98):** Model validation, business logic
- **Integration Tests (72):** API endpoint testing
- **Component Tests (55):** UI component behavior
- **Page Tests (39):** Full page interactions

### 9.4 Running Tests

```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm test -- --coverage
```

---

## 10. Deployment

### 10.1 AWS Infrastructure

| Service | Configuration |
|---------|---------------|
| EC2 | Ubuntu 22.04 LTS, t2.micro+ |
| S3 | Vehicle image storage |
| Security Groups | SSH (22), HTTP (80), HTTPS (443) |

### 10.2 Nginx Configuration

```nginx
server {
    listen 443 ssl;
    server_name revnrun.store;
    
    ssl_certificate /etc/letsencrypt/live/revnrun.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/revnrun.store/privkey.pem;
    
    location / {
        root /var/www/html;
        try_files $uri /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:4000;
    }
}
```

### 10.3 PM2 Process Management

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'revnrun-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true
  }]
};
```

---

## 11. Team & Process

### 11.1 Team Structure

| Member | Role |
|--------|------|
| Ahmed Shalaby | Backend Developer & Scrum Master |
| Mostafa Bebars | Backend Developer & DevOps |
| Ziad Abdelwahab | Frontend Developer & UI/UX |
| Ahmed Taher | AI Chatbot Developer |

### 11.2 Development Process

**Methodology:** Scrum with 2-week sprints

**Sprint Progression:**
1. **Sprint 1:** Project initiation, tech stack selection
2. **Sprint 2:** Task distribution, environment setup
3. **Sprint 3:** Core development, integration

### 11.3 Git Workflow

- Main branch for production
- Feature branches for development
- Pull requests with code review

---

## 12. Conclusion

### 12.1 Achievements

✅ Complete MERN-style full-stack implementation  
✅ RESTful API with JWT authentication  
✅ AI-powered bilingual chatbot  
✅ AWS cloud deployment  
✅ 270+ comprehensive tests  
✅ Professional documentation  

### 12.2 Future Enhancements

- Payment gateway integration (Stripe/PayPal)
- Vehicle comparison tool
- User reviews and ratings
- Analytics dashboard
- Email/SMS notifications
- Redis caching layer

### 12.3 Learning Outcomes

- Full-stack JavaScript development
- Cloud infrastructure management
- AI/ML API integration
- Agile/Scrum methodology
- Testing best practices

---

## References

1. React.js Documentation: https://react.dev/
2. Express.js Documentation: https://expressjs.com/
3. MongoDB Manual: https://www.mongodb.com/docs/
4. Mongoose Documentation: https://mongoosejs.com/docs/
5. JWT.io: https://jwt.io/
6. AWS Documentation: https://docs.aws.amazon.com/
7. Groq API: https://console.groq.com/docs
8. PM2 Documentation: https://pm2.keymetrics.io/docs/

---

**Document Version:** 1.0  
**Last Updated:** December 2025  
**Repository:** https://github.com/Bebarzzz/E-Commerce_Website
