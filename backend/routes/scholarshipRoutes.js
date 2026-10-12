const express = require("express");

const {
    createScholarship,
    getScholarships,
    getScholarshipById,
    updateScholarship,
    deleteScholarship
} = require("../controllers/scholarshipController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================================
// STUDENT + ADMIN
// GET ALL SCHOLARSHIPS
// ==========================================

router.get(
    "/",
    protect,
    authorizeRoles("student", "admin"),
    getScholarships
);


// ==========================================
// STUDENT + ADMIN
// GET SINGLE SCHOLARSHIP
// ==========================================

router.get(
    "/:id",
    protect,
    authorizeRoles("student", "admin"),
    getScholarshipById
);


// ==========================================
// ADMIN ONLY
// CREATE SCHOLARSHIP
// ==========================================

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createScholarship
);


// ==========================================
// ADMIN ONLY
// UPDATE SCHOLARSHIP
// ==========================================

router.put(
    "/:id",
    protect,
    authorizeRoles("admin"),
    updateScholarship
);


// ==========================================
// ADMIN ONLY
// DELETE SCHOLARSHIP
// ==========================================

router.delete(
    "/:id",
    protect,
    authorizeRoles("admin"),
    deleteScholarship
);


module.exports = router;