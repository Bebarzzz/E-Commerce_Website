# Database Schema Documentation

Complete database schema and data model documentation for the E-Commerce Car Dealership platform.

## Table of Contents

- [Overview](#overview)
- [Database Technology](#database-technology)
- [Schema Diagrams](#schema-diagrams)
- [Collections](#collections)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Data Validation](#data-validation)
- [Sample Data](#sample-data)
- [Migration Guide](#migration-guide)
- [Best Practices](#best-practices)

---

## Overview

### Database Structure

The application uses **MongoDB** as its primary database, with **Mongoose** as the ODM (Object Document Mapper).

**Collections:**
- `users` - User accounts and authentication
- `cars` - Vehicle inventory
- `orders` - Purchase orders

**Key Features:**
- Schema validation with Mongoose
- Automatic timestamps (createdAt, updatedAt)
- Static methods for common operations
- Built-in data validation
- Password hashing with bcrypt
- JWT token generation

---

## Database Technology

### MongoDB

**Version:** 6.0+  
**Hosting:** MongoDB Atlas (Cloud)  
**ODM:** Mongoose v8.19.2

**Why MongoDB?**
- Flexible schema for varying car specifications
- Horizontal scalability
- JSON-like documents (natural fit for JavaScript)
- Rich query capabilities
- Atlas provides managed hosting

---

## Schema Diagrams

### Entity Relationship Diagram

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ _id (PK)        │
│ username        │
│ email (unique)  │
│ password (hash) │
│ role            │
│ createdAt       │
│ updatedAt       │
└────────┬────────┘
         │
         │ userId (optional FK)
         ├─────────────────────┐
         │                     │
┌────────▼────────┐   ┌────────▼────────┐
│     ORDERS      │   │      CARS       │
├─────────────────┤   ├─────────────────┤
│ _id (PK)        │   │ _id (PK)        │
│ userId (FK)     │   │ brand           │
│ status          │   │ year            │
│ items[]         │   │ model           │
│ totalAmount     │   │ type            │
│ shippingAddress │   │ price           │
│ paymentMethod   │   │ mileage         │
│ createdAt       │   │ engine          │
│ updatedAt       │   │ transmission    │
└─────────────────┘   │ color           │
                      │ condition       │
         carId        │ images[]        │
         (referenced) │ createdAt       │
              ◄───────┤ updatedAt       │
                      └─────────────────┘
```

### Document Structure

```
Database: car-dealership
│
├── users (collection)
│   └── user documents
│
├── cars (collection)
│   └── car documents
│
└── orders (collection)
    └── order documents
```

---

## Collections

### Users Collection

**Collection Name:** `users`

**Purpose:** Store user accounts for authentication and authorization

**Schema:**

```javascript
{
  _id: ObjectId,                    // Auto-generated
  username: String,                 // Unique, required
  email: String,                    // Unique, required, validated
  password: String,                 // Bcrypt hashed, required
  role: String,                     // Enum: ['customer', 'admin']
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

**Field Details:**

| Field | Type | Required | Unique | Default | Validation |
|-------|------|----------|--------|---------|------------|
| `_id` | ObjectId | Auto | Yes | Auto | - |
| `username` | String | Yes | Yes | - | - |
| `email` | String | Yes | Yes | - | Valid email format |
| `password` | String | Yes | No | - | Min 8 chars, strong |
| `role` | String | No | No | 'customer' | 'customer' or 'admin' |
| `createdAt` | Date | Auto | No | Auto | - |
| `updatedAt` | Date | Auto | No | Auto | - |

**Indexes:**
- `email` (unique)
- `username` (unique)

**Static Methods:**
- `signup(username, email, password)` - Create new user with validation
- `login(email, password)` - Authenticate user

**Example Document:**

```json
{
  "_id": ObjectId("674f1f77bcf86cd799439011"),
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2b$10$YourHashedPasswordHere",
  "role": "customer",
  "createdAt": ISODate("2024-12-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-12-15T10:30:00.000Z")
}
```

---

### Cars Collection

**Collection Name:** `cars`

**Purpose:** Store vehicle inventory information

**Schema:**

```javascript
{
  _id: ObjectId,                    // Auto-generated
  brand: String,                    // Required (e.g., "Toyota")
  year: Number,                     // Required (1900-current)
  model: String,                    // Required (e.g., "Camry")
  type: String,                     // Required (e.g., "Sedan")
  price: Number,                    // Required, positive
  mileage: Number,                  // Required, positive
  engine: String,                   // Required (e.g., "2.5L 4-Cylinder")
  transmission: String,             // Required (e.g., "Automatic")
  color: String,                    // Required (e.g., "Silver")
  condition: String,                // Enum: ['new', 'used']
  images: [String],                 // Array of S3 URLs
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

**Field Details:**

| Field | Type | Required | Validation | Example |
|-------|------|----------|------------|---------|
| `_id` | ObjectId | Auto | - | ObjectId("...") |
| `brand` | String | Yes | - | "Toyota" |
| `year` | Number | Yes | 1900 to current year | 2023 |
| `model` | String | Yes | - | "Camry" |
| `type` | String | Yes | - | "Sedan" |
| `price` | Number | Yes | > 0 | 28000 |
| `mileage` | Number | Yes | > 0 | 15000 |
| `engine` | String | Yes | - | "2.5L 4-Cylinder" |
| `transmission` | String | Yes | - | "Automatic" |
| `color` | String | Yes | - | "Silver" |
| `condition` | String | Yes | 'new' or 'used' | "used" |
| `images` | Array[String] | No | Max 5 URLs | ["url1", "url2"] |
| `createdAt` | Date | Auto | - | ISODate(...) |
| `updatedAt` | Date | Auto | - | ISODate(...) |

**Indexes:**
- `brand` (for search performance)
- `price` (for filtering)
- `condition` (for category filtering)
- Compound: `{ brand: 1, model: 1 }` (for search)

**Static Methods:**
- `createCar(carData)` - Create new car with validation
- `deleteCar(id)` - Delete car by ID
- `updateCar(id, carData)` - Update car with validation

**Example Document:**

```json
{
  "_id": ObjectId("674f1f77bcf86cd799439012"),
  "brand": "Toyota",
  "year": 2023,
  "model": "Camry",
  "type": "Sedan",
  "price": 28000,
  "mileage": 15000,
  "engine": "2.5L 4-Cylinder",
  "transmission": "Automatic",
  "color": "Silver",
  "condition": "used",
  "images": [
    "https://s3.amazonaws.com/bucket/cars/1703512345678-camry-front.jpg",
    "https://s3.amazonaws.com/bucket/cars/1703512345679-camry-rear.jpg"
  ],
  "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
  "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
}
```

**Common Car Types:**
- Sedan
- SUV
- Truck
- Coupe
- Convertible
- Hatchback
- Van
- Wagon

---

### Orders Collection

**Collection Name:** `orders`

**Purpose:** Store customer purchase orders

**Schema:**

```javascript
{
  _id: ObjectId,                    // Auto-generated
  userId: ObjectId,                 // Reference to users._id (optional)
  status: String,                   // Enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  items: [                          // Array of order items
    {
      carId: String,                // Car ID as string
      name: String,                 // Car name for display
      price: Number,                // Price at time of order
      quantity: Number,             // Quantity ordered
      image: String                 // First image URL
    }
  ],
  totalAmount: Number,              // Required, positive
  shippingAddress: {                // Required nested object
    firstName: String,
    lastName: String,
    email: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  paymentMethod: String,            // Optional
  createdAt: Date,                  // Auto-generated
  updatedAt: Date                   // Auto-generated
}
```

**Field Details:**

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| `_id` | ObjectId | Auto | Auto | - |
| `userId` | ObjectId | No | null | Valid ObjectId if present |
| `status` | String | No | 'pending' | Enum values |
| `items` | Array | Yes | [] | Non-empty |
| `items.carId` | String | Yes | - | - |
| `items.name` | String | Yes | - | - |
| `items.price` | Number | Yes | - | > 0 |
| `items.quantity` | Number | Yes | - | > 0 |
| `items.image` | String | No | - | - |
| `totalAmount` | Number | Yes | - | > 0 |
| `shippingAddress` | Object | Yes | - | All sub-fields required |
| `paymentMethod` | String | No | - | - |
| `createdAt` | Date | Auto | Auto | - |
| `updatedAt` | Date | Auto | Auto | - |

**Order Statuses:**

| Status | Description |
|--------|-------------|
| `pending` | Order placed, awaiting processing |
| `processing` | Order being prepared |
| `shipped` | Order shipped/in transit |
| `delivered` | Order completed |
| `cancelled` | Order cancelled |

**Indexes:**
- `userId` (for user order history)
- `status` (for order management)
- `createdAt` (for sorting)

**Static Methods:**
- `getAllOrders()` - Get all orders sorted by date
- `createOrder(orderData)` - Create new order with validation

**Example Document:**

```json
{
  "_id": ObjectId("674f1f77bcf86cd799439013"),
  "userId": ObjectId("674f1f77bcf86cd799439011"),
  "status": "pending",
  "items": [
    {
      "carId": "674f1f77bcf86cd799439012",
      "name": "Toyota Camry 2023",
      "price": 28000,
      "quantity": 1,
      "image": "https://s3.amazonaws.com/bucket/cars/1703512345678-camry-front.jpg"
    }
  ],
  "totalAmount": 28000,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "Credit Card",
  "createdAt": ISODate("2024-01-20T14:30:00.000Z"),
  "updatedAt": ISODate("2024-01-20T14:30:00.000Z")
}
```

---

## Relationships

### User to Orders (One-to-Many)

**Type:** Soft reference (not enforced)

**Relationship:**
- One user can have multiple orders
- `orders.userId` references `users._id`
- Relationship is optional (guest checkout allowed)

**Query Examples:**

```javascript
// Get all orders for a user
db.orders.find({ userId: ObjectId("674f1f77bcf86cd799439011") });

// With Mongoose
const orders = await Order.find({ userId: user._id });
```

### Order to Cars (Reference)

**Type:** String reference (not enforced foreign key)

**Relationship:**
- Each order item contains `carId` as a string
- Not a strict foreign key relationship
- Car data is duplicated in order (name, price, image) for historical accuracy

**Why Duplicate Data?**
- Preserve order details even if car is deleted
- Maintain pricing at time of purchase
- Historical record integrity

---

## Indexes

### Recommended Indexes

**Users Collection:**
```javascript
// Created automatically by Mongoose unique constraint
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
```

**Cars Collection:**
```javascript
// Search performance
db.cars.createIndex({ brand: 1 });
db.cars.createIndex({ model: 1 });
db.cars.createIndex({ price: 1 });
db.cars.createIndex({ condition: 1 });

// Compound index for common searches
db.cars.createIndex({ brand: 1, model: 1 });
db.cars.createIndex({ condition: 1, price: 1 });

// Text search (optional)
db.cars.createIndex({
  brand: "text",
  model: "text",
  type: "text",
  engine: "text"
});
```

**Orders Collection:**
```javascript
// Order history and management
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 }); // Descending for recent first
```

### Creating Indexes

```javascript
// Using MongoDB shell
use car-dealership;
db.cars.createIndex({ brand: 1, model: 1 });

// Using Mongoose (add to schema)
carSchema.index({ brand: 1, model: 1 });
```

---

## Data Validation

### Mongoose Validation

**Built-in Validators:**

```javascript
// In carModel.js
const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand is required']
  },
  year: {
    type: Number,
    required: true,
    min: [1900, 'Year must be 1900 or later'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price must be positive']
  },
  condition: {
    type: String,
    required: true,
    enum: {
      values: ['new', 'used'],
      message: '{VALUE} is not a valid condition'
    }
  }
});
```

**Custom Validators:**

```javascript
// In userModel.js
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Email is not valid'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be at least 8 characters']
  }
});
```

### Application-Level Validation

**Password Strength:**

```javascript
// In userModel.js static method
if (!validator.isStrongPassword(password)) {
  throw Error('Password must contain uppercase, lowercase, numbers, and special characters');
}
```

**Year Validation:**

```javascript
// In carModel.js
const currentYear = new Date().getFullYear();
if (year < 1900 || year > currentYear) {
  throw Error(`Year must be between 1900 and ${currentYear}`);
}
```

---

## Sample Data

### Sample User

```json
{
  "_id": ObjectId("674f1f77bcf86cd799439010"),
  "username": "admin",
  "email": "admin@example.com",
  "password": "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
  "role": "admin",
  "createdAt": ISODate("2024-01-01T00:00:00.000Z"),
  "updatedAt": ISODate("2024-01-01T00:00:00.000Z")
}
```

### Sample Cars

```json
[
  {
    "_id": ObjectId("674f1f77bcf86cd799439011"),
    "brand": "Toyota",
    "year": 2023,
    "model": "Camry",
    "type": "Sedan",
    "price": 28000,
    "mileage": 15000,
    "engine": "2.5L 4-Cylinder",
    "transmission": "Automatic",
    "color": "Silver",
    "condition": "used",
    "images": ["https://s3.amazonaws.com/bucket/camry1.jpg"],
    "createdAt": ISODate("2024-01-15T10:30:00.000Z"),
    "updatedAt": ISODate("2024-01-15T10:30:00.000Z")
  },
  {
    "_id": ObjectId("674f1f77bcf86cd799439012"),
    "brand": "Honda",
    "year": 2024,
    "model": "Civic",
    "type": "Sedan",
    "price": 25000,
    "mileage": 0,
    "engine": "2.0L 4-Cylinder",
    "transmission": "Manual",
    "color": "Black",
    "condition": "new",
    "images": ["https://s3.amazonaws.com/bucket/civic1.jpg"],
    "createdAt": ISODate("2024-02-01T12:00:00.000Z"),
    "updatedAt": ISODate("2024-02-01T12:00:00.000Z")
  }
]
```

### Sample Order

```json
{
  "_id": ObjectId("674f1f77bcf86cd799439013"),
  "userId": ObjectId("674f1f77bcf86cd799439010"),
  "status": "delivered",
  "items": [
    {
      "carId": "674f1f77bcf86cd799439011",
      "name": "Toyota Camry 2023",
      "price": 28000,
      "quantity": 1,
      "image": "https://s3.amazonaws.com/bucket/camry1.jpg"
    }
  ],
  "totalAmount": 28000,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  },
  "paymentMethod": "Credit Card",
  "createdAt": ISODate("2024-03-01T14:00:00.000Z"),
  "updatedAt": ISODate("2024-03-05T16:00:00.000Z")
}
```

---

## Migration Guide

### Initial Setup

```javascript
// No migrations needed - Mongoose creates collections automatically
// Simply run the application and collections will be created
```

### Adding New Fields

**Example: Adding `description` to Cars**

```javascript
// 1. Update carModel.js
const carSchema = new mongoose.Schema({
  // ... existing fields
  description: {
    type: String,
    default: ''
  }
});

// 2. No migration needed - existing documents will have undefined/default
// 3. Optional: Bulk update existing documents
db.cars.updateMany(
  { description: { $exists: false } },
  { $set: { description: '' } }
);
```

### Changing Field Types

**Example: Change price from Number to Object with currency**

```javascript
// 1. Create migration script
const mongoose = require('mongoose');
const Car = require('./Models/carModel');

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const cars = await Car.find({});
  
  for (const car of cars) {
    if (typeof car.price === 'number') {
      car.price = {
        amount: car.price,
        currency: 'USD'
      };
      await car.save();
    }
  }
  
  console.log('Migration complete');
  process.exit();
}

migrate();
```

---

## Best Practices

### Schema Design

1. **Use appropriate data types**
   - Numbers for quantities, prices
   - Strings for text
   - Dates for timestamps
   - ObjectIds for references

2. **Add indexes strategically**
   - Index frequently queried fields
   - Compound indexes for common query patterns
   - Monitor index usage

3. **Denormalize when appropriate**
   - Duplicate data for read performance
   - Example: Order items contain car details

4. **Use validation**
   - Schema-level validation
   - Application-level validation
   - Frontend validation (UX)

### Query Optimization

1. **Use projection** (select specific fields)
   ```javascript
   Car.find().select('brand model price');
   ```

2. **Implement pagination**
   ```javascript
   Car.find().limit(20).skip(page * 20);
   ```

3. **Use lean queries** for read-only
   ```javascript
   Car.find().lean();
   ```

4. **Add indexes** for filtered fields

### Data Integrity

1. **Required fields** - Mark essential fields as required
2. **Unique constraints** - Prevent duplicates (email, username)
3. **Validation** - Validate data at multiple levels
4. **Soft deletes** - Consider flag instead of hard delete
5. **Audit trails** - Use timestamps, consider adding modifiedBy

### Security

1. **Never store plain passwords** - Always hash with bcrypt
2. **Validate all inputs** - Server-side validation is critical
3. **Sanitize user data** - Prevent injection attacks
4. **Use parameterized queries** - Mongoose handles this
5. **Limit field exposure** - Don't send password hashes to client

---

## Schema Evolution

### Version 1.0 (Current)

Current schema as documented above.

### Future Enhancements (Planned)

**Wishlist Collection:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  cars: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

**Reviews Collection:**
```javascript
{
  _id: ObjectId,
  carId: ObjectId,
  userId: ObjectId,
  rating: Number, // 1-5
  comment: String,
  createdAt: Date
}
```

**Inventory Tracking:**
```javascript
// Add to Car schema
{
  stock: Number,
  reserved: Number,
  available: Number
}
```

---

**Last Updated:** December 20, 2025  
**Version:** 1.0
