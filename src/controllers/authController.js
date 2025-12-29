const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-env";
const JWT_EXPIRES_IN = "7d";

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email: email.toLowerCase(),
      passwordHash: hashed,
    });

    const token = createToken(newUser);

    res.status(201).json({
      user: { id: newUser._id, email: newUser.email },
      token,
    });
  } catch (err) {
    console.error("Signup error", err);

    // Duplicate key error (e.g., race condition on email)
    if (err.code === 11000) {
      return res.status(409).json({ message: "User already exists." });
    }

    res.status(500).json({ message: "Internal server error." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = createToken(user);

    res.json({
      user: { id: user._id, email: user.email },
      token,
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({ message: "Internal server error." });
  }
};
