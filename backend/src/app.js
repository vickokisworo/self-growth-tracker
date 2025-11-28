// backend/src/app.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoRoutes");
const progressRoutes = require("./routes/progressRoutes");
const habitRoutes = require("./routes/habitRoutes");
const goalRoutes = require("./routes/goalRoutes");
const journalRoutes = require("./routes/journalRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import middleware
const errorHandler = require("./middleware/errorHandler");

// Initialize express app
const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "*",
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Self Growth Tracker API",
    version: "1.0.0",
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
