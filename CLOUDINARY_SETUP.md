# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image storage in your backend API.

---

## Step 1: Create a Cloudinary Account

1. Go to **https://cloudinary.com/users/register/free**
2. Sign up with your email (or use Google/GitHub login)
3. Verify your email if required
4. You'll be taken to your **Dashboard**

---

## Step 2: Get Your Cloudinary Credentials

1. In your Cloudinary Dashboard, you'll see your **Account Details** panel
2. You need these 3 values:

   - **Cloud Name** (e.g., `dxyz1234`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

3. **Important**: Click "Reveal" next to API Secret to see it (you'll only see it once, so copy it!)

---

## Step 3: Add Credentials to Your `.env` File

You have **two options** for configuring Cloudinary:

### Option 1: Single CLOUDINARY_URL (Recommended - Easier!)

In your Cloudinary Dashboard, you'll see a **"API Environment variable"** section. Copy the entire `CLOUDINARY_URL` string.

Add to your `.env` file:

```bash
# Your existing variables
MONGODB_URI="mongodb+srv://..."
JWT_SECRET="your-secret"

# Cloudinary Configuration (Method 1 - Single URL)
CLOUDINARY_URL=cloudinary://157249635342592:your-api-secret@dqge40zus
```

**Example:**

```bash
CLOUDINARY_URL=cloudinary://157249635342592:abcdefghijklmnopqrstuvwxyz123456@dqge40zus
```

### Option 2: Three Separate Variables

Alternatively, you can use three separate variables:

```bash
# Your existing variables
MONGODB_URI="mongodb+srv://..."
JWT_SECRET="your-secret"

# Cloudinary Configuration (Method 2 - Separate Variables)
CLOUDINARY_CLOUD_NAME=dqge40zus
CLOUDINARY_API_KEY=157249635342592
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

**Note:** Both methods work! Use whichever you prefer. The single `CLOUDINARY_URL` is simpler and recommended by Cloudinary.

---

## Step 4: Install Dependencies (if not already done)

```bash
npm install cloudinary multer-storage-cloudinary
```

---

## Step 5: Test Locally

1. Make sure your `.env` file has all Cloudinary credentials
2. Start your server:
   ```bash
   npm start
   ```
3. Test the image upload endpoint using Postman or curl:

   **Using Postman:**

   - Method: `POST`
   - URL: `http://localhost:4000/api/items`
   - Body: Select `form-data`
   - Add fields:
     - `name`: "Test Item"
     - `description`: "Testing Cloudinary"
     - `rating`: "4.5"
     - `image`: [Select a file]
   - Send

4. Check the response - you should see an `imageUrl` like:

   ```
   https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/backend-test-items/image-xyz.jpg
   ```

5. Open that URL in a browser - your image should display!

---

## Step 6: Add Credentials to Render (for Production)

1. Go to your Render dashboard: **https://dashboard.render.com**
2. Select your **Web Service** (backend-test-10us)
3. Go to **Environment** tab
4. Click **Add Environment Variable**

**If using CLOUDINARY_URL (Method 1):**

- Add one variable: `CLOUDINARY_URL` = `cloudinary://157249635342592:your-secret@dqge40zus`

**If using separate variables (Method 2):**

- Add 3 variables:
  - `CLOUDINARY_CLOUD_NAME` = your cloud name
  - `CLOUDINARY_API_KEY` = your API key
  - `CLOUDINARY_API_SECRET` = your API secret

5. Click **Save Changes**
6. Render will automatically redeploy your service

---

## Step 7: Verify It's Working on Production

1. After Render redeploys, test your production endpoint:
   ```bash
   POST https://backend-test-10us.onrender.com/api/items
   ```
2. Upload an image using the same method as local testing
3. Check the response - the `imageUrl` should be a Cloudinary URL
4. Open the URL - your image should be accessible from anywhere!

---

## How It Works

1. **When you upload an image:**

   - Your backend receives the file via `multer`
   - The file is automatically uploaded to Cloudinary
   - Cloudinary returns a permanent URL
   - That URL is stored in your MongoDB database

2. **Image Storage:**

   - Images are stored in Cloudinary's cloud (not on your server)
   - They're organized in a folder: `backend-test-items/`
   - URLs are permanent and publicly accessible

3. **Benefits:**
   - ✅ No storage limits on your server
   - ✅ Automatic image optimization
   - ✅ CDN delivery (fast loading worldwide)
   - ✅ Free tier: 25GB storage, 25GB bandwidth/month

---

## Troubleshooting

### Error: "Invalid API credentials"

- Double-check your `.env` file has all 3 variables
- Make sure there are no extra spaces or quotes
- Restart your server after adding env vars

### Error: "File too large"

- Cloudinary free tier allows up to 10MB per file
- Your code limits to 5MB (configurable in `itemController.js`)

### Images not uploading

- Check your server logs for errors
- Verify Cloudinary credentials are correct
- Make sure you're using `multipart/form-data` (not `application/json`)

### Images work locally but not on Render

- Make sure you added the 3 Cloudinary env vars to Render
- Check Render's environment variables section
- Redeploy after adding env vars

---

## Cloudinary Dashboard Features

Once set up, you can:

- View all uploaded images in the **Media Library**
- See storage usage and bandwidth
- Transform images on-the-fly (resize, crop, filters)
- Generate different image formats automatically

---

## Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000/month
- **Upload size**: 10 MB per file

For most projects, this is plenty! Upgrade only if you need more.

---

## Security Note

⚠️ **Never commit your `.env` file to Git!**

Your `.env` file should already be in `.gitignore`. Always keep your API Secret private.

---

## Need Help?

- Cloudinary Docs: https://cloudinary.com/documentation
- Cloudinary Support: https://support.cloudinary.com
