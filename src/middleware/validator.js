const { body, param, query, validationResult } = require("express-validator");

// Validation result handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validation rules
const validateSignup = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

const validateLogin = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

// Item validation rules
const validateCreateItem = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 1, max: 200 })
    .withMessage("Name must be between 1 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 1, max: 2000 })
    .withMessage("Description must be between 1 and 2000 characters"),
  body("rating")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5"),
  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Category must be between 1 and 100 characters"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  handleValidationErrors,
];

const validateUpdateItem = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Name must be between 1 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage("Description must be between 1 and 2000 characters"),
  body("rating")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be a number between 0 and 5"),
  body("category")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Category must be between 1 and 100 characters"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("imageUrl")
    .optional()
    .isURL()
    .withMessage("Image URL must be a valid URL"),
  handleValidationErrors,
];

const validateItemId = [
  param("id")
    .isMongoId()
    .withMessage("Invalid item ID format"),
  handleValidationErrors,
];

// Wishlist validation rules
const validateAddToWishlist = [
  body("itemId")
    .isMongoId()
    .withMessage("Invalid item ID format"),
  handleValidationErrors,
];

const validateWishlistItemId = [
  param("itemId")
    .isMongoId()
    .withMessage("Invalid item ID format"),
  handleValidationErrors,
];

// Pagination validation
const validatePagination = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
  query("itemsPerPage")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Items per page must be between 1 and 100"),
  handleValidationErrors,
];

module.exports = {
  validateSignup,
  validateLogin,
  validateCreateItem,
  validateUpdateItem,
  validateItemId,
  validateAddToWishlist,
  validateWishlistItemId,
  validatePagination,
  handleValidationErrors,
};

