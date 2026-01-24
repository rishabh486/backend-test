# Production Deployment Guide

This guide covers production-ready features and deployment best practices.

---

## 🚀 Production Features

### Security
- ✅ **Helmet.js** - Security headers protection
- ✅ **Rate Limiting** - Prevents abuse (100 req/15min general, 5 req/15min auth)
- ✅ **CORS Configuration** - Configurable allowed origins
- ✅ **Input Validation** - Express-validator for all endpoints
- ✅ **Error Handling** - Centralized error handling middleware
- ✅ **Password Hashing** - bcryptjs with salt rounds

### Reliability
- ✅ **Graceful Shutdown** - Handles SIGTERM/SIGINT properly
- ✅ **Error Recovery** - Unhandled rejection/exception handlers
- ✅ **Environment Validation** - Validates required env vars on startup
- ✅ **Request Logging** - Morgan for production logging

### Code Quality
- ✅ **Async Error Handling** - asyncHandler wrapper for routes
- ✅ **Validation Middleware** - Reusable validation rules
- ✅ **Consistent Error Responses** - Standardized error format

---

## 📋 Environment Variables

### Required
```bash
MONGODB_URI=mongodb+srv://...
```

### Optional (with defaults)
```bash
PORT=4000
NODE_ENV=production
JWT_SECRET=your-secret-key-here
BASE_URL=https://your-domain.com
ALLOWED_ORIGINS=https://your-frontend.com,https://another-domain.com

# Cloudinary (optional)
CLOUDINARY_URL=cloudinary://...
# OR
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 🔒 Security Checklist

- [ ] Set strong `JWT_SECRET` (use crypto.randomBytes(32).toString('hex'))
- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` (comma-separated list)
- [ ] Use HTTPS in production
- [ ] Keep dependencies updated (`npm audit`)
- [ ] Use MongoDB Atlas with IP whitelisting
- [ ] Enable MongoDB authentication
- [ ] Set up proper CORS origins
- [ ] Review rate limiting limits for your use case
- [ ] Set up monitoring and alerts

---

## 📦 Installation

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your values

# Start server
npm start
```

---

## 🧪 Testing

### Health Check
```bash
GET /health
```

### API Info
```bash
GET /api
```

---

## 📊 Monitoring

### Health Check Endpoint
Returns server status, timestamp, and uptime:
```json
{
  "status": "ok",
  "timestamp": "2024-12-29T08:00:00.000Z",
  "uptime": 3600
}
```

### Logging
- **Development**: `morgan('dev')` - colored, concise logs
- **Production**: `morgan('combined')` - Apache combined log format

---

## 🚢 Deployment Platforms

### Render
1. Connect GitHub repository
2. Set environment variables in dashboard
3. Build command: `npm install`
4. Start command: `npm start`
5. Set `NODE_ENV=production`

### Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically
4. Set `NODE_ENV=production`

### Heroku
1. `heroku create your-app-name`
2. `heroku config:set NODE_ENV=production`
3. Add all environment variables
4. `git push heroku main`

---

## 🔧 Production Optimizations

### Database
- Use connection pooling (Mongoose handles this)
- Add indexes for frequently queried fields
- Monitor query performance

### Performance
- Consider adding Redis for caching
- Use CDN for static assets
- Enable gzip compression (Express 5 handles this)

### Scaling
- Use PM2 or similar for process management
- Set up load balancing
- Use MongoDB Atlas for managed database

---

## 📝 Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "error": "Error message here"
}
```

Validation errors:
```json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

## 🛡️ Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP
- Adjust in `src/app.js` if needed

---

## 📚 API Documentation

### Endpoints

#### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login

#### Items
- `GET /api/items` - Get all items (paginated)
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item

#### Wishlist
- `GET /api/wishlist` - Get wishlist (paginated)
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:itemId` - Remove from wishlist
- `GET /api/wishlist/check/:itemId` - Check if in wishlist

---

## 🔍 Troubleshooting

### Server won't start
- Check environment variables are set
- Verify MongoDB connection string
- Check port is not in use

### Rate limiting issues
- Adjust limits in `src/app.js`
- Check if behind proxy (may need to configure trust proxy)

### CORS errors
- Set `ALLOWED_ORIGINS` environment variable
- Include protocol (https://) in origins

---

## 📞 Support

For issues or questions, check:
- Error logs in console
- MongoDB Atlas logs
- Deployment platform logs

---

**Ready for production! 🎉**

