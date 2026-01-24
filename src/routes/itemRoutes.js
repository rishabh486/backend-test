const express = require("express");
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  uploadImage,
} = require("../controllers/itemController");
const {
  validateCreateItem,
  validateUpdateItem,
  validateItemId,
  validatePagination,
} = require("../middleware/validator");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// GET /api/items - Get all items (with pagination)
router.get("/", validatePagination, asyncHandler(getAllItems));

// GET /api/items/:id - Get single item
router.get("/:id", validateItemId, asyncHandler(getItemById));

// POST /api/items - Create new item (with image upload)
router.post("/", uploadImage, validateCreateItem, asyncHandler(createItem));

// PUT /api/items/:id - Update item (with optional image upload)
router.put(
  "/:id",
  uploadImage,
  validateItemId,
  validateUpdateItem,
  asyncHandler(updateItem)
);

// DELETE /api/items/:id - Delete item
router.delete("/:id", validateItemId, asyncHandler(deleteItem));

module.exports = router;
