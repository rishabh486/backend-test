const express = require("express");
const { signup, login } = require("../controllers/authController");
const { validateSignup, validateLogin } = require("../middleware/validator");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", validateSignup, asyncHandler(signup));

// POST /api/auth/login
router.post("/login", validateLogin, asyncHandler(login));

module.exports = router;
