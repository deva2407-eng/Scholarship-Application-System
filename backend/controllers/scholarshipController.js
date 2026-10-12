const Scholarship = require("../models/Scholarship");


// =========================================================
// GET ALL SCHOLARSHIPS
// =========================================================

const getScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find()
            .sort({ deadline: 1 });

        res.status(200).json({
            count: scholarships.length,
            scholarships
        });

    } catch (error) {
        console.error(
            "Get scholarships error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch scholarships."
        });
    }
};


// =========================================================
// GET SINGLE SCHOLARSHIP
// =========================================================

const getScholarshipById = async (req, res) => {
    try {
        const scholarship =
            await Scholarship.findById(req.params.id);

        if (!scholarship) {
            return res.status(404).json({
                message: "Scholarship not found."
            });
        }

        res.status(200).json({
            scholarship
        });

    } catch (error) {
        console.error(
            "Get scholarship error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch scholarship."
        });
    }
};


// =========================================================
// CREATE SCHOLARSHIP
// ADMIN ONLY
// =========================================================

const createScholarship = async (req, res) => {
    try {
        const {
            title,
            provider,
            imageUrl,
            category,
            description,
            amount,
            eligibility,
            minGpa,
            deadline,
            requiredDocuments,
            applicationInstructions,
            status
        } = req.body;


        if (
            !title ||
            !provider ||
            !description ||
            amount === undefined ||
            !eligibility ||
            minGpa === undefined ||
            !deadline
        ) {
            return res.status(400).json({
                message:
                    "Please provide all required scholarship fields."
            });
        }


        const scholarship =
            await Scholarship.create({
                title,
                provider,
                imageUrl: imageUrl || "",
                category: category || "Academic",
                description,
                amount,
                eligibility,
                minGpa,
                deadline,
                requiredDocuments:
                    Array.isArray(requiredDocuments)
                        ? requiredDocuments
                        : [],
                applicationInstructions:
                    applicationInstructions || "",
                status: status || "open"
            });


        res.status(201).json({
            message:
                "Scholarship created successfully.",
            scholarship
        });

    } catch (error) {
        console.error(
            "Create scholarship error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create scholarship."
        });
    }
};


// =========================================================
// UPDATE SCHOLARSHIP
// ADMIN ONLY
// =========================================================

const updateScholarship = async (req, res) => {
    try {
        const {
            title,
            provider,
            imageUrl,
            category,
            description,
            amount,
            eligibility,
            minGpa,
            deadline,
            requiredDocuments,
            applicationInstructions,
            status
        } = req.body;


        const scholarship =
            await Scholarship.findById(
                req.params.id
            );


        if (!scholarship) {
            return res.status(404).json({
                message:
                    "Scholarship not found."
            });
        }


        if (title !== undefined) {
            scholarship.title = title;
        }

        if (provider !== undefined) {
            scholarship.provider = provider;
        }

        if (imageUrl !== undefined) {
            scholarship.imageUrl = imageUrl;
        }

        if (category !== undefined) {
            scholarship.category = category;
        }

        if (description !== undefined) {
            scholarship.description =
                description;
        }

        if (amount !== undefined) {
            scholarship.amount = amount;
        }

        if (eligibility !== undefined) {
            scholarship.eligibility =
                eligibility;
        }

        if (minGpa !== undefined) {
            scholarship.minGpa = minGpa;
        }

        if (deadline !== undefined) {
            scholarship.deadline = deadline;
        }

        if (requiredDocuments !== undefined) {
            scholarship.requiredDocuments =
                Array.isArray(requiredDocuments)
                    ? requiredDocuments
                    : [];
        }

        if (
            applicationInstructions !==
            undefined
        ) {
            scholarship.applicationInstructions =
                applicationInstructions;
        }

        if (status !== undefined) {
            scholarship.status = status;
        }


        await scholarship.save();


        res.status(200).json({
            message:
                "Scholarship updated successfully.",
            scholarship
        });

    } catch (error) {
        console.error(
            "Update scholarship error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update scholarship."
        });
    }
};


// =========================================================
// DELETE SCHOLARSHIP
// ADMIN ONLY
// =========================================================

const deleteScholarship = async (req, res) => {
    try {
        const scholarship =
            await Scholarship.findById(
                req.params.id
            );


        if (!scholarship) {
            return res.status(404).json({
                message:
                    "Scholarship not found."
            });
        }


        await scholarship.deleteOne();


        res.status(200).json({
            message:
                "Scholarship deleted successfully."
        });

    } catch (error) {
        console.error(
            "Delete scholarship error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete scholarship."
        });
    }
};


module.exports = {
    getScholarships,
    getScholarshipById,
    createScholarship,
    updateScholarship,
    deleteScholarship
};