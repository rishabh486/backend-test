const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// POST /api/wishlist - Add item to wishlist
router.post("/", addToWishlist);

// GET /api/wishlist - Get user's wishlist
router.get("/", getWishlist);

// DELETE /api/wishlist/:itemId - Remove item from wishlist
router.delete("/:itemId", removeFromWishlist);

// GET /api/wishlist/check/:itemId - Check if item is in wishlist
router.get("/check/:itemId", checkWishlist);

module.exports = router;
