const express = require("express");

const app = express();

// ─── Body Parsers ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- KHAI BÁO CÁC ROUTES ĐÃ TẠO ----
app.use("/api/user", require("./modules/user/user.route"));
app.use("/api/review", require("./modules/review/review.route"));
app.use("/api/payment", require("./modules/payment/payment.route"));

app.use("/api/auth", require("./modules/auth/auth.route"));
app.use("/api/products", require("./modules/product/product.route"));
// -------------------------------------

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
