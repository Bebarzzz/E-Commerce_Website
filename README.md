# 🚗 Car Dealership E-Commerce Platform

A full-stack e-commerce web application for buying and selling cars (both new and used vehicles). The platform features a comprehensive car inventory management system, shopping cart, checkout process, and an AI-powered bilingual chatbot assistant.

## 📋 Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Customer Features
- **Browse Car Inventory** - View all available cars with detailed specifications
- **Advanced Search** - Search across brand, model, type, engine, and transmission
- **Category Filtering** - Filter by new cars, used cars, and special offers
- **Product Sorting** - Sort by price (low-to-high, high-to-low)
- **Shopping Cart** - Add/remove items, manage quantities, view totals
- **Secure Checkout** - Complete purchase with shipping details
- **Order Management** - Track order history and status
- **AI Chatbot** - Bilingual (English/Arabic) assistant for car recommendations and support
- **User Authentication** - Secure signup and login with JWT

### Admin Features
- **Car Management** - Full CRUD operations for car inventory
- **Image Upload** - Multiple image support with AWS S3 storage
- **Order Overview** - View and manage all customer orders

### AI-Powered Chatbot
- Claude 3.5 Sonnet integration
- Bilingual support (English and Arabic)
- Car recommendations based on preferences
- Web search capability for general knowledge
- Context-aware conversation history
- Dynamic suggested questions

## 🛠 Technologies

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB with Mongoose ODM v8.19.2
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **File Storage:** AWS S3 (@aws-sdk/client-s3)
- **File Upload:** Multer & Multer-S3
- **Security:** CORS, validator.js
- **AI Integration:** Anthropic Claude API
- **Process Manager:** PM2 (production)

### Frontend
- **Library:** React v19.2.0
- **Routing:** React Router DOM v7.9.6
- **State Management:** Context API
- **HTTP Client:** Fetch API
- **Testing:** Jest & React Testing Library
- **Build Tool:** Create React App

### DevOps & Cloud
- **Cloud Platform:** AWS (EC2, S3)
- **Web Server:** Nginx (reverse proxy)
- **Version Control:** Git/GitHub

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher)
- **MongoDB** (Atlas account or local installation)
- **AWS Account** (for S3 storage)
- **Anthropic API Key** (for chatbot feature)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd E-Commerce_Website
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (see [Environment Variables](#environment-variables))

```bash
npm run dev
```

The backend server will start on `http://localhost:4000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:4000
```

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🔐 Environment Variables

### Backend (.env)

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# AWS S3 Configuration
S3_BUCKET=your-bucket-name
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1

# Claude AI API
CLAUDE_API_KEY=your_anthropic_api_key
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:4000
```

## 📁 Project Structure

### Backend Structure

```
backend/
├── server.js                 # Express server & MongoDB connection
├── ecosystem.config.js       # PM2 configuration for production
├── nginx.conf               # Nginx reverse proxy configuration
├── setup-ec2.sh             # AWS EC2 deployment script
├── setup-ssl.sh             # SSL certificate setup script
├── config/
│   └── multerS3.js          # AWS S3 upload configuration
├── controllers/
│   ├── carController.js     # Car CRUD operations
│   ├── userController.js    # User authentication logic
│   ├── orderController.js   # Order management
│   └── chatbotController.js # AI chatbot logic
├── Models/
│   ├── carModel.js          # Car schema & validation
│   ├── userModel.js         # User schema & auth methods
│   └── orderModel.js        # Order schema
├── middleware/
│   └── requireAuth.js       # JWT & admin authorization
└── routes/
    ├── car.js               # Car API endpoints
    ├── user.js              # User API endpoints
    └── order.js             # Order API endpoints
```

### Frontend Structure

```
frontend/src/
├── App.js                   # Main routing component
├── config/
│   └── api.js               # API configuration & helper
├── services/
│   ├── carService.js        # Car API calls
│   ├── userService.js       # Authentication API calls
│   └── orderService.js      # Order API calls
├── Context/
│   ├── ShopContext.jsx      # Global state (cart, products)
│   └── NotificationContext.js # Toast notifications
├── Pages/
│   ├── Shop.jsx             # Homepage
│   ├── ShopCategory.jsx     # Category pages (new/used/offers)
│   ├── Product.jsx          # Product details page
│   ├── Cart.jsx             # Shopping cart
│   ├── Checkout.jsx         # Checkout form
│   ├── OrderConfirmed.jsx   # Order confirmation
│   ├── LoginSignup.jsx      # Authentication page
│   └── Contact.jsx          # Contact page
└── Components/
    ├── Navbar/              # Navigation bar
    ├── Hero/                # Homepage hero section
    ├── Item/                # Product card component
    ├── CartItems/           # Cart display
    ├── ProductDisplay/      # Product details display
    ├── SearchBar/           # Search component
    ├── Chatbot.jsx          # AI chatbot component
    ├── DescriptionBox/      # Product description
    ├── RelatedProducts/     # Related products section
    └── Toast/               # Notification system
```

## 📡 API Documentation

Base URL: `http://localhost:4000`

### Authentication Endpoints

#### Register User
```http
POST /api/user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "isAdmin": false
}

Response: { "token": "jwt_token", "user": {...} }
```

#### Login User
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response: { "token": "jwt_token", "user": {...} }
```

### Car Endpoints

#### Get All Cars
```http
GET /api/car/

Response: [{ car_id, model, brand, price, images, ... }]
```

#### Get Single Car
```http
GET /api/car/:id

Response: { car_id, model, brand, year, price, specifications, ... }
```

#### Add Car (Admin Only)
```http
POST /api/car/addcar
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData: {
  model, brand, year, type, condition, price,
  engineCapacity, engineType, transmissionType,
  wheelDriveType, images (multiple files)
}

Response: { message, car }
```

#### Edit Car (Admin Only)
```http
PATCH /api/car/editcar/:id
Authorization: Bearer <token>
Content-Type: application/json

Body: { field_to_update: new_value }

Response: { message, car }
```

#### Remove Car (Admin Only)
```http
DELETE /api/car/removecar/:id
Authorization: Bearer <token>

Response: { message }
```

#### Search Cars
```http
GET /api/car/search?query=toyota

Response: [{ matching_cars }]
```

### Order Endpoints

#### Create Order
```http
POST /api/order/addorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [{ carId, quantity, price }],
  "totalAmount": 50000,
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA",
    "phone": "+1234567890"
  }
}

Response: { message, order }
```

#### Get All Orders
```http
GET /api/order/showallorders
Authorization: Bearer <token>

Response: [{ orders }]
```

### Chatbot Endpoints

#### Chat with AI
```http
POST /api/chatbot/chat
Content-Type: application/json

{
  "message": "I need a family SUV with good fuel economy",
  "conversationHistory": []
}

Response: { response, conversationHistory }
```

#### Get Available Cars (for chatbot context)
```http
GET /api/chatbot/cars

Response: [{ car summaries }]
```

### Health Check

```http
GET /api/health

Response: { status: "OK", message: "Server is running" }
```

## 📜 Available Scripts

### Backend Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
```

### Frontend Scripts

```bash
npm start          # Start development server (port 3000)
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🚀 Deployment

### AWS EC2 Deployment

The project includes automated deployment scripts for AWS EC2:

#### 1. Initial EC2 Setup

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Run the setup script
chmod +x setup-ec2.sh
./setup-ec2.sh
```

This script will:
- Update system packages
- Install Node.js 18.x
- Install PM2 globally
- Install Nginx
- Configure firewall rules

#### 2. Deploy Application

```bash
# Clone your repository
git clone <repository-url>
cd E-Commerce_Website/backend

# Install dependencies
npm install

# Configure environment variables
nano .env

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/ecommerce
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/

# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Setup SSL (Optional)

```bash
chmod +x setup-ssl.sh
./setup-ssl.sh yourdomain.com
```

### PM2 Process Management

```bash
pm2 list                    # List all processes
pm2 logs ecommerce-backend  # View logs
pm2 restart ecommerce-backend # Restart app
pm2 stop ecommerce-backend  # Stop app
pm2 delete ecommerce-backend # Remove from PM2
```

### Environment-Specific Configuration

For production, update `.env`:

```env
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
```

## 🔒 Security Best Practices

- **Password Requirements:** Minimum 8 characters with uppercase, lowercase, numbers, and special characters
- **JWT Tokens:** 3-day expiration, stored securely in localStorage
- **CORS:** Configured for specific allowed origins
- **Input Validation:** Server-side validation using validator.js
- **Admin Protection:** Role-based access control for admin routes
- **File Upload:** 5MB limit with type validation
- **HTTPS:** SSL/TLS encryption (production)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Bebarzzz** 
- **ZiaDz999** 
- **AShalaby191** 
- **ATaherGamal** 

## 🙏 Acknowledgments

- React team for the amazing frontend library
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- Anthropic for Claude AI API
- AWS for cloud infrastructure

## 📞 Support

For support, email mosaafa.bebars37@gmail.com or open an issue in the repository.

---

**Built with ❤️ for CSCI313 Software Engineering - Fall 2025**
