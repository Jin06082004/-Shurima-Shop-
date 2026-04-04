const express = require("express");

const app = express();

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────
const productRoutes = require('./modules/product/product.route');

app.use('/api/products', productRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    env: process.env.NODE_ENV || "development",
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

module.exports = app;