const Wishlist = require("../models/Wishlist");
const Item = require("../models/Item");

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required." });
    }

    // Check if item exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found." });
    }

    // Check if item is already in wishlist
    const existing = await Wishlist.findOne({
      item: itemId,
    });

    if (existing) {
      return res.status(409).json({
        message: "Item is already in wishlist.",
        wishlistItem: existing,
      });
    }

    // Add to wishlist (no user required)
    const wishlistItem = await Wishlist.create({
      item: itemId,
    });

    // Populate item details
    await wishlistItem.populate("item");

    res.status(201).json({
      message: "Item added to wishlist successfully",
      wishlistItem: {
        id: wishlistItem._id,
        item: wishlistItem.item,
        createdAt: wishlistItem.createdAt,
      },
    });
  } catch (err) {
    console.error("Add to wishlist error:", err);

    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ message: "Item is already in wishlist." });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};

// Get wishlist with pagination
exports.getWishlist = async (req, res) => {
  try {
    // Get pagination parameters from query string
    // Support both 'limit' and 'itemsPerPage' for backward compatibility
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = parseInt(req.query.itemsPerPage || req.query.limit) || 10;
    const skip = (page - 1) * itemsPerPage;

    // Validate pagination parameters
    if (page < 1) {
      return res.status(400).json({ message: "Page must be greater than 0." });
    }
    if (itemsPerPage < 1 || itemsPerPage > 100) {
      return res.status(400).json({ message: "Items per page must be between 1 and 100." });
    }

    // Get total count for pagination metadata
    const totalItems = await Wishlist.countDocuments();

    // Get paginated wishlist items with populated item details
    const wishlistItems = await Wishlist.find()
      .populate("item")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(itemsPerPage);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      wishlist: wishlistItems.map((w) => ({
        id: w._id,
        item: w.item,
        addedAt: w.createdAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required." });
    }

    // Find and delete the wishlist item
    const wishlistItem = await Wishlist.findOneAndDelete({
      item: itemId,
    });

    if (!wishlistItem) {
      return res.status(404).json({
        message: "Item not found in wishlist.",
      });
    }

    res.json({
      message: "Item removed from wishlist successfully",
    });
  } catch (err) {
    console.error("Remove from wishlist error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Check if item is in wishlist
exports.checkWishlist = async (req, res) => {
  try {
    const { itemId } = req.params;

    const wishlistItem = await Wishlist.findOne({
      item: itemId,
    });

    res.json({
      isInWishlist: !!wishlistItem,
      wishlistItem: wishlistItem || null,
    });
  } catch (err) {
    console.error("Check wishlist error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

