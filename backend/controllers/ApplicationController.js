const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");
const User = require("../models/User");
const fs = require("fs");

/*
==================================================
STUDENT — APPLY FOR SCHOLARSHIP
==================================================
*/

const applyForScholarship = async (req, res) => {
    try {
        if (req.user.role !== "student") {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(403).json({
                message: "Only students can apply for scholarships."
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Supporting document is required."
            });
        }

        const student = await User.findById(req.user.userId);

        if (!student) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                message: "Student not found."
            });
        }

        const scholarship = await Scholarship.findById(
            req.params.id
        );

        if (!scholarship) {
            fs.unlinkSync(req.file.path);

            return res.status(404).json({
                message: "Scholarship not found."
            });
        }

        if (scholarship.status !== "open") {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message: "This scholarship is currently closed."
            });
        }

        if (new Date() > scholarship.deadline) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message:
                    "The scholarship application deadline has passed."
            });
        }

        if (student.gpa < scholarship.minGpa) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message:
                    `You are not eligible. Minimum GPA required is ${scholarship.minGpa}, but your GPA is ${student.gpa}.`
            });
        }

        const existingApplication = await Application.findOne({
            student: student._id,
            scholarship: scholarship._id
        });

        if (existingApplication) {
            fs.unlinkSync(req.file.path);

            return res.status(400).json({
                message:
                    "You have already applied for this scholarship."
            });
        }

        /*
        IMPORTANT:
        req.file.path = physical path on the computer.
        We should NOT save that path in MongoDB because
        the browser cannot use a computer filesystem path.

        Instead, save the web-accessible relative path.
        */

        const documentWebPath =
            `uploads/documents/${req.file.filename}`;

        const application = await Application.create({
            student: student._id,
            scholarship: scholarship._id,

            document: {
                filename: req.file.filename,

                // Browser-accessible path
                path: documentWebPath,

                mimetype: req.file.mimetype
            },

            status: "pending"
        });

        res.status(201).json({
            message:
                "Scholarship application submitted successfully!",

            application: {
                id: application._id,
                scholarship: scholarship.title,
                student: student.name,
                status: application.status,
                document: application.document.filename
            }
        });

    } catch (error) {
        console.error(
            "Application submission error:",
            error.message
        );

        /*
        req.file.path is still the REAL physical
        filesystem location, so it is correct to use
        it here when cleaning up an uploaded file.
        */

        if (req.file) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (fileError) {
                console.error(
                    "Error deleting uploaded file:",
                    fileError.message
                );
            }
        }

        res.status(500).json({
            message:
                "Server error while submitting application."
        });
    }
};


/*
==================================================
STUDENT — GET MY APPLICATIONS
==================================================
*/

const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            student: req.user.userId
        })
            .populate(
                "scholarship",
                "title amount deadline status minGpa"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "Get applications error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


/*
==================================================
ADMIN — GET ALL APPLICATIONS
==================================================
*/

const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .populate(
                "student",
                "name email gpa"
            )
            .populate(
                "scholarship",
                "title amount deadline minGpa status"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: applications.length,
            applications
        });

    } catch (error) {
        console.error(
            "Get all applications error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


/*
==================================================
ADMIN — UPDATE APPLICATION STATUS
==================================================
*/

const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "pending",
            "approved",
            "rejected"
        ];

        if (
            !status ||
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message:
                    "Invalid status. Use pending, approved or rejected."
            });
        }

        const application =
            await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({
                message: "Application not found."
            });
        }

        application.status = status;

        await application.save();

        const updatedApplication =
            await Application.findById(application._id)
                .populate(
                    "student",
                    "name email gpa"
                )
                .populate(
                    "scholarship",
                    "title amount deadline minGpa status"
                );

        res.status(200).json({
            message:
                `Application status updated to ${status}.`,

            application: updatedApplication
        });

    } catch (error) {
        console.error(
            "Update application status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    applyForScholarship,
    getMyApplications,
    getAllApplications,
    updateApplicationStatus
};