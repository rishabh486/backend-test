const Item = require("../models/Item");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary (supports both CLOUDINARY_URL or separate variables)
if (process.env.CLOUDINARY_URL) {
  // Method 1: Single CLOUDINARY_URL variable (recommended by Cloudinary)
  cloudinary.config();
} else if (process.env.CLOUDINARY_CLOUD_NAME) {
  // Method 2: Three separate variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configure multer storage
// Option 1: Use Cloudinary if configured
let storage;
if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "backend-test-items",
      allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    },
  });
} else {
  // Option 2: Local storage (for development/testing)
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname +
          "-" +
          uniqueSuffix +
          "." +
          file.originalname.split(".").pop()
      );
    },
  });
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Middleware for single image upload
exports.uploadImage = upload.single("image");

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { name, description, rating, category, price } = req.body;

    if (
      !name ||
      !description ||
      rating === undefined ||
      !category ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Name, description, rating, category, and price are required.",
      });
    }

    const ratingNum = parseFloat(rating);
    if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return res.status(400).json({
        message: "Rating must be a number between 0 and 5.",
      });
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({
        message: "Price must be a positive number.",
      });
    }

    let imageUrl;

    // If file was uploaded
    if (req.file) {
      if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
        // Cloudinary upload - URL is in req.file.path or req.file.secure_url
        imageUrl = req.file.secure_url || req.file.path;
      } else {
        // Local file - construct full URL
        const baseUrl =
          process.env.BASE_URL ||
          `http://localhost:${process.env.PORT || 4000}`;
        imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
      }
    } else if (req.body.imageUrl) {
      // Accept imageUrl as string (alternative method)
      imageUrl = req.body.imageUrl;
    } else {
      return res.status(400).json({
        message: "Image is required. Provide either a file upload or imageUrl.",
      });
    }

    const newItem = await Item.create({
      name,
      description,
      imageUrl,
      rating: ratingNum,
      category,
      price: priceNum,
    });

    res.status(201).json({
      message: "Item created successfully",
      item: {
        id: newItem._id,
        name: newItem.name,
        description: newItem.description,
        imageUrl: newItem.imageUrl, // Full URL to the image
        rating: newItem.rating,
        category: newItem.category,
        price: newItem.price,
        createdAt: newItem.createdAt,
        updatedAt: newItem.updatedAt,
      },
    });
  } catch (err) {
    console.error("Create item error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get all items with pagination
exports.getAllItems = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({ message: "Page must be greater than 0." });
    }
    if (limit < 1 || limit > 100) {
      return res
        .status(400)
        .json({ message: "Limit must be between 1 and 100." });
    }

    // Get total count for pagination metadata
    const totalItems = await Item.countDocuments();

    // Get paginated items
    const items = await Item.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      items,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (err) {
    console.error("Get items error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json({ item });
  } catch (err) {
    console.error("Get item error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update item
exports.updateItem = async (req, res) => {
  try {
    const { name, description, rating, imageUrl, category, price } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (rating !== undefined) {
      const ratingNum = parseFloat(rating);
      if (isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
        return res.status(400).json({
          message: "Rating must be a number between 0 and 5.",
        });
      }
      updateData.rating = ratingNum;
    }
    if (price !== undefined) {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum < 0) {
        return res.status(400).json({
          message: "Price must be a positive number.",
        });
      }
      updateData.price = priceNum;
    }

    // Handle image update
    if (req.file) {
      if (process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME) {
        updateData.imageUrl = req.file.secure_url || req.file.path;
      } else {
        updateData.imageUrl = `/uploads/${req.file.filename}`;
      }
    } else if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const item = await Item.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    res.json({
      message: "Item updated successfully",
      item,
    });
  } catch (err) {
    console.error("Update item error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Delete item error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
