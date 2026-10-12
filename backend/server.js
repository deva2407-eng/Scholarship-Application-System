require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const protect = require("./middleware/authMiddleware");
const authorizeRoles = require("./middleware/roleMiddleware");

const app = express();

const PORT = 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api", applicationRoutes);

// ==========================================
// PROTECTED TEST ROUTES
// ==========================================

// Any authenticated user
app.get("/api/profile", protect, (req, res) => {
    res.status(200).json({
        message: "You accessed a protected route successfully!",
        user: req.user
    });
});


// Student-only route
app.get(
    "/api/student/dashboard",
    protect,
    authorizeRoles("student"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the student dashboard!",
            user: req.user
        });
    }
);


// Admin-only route
app.get(
    "/api/admin/dashboard",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the admin dashboard!",
            user: req.user
        });
    }
);


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.send("Scholarship Application System Backend is running!");
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});