const express = require("express");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
    applyForScholarship,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();


/*
==================================================
STUDENT ROUTES
==================================================
*/

// Student applies for a scholarship
router.post(
    "/scholarships/:id/apply",
    protect,
    upload.single("document"),
    applyForScholarship
);


// Student views their own applications
router.get(
    "/applications/my",
    protect,
    authorizeRoles("student"),
    getMyApplications
);


/*
==================================================
ADMIN ROUTES
==================================================
*/

// Admin views all student applications
router.get(
    "/applications",
    protect,
    authorizeRoles("admin"),
    getAllApplications
);


// Admin approves/rejects an application
router.patch(
    "/applications/:id/status",
    protect,
    authorizeRoles("admin"),
    updateApplicationStatus
);


module.exports = router;