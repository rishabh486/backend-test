// Environment variable validation
require("dotenv").config();

const requiredEnvVars = ["MONGODB_URI"];

const optionalEnvVars = {
  PORT: 4000,
  NODE_ENV: "development",
  JWT_SECRET: "change-me-in-production",
  BASE_URL: "",
  CLOUDINARY_URL: "",
  CLOUDINARY_CLOUD_NAME: "",
  CLOUDINARY_API_KEY: "",
  CLOUDINARY_API_SECRET: "",
};

// Validate required environment variables
const validateEnv = () => {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((varName) => console.error(`   - ${varName}`));
    process.exit(1);
  }

  // Warn about missing JWT_SECRET in production
  if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
    console.warn("⚠️  WARNING: JWT_SECRET not set in production!");
  }

  // Warn about default JWT_SECRET
  if (process.env.JWT_SECRET === "change-me-in-production" || process.env.JWT_SECRET === "change-me-in-env") {
    console.warn("⚠️  WARNING: Using default JWT_SECRET. Change this in production!");
  }

  console.log("✅ Environment variables validated");
};

module.exports = { validateEnv };

