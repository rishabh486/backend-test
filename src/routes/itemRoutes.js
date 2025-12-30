const express = require("express");
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  uploadImage,
} = require("../controllers/itemController");

const router = express.Router();

// GET /api/items - Get all items
router.get("/", getAllItems);

// GET /api/items/:id - Get single item
router.get("/:id", getItemById);

// POST /api/items - Create new item (with image upload)
router.post("/", uploadImage, createItem);

// PUT /api/items/:id - Update item (with optional image upload)
router.put("/:id", uploadImage, updateItem);

// DELETE /api/items/:id - Delete item
router.delete("/:id", deleteItem);

module.exports = router;

