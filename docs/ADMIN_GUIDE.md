# Admin Panel Documentation

Complete guide for administrators managing the car dealership e-commerce platform.

## Table of Contents

- [Admin Access](#admin-access)
- [Dashboard Overview](#dashboard-overview)
- [Managing Car Inventory](#managing-car-inventory)
- [Order Management](#order-management)
- [User Management](#user-management)
- [Best Practices](#best-practices)
- [Common Tasks](#common-tasks)
- [Troubleshooting](#troubleshooting)

---

## Admin Access

### Admin Role Requirements

To access admin features, your user account must have:
- **Role:** `admin` (set in the database)
- **Valid JWT Token:** Obtained through login

### Setting Up Admin Users

Admin users must be created directly in the MongoDB database:

```javascript
// Using MongoDB Compass or shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
);
```

### Admin Authentication

1. **Login** using your admin credentials
2. Token is automatically included in all API requests
3. Admin-only endpoints verify your role before allowing access

### Security Notes

- Never share admin credentials
- Use strong, unique passwords
- Regularly audit admin accounts
- Monitor admin activity logs
- Implement 2FA (future enhancement)

---

## Dashboard Overview

### Current Implementation

The platform currently doesn't have a dedicated admin dashboard UI. Admin functions are accessed through:
- Direct API calls
- Admin components integrated into the main application

### Recommended Admin Dashboard (Future)

**Suggested Features:**
- Total cars in inventory
- Total orders (pending, completed, cancelled)
- Recent orders list
- Low stock alerts
- Sales analytics
- User registration trends

---

## Managing Car Inventory

### Adding a New Car

**Endpoint:** `POST /api/car/addcar`

**Required Information:**
- Brand (e.g., "Toyota", "Honda")
- Year (1900 to current year)
- Model (e.g., "Camry", "Civic")
- Type (e.g., "Sedan", "SUV", "Truck")
- Price (positive number)
- Mileage (positive number)
- Engine (e.g., "2.5L 4-Cylinder")
- Transmission (e.g., "Automatic", "Manual")
- Color (e.g., "Silver", "Black")
- Condition ("new" or "used")
- Images (up to 5 images)

**Step-by-Step Process:**

1. **Prepare Car Information**
   - Gather all vehicle specifications
   - Take high-quality photos (max 5 images)
   - Verify pricing and mileage

2. **Prepare Images**
   - Format: JPEG, JPG, or PNG only
   - Maximum size: 5MB per image
   - Recommended: 1200x800 pixels or higher
   - Name files descriptively (e.g., "camry-front.jpg")

3. **Using the Admin Component**
   ```
   Navigate to: Admin Car Edit Component
   - Fill in all required fields
   - Upload images (drag-and-drop or file picker)
   - Click "Add Car"
   ```

4. **Verification**
   - Check success notification
   - Verify car appears in inventory
   - Test car detail page
   - Confirm images loaded correctly

**Image Upload Details:**

- **Storage:** AWS S3 (production) or local `/backend/upload` (development)
- **S3 Bucket Structure:**
  ```
  your-bucket-name/
    ├── cars/
    │   ├── 1703512345678-camry-front.jpg
    │   ├── 1703512345679-camry-rear.jpg
    │   └── ...
  ```
- **Filename Format:** `{timestamp}-{original-name}.{ext}`

**Common Validation Errors:**

```
"All fields are required" 
→ Ensure no fields are empty

"Year must be between 1900 and current year"
→ Check year is valid

"Price and mileage must be positive numbers"
→ Verify numeric values are > 0

"Maximum 5 images allowed"
→ Select 5 or fewer images

"Only JPEG, JPG, and PNG files are allowed"
→ Convert images to supported formats
```

---

### Editing an Existing Car

**Endpoint:** `PATCH /api/car/editcar/:id`

**When to Edit:**
- Update pricing
- Correct typos or errors
- Update mileage for used cars
- Change availability status
- Replace or add images
- Update specifications

**Step-by-Step Process:**

1. **Locate the Car**
   - Browse inventory or search by model
   - Note the car's ID from the URL or database

2. **Access Edit Mode**
   ```
   Navigate to: Admin Car Edit Component
   - Select car from list
   - OR directly access: /admin/edit/{carId}
   ```

3. **Make Changes**
   - Modify any fields you need to update
   - Upload new images (optional - replaces old ones if provided)
   - Leave unchanged fields as-is

4. **Save Changes**
   - Click "Save" or "Update Car"
   - Wait for success confirmation

5. **Verify Updates**
   - Check car detail page
   - Confirm all changes applied
   - Test that images display correctly

**Partial Updates:**
- You only need to include fields you're changing
- Omitted fields remain unchanged
- Images: if not uploaded, old images are retained

---

### Removing a Car

**Endpoint:** `DELETE /api/car/removecar/:id`

**When to Remove:**
- Car has been sold
- Listing is expired
- Duplicate entry
- Car no longer available
- Data entry error

**Step-by-Step Process:**

1. **Verify Removal**
   - Confirm the car should be deleted
   - Check for associated orders
   - Save car details if needed for records

2. **Delete the Car**
   ```
   Navigate to: Admin Car Edit Component
   - Locate car in inventory list
   - Click "Remove" or "Delete" button
   - Confirm deletion in popup
   ```

3. **Confirmation**
   - Success notification appears
   - Car removed from inventory
   - Images deleted from S3 (if applicable)

**⚠️ Warning:**
- **Deletion is permanent** - cannot be undone
- **Associated Data:** Check if car is in any active orders
- **Images:** S3 images are NOT automatically deleted (manual cleanup needed)

**Manual S3 Cleanup (if needed):**
```bash
# Using AWS CLI
aws s3 rm s3://your-bucket-name/cars/car-image.jpg
```

---

### Inventory Management Best Practices

**Regular Maintenance:**
- Update inventory daily
- Remove sold cars immediately
- Keep pricing current
- Verify mileage for used cars
- Refresh images periodically

**Data Quality:**
- Use consistent naming conventions
- Provide complete specifications
- Upload high-quality images
- Double-check all fields before saving
- Include detailed descriptions

**Pricing Strategy:**
- Research market prices
- Update prices for seasonal demand
- Mark special offers clearly
- Be transparent about condition vs. price

**Image Guidelines:**
- **Exterior:** Front, rear, side views
- **Interior:** Dashboard, seats, trunk
- **Engine:** Under the hood (if relevant)
- **Details:** Unique features, upgrades
- **Lighting:** Well-lit, natural lighting preferred
- **Background:** Clean, professional setting

---

## Order Management

### Viewing All Orders

**Endpoint:** `GET /api/order/showallorders`

**Order Information Includes:**
- Order ID
- Customer information (if logged in)
- Order status
- Items purchased
- Total amount
- Shipping address
- Payment method
- Order date

**Order Statuses:**
- `pending` - Order placed, awaiting processing
- `processing` - Order being prepared
- `shipped` - Vehicle/documents in transit
- `delivered` - Order completed
- `cancelled` - Order cancelled

### Processing Orders

**Recommended Workflow:**

1. **New Order Received**
   - Review order details
   - Verify customer information
   - Check inventory availability
   - Confirm pricing

2. **Contact Customer**
   - Email/call using provided contact info
   - Confirm order details
   - Discuss payment options
   - Arrange delivery or pickup

3. **Payment Processing**
   - Process payment based on selected method
   - Verify payment received
   - Issue receipt/invoice

4. **Update Order Status**
   ```javascript
   // Manually in database (future: admin dashboard)
   db.orders.updateOne(
     { _id: ObjectId("orderId") },
     { $set: { status: "processing" } }
   );
   ```

5. **Delivery/Pickup**
   - Prepare vehicle
   - Complete paperwork
   - Arrange delivery or schedule pickup
   - Update status to "shipped"

6. **Completion**
   - Confirm delivery with customer
   - Update status to "delivered"
   - Follow up for feedback

### Order Status Updates

**Currently:** Manual database updates required

**Future Enhancement:** Admin dashboard with status dropdown

```javascript
// Example manual update
db.orders.updateOne(
  { _id: ObjectId("674f1f77bcf86cd799439013") },
  { 
    $set: { 
      status: "delivered",
      deliveryDate: new Date()
    } 
  }
);
```

### Handling Cancellations

**Customer-Initiated:**
1. Receive cancellation request
2. Verify order status
3. Process refund (if applicable)
4. Update order status to "cancelled"
5. Return car to inventory (if removed)

**Inventory Issues:**
1. If car no longer available
2. Contact customer immediately
3. Offer alternative vehicles
4. Process refund if necessary
5. Update order status

---

## User Management

### Current Implementation

User management is currently limited. Admin operations include:
- Manually setting user roles in database
- Viewing user orders

### Promoting Users to Admin

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
);
```

### Viewing User Orders

Filter orders by userId in the database:

```javascript
db.orders.find({ userId: ObjectId("userId") });
```

### Future User Management Features

**Recommended:**
- Admin dashboard with user list
- Role management UI
- User activity logs
- Account suspension/activation
- Password reset on behalf of users
- User analytics

---

## Best Practices

### Daily Tasks

**Morning:**
- [ ] Review new orders
- [ ] Check inventory accuracy
- [ ] Respond to customer inquiries
- [ ] Update order statuses

**Throughout Day:**
- [ ] Process new orders promptly
- [ ] Monitor chatbot interactions (logs)
- [ ] Add new inventory as available
- [ ] Update sold vehicles

**Evening:**
- [ ] Review day's sales
- [ ] Plan next day's tasks
- [ ] Backup critical data
- [ ] Check for system errors

### Weekly Tasks

- [ ] Audit inventory accuracy
- [ ] Review pricing strategy
- [ ] Clean up old/expired listings
- [ ] Analyze sales trends
- [ ] Update featured cars
- [ ] Review customer feedback

### Monthly Tasks

- [ ] Full inventory audit
- [ ] Review and archive old orders
- [ ] Update seasonal promotions
- [ ] Security audit (admin accounts)
- [ ] Performance review
- [ ] Backup verification

---

## Common Tasks

### Quick Reference

**Add a new car:**
```
1. Prepare car info + images
2. Navigate to admin car component
3. Fill form fields
4. Upload images
5. Click "Add Car"
```

**Update car price:**
```
1. Find car (search or browse)
2. Access edit mode
3. Update price field
4. Save changes
```

**Mark order as delivered:**
```
1. Access MongoDB
2. Find order by ID
3. Update status to "delivered"
4. Add deliveryDate timestamp
```

**Remove sold car:**
```
1. Locate car in admin panel
2. Click "Remove"
3. Confirm deletion
4. Verify removal
```

---

## Troubleshooting

### Common Issues

**Issue: "Request is not authorized" when adding car**

**Solution:**
- Verify you're logged in
- Check token is valid (not expired)
- Confirm user has admin role in database
- Try logging out and back in

---

**Issue: "Failed to upload images"**

**Solutions:**
- Check file size (max 5MB per image)
- Verify file format (JPEG, JPG, PNG only)
- Check AWS S3 credentials in `.env`
- Verify S3 bucket exists and permissions are correct
- Check network connection

---

**Issue: Images not displaying after upload**

**Solutions:**
- Check S3 bucket is public or has correct CORS settings
- Verify S3 URLs in database are correct
- Check browser console for CORS errors
- Ensure S3 bucket policy allows public read:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

---

**Issue: Cannot edit or delete cars**

**Solutions:**
- Verify admin authentication
- Check car ID is valid MongoDB ObjectId
- Ensure car exists in database
- Check server logs for detailed errors
- Verify middleware is properly configured

---

**Issue: Orders not showing**

**Solutions:**
- Check database connection
- Verify orders collection has data
- Check API endpoint returns data
- Clear browser cache
- Check for JavaScript errors in console

---

### Getting Help

**Error Logs:**
- Backend: Check PM2 logs `pm2 logs server`
- Database: Check MongoDB logs
- Frontend: Check browser console (F12)

**Support Channels:**
- Technical issues: dev-team@example.com
- AWS/S3 issues: Check AWS console
- Database issues: MongoDB Atlas dashboard

---

## Security Considerations

### Admin Security Checklist

- [ ] Strong admin passwords (15+ characters)
- [ ] Unique passwords for each admin
- [ ] Regular password rotation (90 days)
- [ ] Audit admin accounts monthly
- [ ] Monitor admin activity
- [ ] Limit admin accounts to necessary personnel
- [ ] Use HTTPS only
- [ ] Keep dependencies updated
- [ ] Regular security audits

### Data Protection

- Customer data is sensitive - handle with care
- Never share customer information
- Comply with data protection regulations
- Secure database access
- Regular backups
- Encrypt sensitive data

---

## Performance Tips

**Optimizing Admin Operations:**

1. **Batch Operations:** Group similar tasks
2. **Image Optimization:** Compress images before upload
3. **Regular Cleanup:** Remove old/unused data
4. **Monitor Database Size:** Archive old orders
5. **Cache Strategy:** Use browser cache for repeated lookups

**Recommended Tools:**
- Image compression: TinyPNG, ImageOptim
- Database management: MongoDB Compass
- API testing: Postman, Insomnia
- Monitoring: PM2 web dashboard

---

## Future Enhancements

**Planned Features:**
- [ ] Dedicated admin dashboard UI
- [ ] Visual order management
- [ ] Bulk operations (import/export)
- [ ] Advanced analytics and reporting
- [ ] Automated email notifications
- [ ] Inventory forecasting
- [ ] Customer relationship management (CRM)
- [ ] Multi-admin role levels (super admin, editor, viewer)

---

## Appendix

### Quick Links

- [API Reference](./API_REFERENCE.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Deployment Guide](./DEPLOYMENT.md)

### Contact

**Technical Support:** dev-team@example.com  
**Admin Training:** training@example.com  
**Emergency:** +1 (XXX) XXX-XXXX

---

**Last Updated:** December 20, 2025  
**Version:** 1.0  
**For:** Admin Users
