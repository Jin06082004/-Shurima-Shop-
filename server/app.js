const express = require("express");

const app = express();

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- KHAI BÁO CÁC ROUTES ĐÃ TẠO ----
app.use("/api/auth", require("./modules/auth/auth.route"));
app.use("/api/products", require("./modules/product/product.route"));
app.use("/api/brands", require("./modules/brand/brand.routes"));
app.use("/api/variants", require("./modules/product/variant.route"));
app.use("/api/categories", require("./modules/category/category.routes"));

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        env: process.env.NODE_ENV || "development"
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
