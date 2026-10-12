const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        scholarship: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Scholarship",
            required: true
        },

        document: {
            filename: {
                type: String,
                required: true
            },

            path: {
                type: String,
                required: true
            },

            mimetype: {
                type: String,
                required: true
            }
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        },

        appliedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, scholarship: 1 },
    { unique: true }
);

module.exports = mongoose.model(
    "Application",
    applicationSchema
);