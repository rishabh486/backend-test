# Wishlist API Guide

Complete guide for using the wishlist endpoints.

---

## 🔐 Authentication Required

**All wishlist endpoints require authentication.** You need to:

1. **Sign up or Login** first to get a JWT token
2. **Include the token** in the `Authorization` header for all wishlist requests

### Getting a Token

**Signup:**
```bash
POST https://backend-test-10us.onrender.com/api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { "id": "...", "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Login:**
```bash
POST https://backend-test-10us.onrender.com/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Copy the `token` from the response!**

---

## 📋 Wishlist Endpoints

### 1. Add Item to Wishlist

**Endpoint:** `POST /api/wishlist`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json
```

**Body:**
```json
{
  "itemId": "67890abcdef1234567890123"
}
```

**Response (201 Created):**
```json
{
  "message": "Item added to wishlist successfully",
  "wishlistItem": {
    "id": "...",
    "item": {
      "id": "...",
      "name": "My Item",
      "description": "...",
      "imageUrl": "...",
      "rating": 4.5
    },
    "createdAt": "2024-12-29T08:00:00.000Z"
  }
}
```

**Error (409):** Item already in wishlist
**Error (404):** Item not found

---

### 2. Get User's Wishlist

**Endpoint:** `GET /api/wishlist`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200 OK):**
```json
{
  "count": 2,
  "wishlist": [
    {
      "id": "...",
      "item": {
        "id": "...",
        "name": "Item 1",
        "description": "...",
        "imageUrl": "...",
        "rating": 4.5
      },
      "addedAt": "2024-12-29T08:00:00.000Z"
    },
    {
      "id": "...",
      "item": {
        "id": "...",
        "name": "Item 2",
        "description": "...",
        "imageUrl": "...",
        "rating": 4.0
      },
      "addedAt": "2024-12-29T07:00:00.000Z"
    }
  ]
}
```

---

### 3. Remove Item from Wishlist

**Endpoint:** `DELETE /api/wishlist/:itemId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```bash
DELETE https://backend-test-10us.onrender.com/api/wishlist/67890abcdef1234567890123
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200 OK):**
```json
{
  "message": "Item removed from wishlist successfully"
}
```

**Error (404):** Item not found in wishlist

---

### 4. Check if Item is in Wishlist (Bonus)

**Endpoint:** `GET /api/wishlist/check/:itemId`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```bash
GET https://backend-test-10us.onrender.com/api/wishlist/check/67890abcdef1234567890123
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response (200 OK):**
```json
{
  "isInWishlist": true,
  "wishlistItem": {
    "id": "...",
    "user": "...",
    "item": "...",
    "createdAt": "..."
  }
}
```

Or if not in wishlist:
```json
{
  "isInWishlist": false,
  "wishlistItem": null
}
```

---

## 🧪 Testing with Postman

### Step 1: Get Authentication Token

1. **POST** to `/api/auth/login` or `/api/auth/signup`
2. Copy the `token` from response

### Step 2: Add Token to Postman

1. Go to **Authorization** tab
2. Select **Type: Bearer Token**
3. Paste your token in the **Token** field

OR

1. Go to **Headers** tab
2. Add header:
   - **Key**: `Authorization`
   - **Value**: `Bearer YOUR_TOKEN_HERE`

### Step 3: Test Wishlist Endpoints

**Add to Wishlist:**
- Method: `POST`
- URL: `https://backend-test-10us.onrender.com/api/wishlist`
- Headers: `Authorization: Bearer YOUR_TOKEN`
- Body (JSON):
  ```json
  {
    "itemId": "paste-an-item-id-here"
  }
  ```

**Get Wishlist:**
- Method: `GET`
- URL: `https://backend-test-10us.onrender.com/api/wishlist`
- Headers: `Authorization: Bearer YOUR_TOKEN`

**Remove from Wishlist:**
- Method: `DELETE`
- URL: `https://backend-test-10us.onrender.com/api/wishlist/ITEM_ID_HERE`
- Headers: `Authorization: Bearer YOUR_TOKEN`

---

## 📝 Complete Example Flow

1. **Create an account:**
   ```bash
   POST /api/auth/signup
   { "email": "test@example.com", "password": "test123" }
   # Save the token: "eyJhbGciOiJIUzI1NiIs..."
   ```

2. **Get all items to find an item ID:**
   ```bash
   GET /api/items
   # Find an item ID, e.g., "67890abcdef1234567890123"
   ```

3. **Add item to wishlist:**
   ```bash
   POST /api/wishlist
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   { "itemId": "67890abcdef1234567890123" }
   ```

4. **View your wishlist:**
   ```bash
   GET /api/wishlist
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

5. **Remove from wishlist:**
   ```bash
   DELETE /api/wishlist/67890abcdef1234567890123
   Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
   ```

---

## ⚠️ Common Errors

### 401 Unauthorized
- **Cause**: Missing or invalid token
- **Solution**: Make sure you're including `Authorization: Bearer YOUR_TOKEN` header

### 404 Item Not Found
- **Cause**: Item ID doesn't exist
- **Solution**: Verify the item ID by calling `GET /api/items` first

### 409 Conflict
- **Cause**: Item already in wishlist (when adding)
- **Solution**: This is normal - item is already there. Use `GET /api/wishlist` to see it.

---

## 🎯 Features

✅ User-specific wishlists (each user has their own)  
✅ Prevents duplicate items  
✅ Returns full item details with wishlist  
✅ Timestamps for when items were added  
✅ Easy check if item is in wishlist  

---

That's it! Your wishlist API is ready to use! 🚀

