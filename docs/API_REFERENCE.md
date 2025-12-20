# API Reference

Complete API documentation for the E-Commerce Car Dealership platform.

## Base URL

- **Development:** `http://localhost:4000/api`
- **Production:** `https://your-domain.com/api`

## Table of Contents

- [Authentication](#authentication)
- [User Endpoints](#user-endpoints)
- [Car Endpoints](#car-endpoints)
- [Order Endpoints](#order-endpoints)
- [Chatbot Endpoints](#chatbot-endpoints)
- [Health Check](#health-check)
- [Error Codes](#error-codes)

---

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header for protected routes.

### Header Format
```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration
- Tokens expire after **3 days**
- Obtain new tokens by logging in again

---

## User Endpoints

### Register User

Create a new user account.

**Endpoint:** `POST /user/signup`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

**Validation Rules:**
- `username`: Required, string, unique
- `email`: Required, valid email format, unique
- `password`: Required, minimum 8 characters, must contain:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

**Success Response (201):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Email already in use"
}

// 400 - Weak Password
{
  "error": "Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters"
}

// 400 - Invalid Email
{
  "error": "Email is not valid"
}
```

---

### Login User

Authenticate existing user.

**Endpoint:** `POST /user/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "StrongPass123!"
}
```

**Success Response (200):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "role": "customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
```json
// 400 - Invalid Credentials
{
  "error": "Incorrect password"
}

// 400 - User Not Found
{
  "error": "Incorrect email"
}

// 400 - Missing Fields
{
  "error": "All fields must be filled"
}
```

---

## Car Endpoints

### Get All Cars

Retrieve all cars in the inventory.

**Endpoint:** `GET /car/allcars`

**Authentication:** Not required

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "cars": [
    {
      "_id": "507f1f77bcf86cd799439011",
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
        "https://s3.amazonaws.com/bucket/car1-1.jpg",
        "https://s3.amazonaws.com/bucket/car1-2.jpg"
      ],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch cars"
}
```

---

### Get Single Car

Retrieve details of a specific car.

**Endpoint:** `GET /car/:id`

**Authentication:** Not required

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the car

**Success Response (200):**
```json
{
  "success": true,
  "car": {
    "_id": "507f1f77bcf86cd799439011",
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
      "https://s3.amazonaws.com/bucket/car1-1.jpg"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "No such car"
}

// 400 - Invalid ID
{
  "error": "Invalid car ID"
}
```

---

### Search Cars

Search for cars using multiple criteria.

**Endpoint:** `GET /car/search`

**Authentication:** Not required

**Query Parameters:**
- `query` (optional): Search term for brand, model, type, engine, transmission, or color
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `condition` (optional): "new" or "used"

**Example Request:**
```
GET /car/search?query=toyota&minPrice=20000&maxPrice=30000&condition=used
```

**Success Response (200):**
```json
{
  "success": true,
  "cars": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "brand": "Toyota",
      "year": 2023,
      "model": "Camry",
      "price": 28000,
      "condition": "used",
      // ... other fields
    }
  ],
  "count": 1
}
```

**Error Response (500):**
```json
{
  "error": "Search failed"
}
```

---

### Add Car (Admin Only)

Add a new car to the inventory.

**Endpoint:** `POST /car/addcar`

**Authentication:** Required (Admin role)

**Content-Type:** `multipart/form-data`

**Form Data:**
```
brand: "Toyota"
year: 2024
model: "RAV4"
type: "SUV"
price: 35000
mileage: 5000
engine: "2.5L Hybrid"
transmission: "Automatic"
color: "Blue"
condition: "new"
images: [File1, File2, File3] // Max 5 images, 5MB each
```

**Image Requirements:**
- **Formats:** JPEG, JPG, PNG
- **Max Size:** 5MB per image
- **Max Count:** 5 images
- **Storage:** AWS S3 (production) or local /upload folder (development)

**Success Response (200):**
```json
{
  "success": true,
  "car": {
    "_id": "507f1f77bcf86cd799439012",
    "brand": "Toyota",
    "year": 2024,
    "model": "RAV4",
    // ... all fields
    "images": [
      "https://s3.amazonaws.com/bucket/1703512345678-image1.jpg",
      "https://s3.amazonaws.com/bucket/1703512345679-image2.jpg"
    ]
  }
}
```

**Error Responses:**
```json
// 401 - Not Authenticated
{
  "error": "Request is not authorized"
}

// 403 - Not Admin
{
  "error": "User is not authorized to perform this action"
}

// 400 - Validation Error
{
  "error": "All fields are required"
}

// 400 - Invalid Year
{
  "error": "Year must be between 1900 and current year"
}

// 400 - Invalid Price/Mileage
{
  "error": "Price and mileage must be positive numbers"
}

// 400 - Too Many Images
{
  "error": "Maximum 5 images allowed"
}

// 400 - Invalid File Type
{
  "error": "Only JPEG, JPG, and PNG files are allowed"
}
```

---

### Edit Car (Admin Only)

Update an existing car's information.

**Endpoint:** `PATCH /car/editcar/:id`

**Authentication:** Required (Admin role)

**Content-Type:** `multipart/form-data`

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the car to edit

**Form Data:** (All fields optional, include only fields to update)
```
brand: "Toyota"
year: 2024
model: "RAV4 XLE"
price: 36000
// ... any other fields
images: [File1, File2] // New images (will replace old ones if provided)
```

**Success Response (200):**
```json
{
  "success": true,
  "car": {
    "_id": "507f1f77bcf86cd799439012",
    "brand": "Toyota",
    "year": 2024,
    "model": "RAV4 XLE",
    "price": 36000,
    // ... updated fields
  }
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "No such car"
}

// 401/403 - Authorization errors (same as Add Car)
```

---

### Remove Car (Admin Only)

Delete a car from the inventory.

**Endpoint:** `DELETE /car/removecar/:id`

**Authentication:** Required (Admin role)

**URL Parameters:**
- `id` (required): MongoDB ObjectId of the car to delete

**Success Response (200):**
```json
{
  "success": true,
  "car": {
    "_id": "507f1f77bcf86cd799439012",
    "brand": "Toyota",
    // ... deleted car data
  }
}
```

**Error Responses:**
```json
// 404 - Not Found
{
  "error": "No such car"
}

// 401/403 - Authorization errors
```

---

## Order Endpoints

### Get All Orders

Retrieve all orders in the system.

**Endpoint:** `GET /order/showallorders`

**Authentication:** Not currently enforced (should be admin only in production)

**Success Response (200):**
```json
{
  "success": true,
  "orders": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439010",
      "status": "pending",
      "items": [
        {
          "carId": "507f1f77bcf86cd799439011",
          "name": "Toyota Camry 2023",
          "price": 28000,
          "quantity": 1,
          "image": "https://s3.amazonaws.com/bucket/car1-1.jpg"
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
      "createdAt": "2024-01-20T14:30:00.000Z",
      "updatedAt": "2024-01-20T14:30:00.000Z"
    }
  ]
}
```

**Error Response (500):**
```json
{
  "error": "Failed to fetch orders"
}
```

---

### Create Order

Place a new order.

**Endpoint:** `POST /order/placeorder`

**Authentication:** Optional (userId will be set if authenticated)

**Request Body:**
```json
{
  "items": [
    {
      "carId": "507f1f77bcf86cd799439011",
      "name": "Toyota Camry 2023",
      "price": 28000,
      "quantity": 1,
      "image": "https://s3.amazonaws.com/bucket/car1-1.jpg"
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
  "paymentMethod": "Credit Card"
}
```

**Validation Rules:**
- `items`: Required, non-empty array
- `totalAmount`: Required, positive number
- `shippingAddress`: Required, all sub-fields required
- `paymentMethod`: Optional, string

**Success Response (201):**
```json
{
  "success": true,
  "order": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439010",
    "status": "pending",
    "items": [...],
    "totalAmount": 28000,
    "shippingAddress": {...},
    "paymentMethod": "Credit Card",
    "createdAt": "2024-01-20T14:30:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// 400 - Validation Error
{
  "error": "Items and shipping address are required"
}

// 400 - Invalid Total
{
  "error": "Total amount must be a positive number"
}

// 400 - Empty Cart
{
  "error": "Items array cannot be empty"
}
```

---

## Chatbot Endpoints

### Chat with AI Assistant

Send a message to the bilingual AI chatbot powered by Claude 3.5 Sonnet.

**Endpoint:** `POST /chatbot/chat`

**Authentication:** Not required

**Request Body:**
```json
{
  "message": "I'm looking for a reliable SUV under $40,000",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help you find your perfect car today?"
    }
  ]
}
```

**Request Fields:**
- `message` (required): User's current message
- `conversationHistory` (optional): Array of previous messages for context

**Success Response (200):**
```json
{
  "reply": "I'd be happy to help you find a reliable SUV! Based on your budget of under $40,000, I recommend...",
  "suggestedQuestions": [
    "What fuel efficiency do these SUVs offer?",
    "Are any of these available in hybrid models?",
    "Can I see photos of the Toyota RAV4?"
  ],
  "recommendedCars": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "brand": "Toyota",
      "model": "RAV4",
      "year": 2023,
      "price": 35000,
      "type": "SUV"
    }
  ]
}
```

**Features:**
- **Bilingual Support:** Responds in Arabic if user writes in Arabic
- **Context-Aware:** Maintains conversation history
- **Car Recommendations:** Suggests relevant vehicles from inventory
- **Web Search:** Can search the web for general automotive questions
- **Dynamic Suggestions:** Provides 3 follow-up questions

**Error Response (500):**
```json
{
  "error": "Failed to get chatbot response"
}
```

---

### Get Available Cars (Chatbot Context)

Retrieve simplified car data for chatbot context.

**Endpoint:** `GET /chatbot/available-cars`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "cars": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "brand": "Toyota",
      "model": "Camry",
      "year": 2023,
      "price": 28000,
      "type": "Sedan",
      "condition": "used",
      "mileage": 15000
    }
  ]
}
```

---

## Health Check

### Server Health Status

Check if the server is running.

**Endpoint:** `GET /health`

**Authentication:** Not required

**Success Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

---

## Error Codes

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid request data or validation error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | User lacks required permissions (not admin) |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error occurred |

### Common Error Messages

**Authentication Errors:**
- `"Request is not authorized"` - No token provided or invalid token
- `"User is not authorized to perform this action"` - User is not admin

**Validation Errors:**
- `"All fields must be filled"` - Required fields missing
- `"Email is not valid"` - Invalid email format
- `"Password too weak"` - Password doesn't meet strength requirements
- `"Email already in use"` - Email already registered
- `"Username already exists"` - Username taken

**Resource Errors:**
- `"No such car"` - Car ID not found in database
- `"No such user"` - User not found
- `"Invalid car ID"` - Malformed MongoDB ObjectId

**File Upload Errors:**
- `"Maximum 5 images allowed"` - Too many files uploaded
- `"Only JPEG, JPG, and PNG files are allowed"` - Invalid file type
- `"File too large"` - File exceeds 5MB limit

---

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

**Recommended Limits:**
- Authentication endpoints: 5 requests per minute per IP
- Search endpoints: 20 requests per minute per IP
- Admin endpoints: 30 requests per minute per user
- Chatbot: 10 requests per minute per session

---

## CORS Policy

**Allowed Origins:** Configured via `ALLOWED_ORIGINS` environment variable

**Allowed Methods:** GET, POST, PATCH, DELETE

**Allowed Headers:** Content-Type, Authorization

---

## Webhooks

Currently not implemented. Future consideration for order status updates and payment notifications.

---

## Versioning

Current API Version: **v1** (implicit, no version in URL)

Future versions may use URL versioning: `/api/v2/...`

---

## SDK & Code Examples

### JavaScript/Node.js Example

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:4000/api/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return data.token;
};

// Get all cars
const getCars = async () => {
  const response = await fetch('http://localhost:4000/api/car/allcars');
  const data = await response.json();
  return data.cars;
};

// Add car (admin)
const addCar = async (token, carData, images) => {
  const formData = new FormData();
  Object.keys(carData).forEach(key => {
    formData.append(key, carData[key]);
  });
  images.forEach(image => {
    formData.append('images', image);
  });

  const response = await fetch('http://localhost:4000/api/car/addcar', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  return await response.json();
};
```

---

## Support

For API support and bug reports:
- Email: support@example.com
- GitHub Issues: [Project Repository](https://github.com/your-repo)

---

**Last Updated:** December 20, 2025
