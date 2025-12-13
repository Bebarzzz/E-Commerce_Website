# Quick Start Guide - Admin Panel

## Accessing the Admin Panel

### Step 1: Login as Admin
1. Navigate to `/login`
2. Login with admin credentials
3. Token will be stored automatically

### Step 2: Access Admin Dashboard
- Go to: `http://localhost:3000/admin`
- You'll see the admin dashboard with available features

### Step 3: Add a New Car

1. **Click "Add New Car"** card on the dashboard
2. **Fill in the form**:
   - Brand (e.g., Toyota, BMW, Ford)
   - Model (e.g., Camry, 3 Series)
   - Manufacture Year (e.g., 2023)
   - Type (Select from dropdown: Sedan, SUV, Truck, etc.)
   - Price (e.g., 25000)

3. **Upload Images**:
   - Click "📸 Choose Images"
   - Select 1-5 images (max 5MB each)
   - Preview images before submitting
   - Remove any unwanted images with the × button

4. **Submit**:
   - Click "Add Car" button
   - Wait for success message
   - Form will reset automatically

## Testing the Feature

### Using curl (Command Line)
```bash
curl -X POST http://localhost:4000/api/car \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "model=Camry" \
  -F "brand=Toyota" \
  -F "manufactureYear=2023" \
  -F "type=Sedan" \
  -F "price=25000" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Using Postman
1. Method: POST
2. URL: `http://localhost:4000/api/car`
3. Headers:
   - `Authorization: Bearer YOUR_TOKEN`
4. Body (form-data):
   - model: Camry
   - brand: Toyota
   - manufactureYear: 2023
   - type: Sedan
   - price: 25000
   - images: [select files]

## Common Issues & Solutions

### 1. "Authorization token required"
**Solution**: Make sure you're logged in and the token is in localStorage
```javascript
localStorage.getItem('token')
```

### 2. "Admin access required"
**Solution**: User must have admin role in database
```javascript
{ role: 'admin' }
```

### 3. "Only image files are allowed"
**Solution**: Select only .jpg, .png, .gif, or other image formats

### 4. "File too large"
**Solution**: Compress images to under 5MB each

### 5. Images not uploading
**Solution**: Check AWS S3 credentials in backend .env file

## Browser Console Debugging

Open Developer Tools (F12) and check:

```javascript
// Check if token exists
console.log(localStorage.getItem('token'))

// Check API endpoint
console.log(API_ENDPOINTS.ADD_CAR)

// View network requests
// Go to Network tab and watch for POST request to /api/car
```

## Verification

After adding a car, verify it was added:

1. **Frontend**: 
   - Navigate to home page
   - New car should appear in listings

2. **Backend**:
   - Check MongoDB for new car document
   - Verify images uploaded to S3 bucket

3. **API**:
   ```bash
   curl http://localhost:4000/api/car
   ```

## Demo Data

Use this sample data for testing:

```javascript
Brand: Toyota
Model: Camry
Year: 2023
Type: Sedan
Price: 28500

Brand: Ford
Model: F-150
Year: 2024
Type: Truck
Price: 42000

Brand: BMW
Model: X5
Year: 2023
Type: SUV
Price: 65000
```

## Next Steps

After successfully adding cars:
- View cars on the main shop page
- Test filtering by category
- View individual product pages
- Add to cart functionality

## Support

For issues:
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify environment variables
4. Check network requests in DevTools
