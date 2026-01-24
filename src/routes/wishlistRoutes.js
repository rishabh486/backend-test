const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");
const {
  validateAddToWishlist,
  validateWishlistItemId,
  validatePagination,
} = require("../middleware/validator");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// POST /api/wishlist - Add item to wishlist
router.post("/", validateAddToWishlist, asyncHandler(addToWishlist));

// GET /api/wishlist - Get wishlist (with pagination)
router.get("/", validatePagination, asyncHandler(getWishlist));

// DELETE /api/wishlist/:itemId - Remove item from wishlist
router.delete(
  "/:itemId",
  validateWishlistItemId,
  asyncHandler(removeFromWishlist)
);

// GET /api/wishlist/check/:itemId - Check if item is in wishlist
router.get(
  "/check/:itemId",
  validateWishlistItemId,
  asyncHandler(checkWishlist)
);

module.exports = router;
