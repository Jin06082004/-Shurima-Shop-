const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- KHAI BÁO CÁC ROUTES ĐÃ TẠO ----
app.use("/api/user", require("./modules/user/user.route"));
app.use("/api/review", require("./modules/review/review.route"));
app.use("/api/payment", require("./modules/payment/payment.route"));
// -------------------------------------

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "Server is running",
        env: process.env.NODE_ENV || "development"
    });
});

module.exports = app;