const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        provider: {
            type: String,
            required: true,
            trim: true
        },

        imageUrl: {
            type: String,
            default: "",
            trim: true
        },

        category: {
            type: String,
            default: "Academic",
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        eligibility: {
            type: String,
            required: true,
            trim: true
        },

        minGpa: {
            type: Number,
            required: true,
            min: 0,
            max: 10
        },

        deadline: {
            type: Date,
            required: true
        },

        requiredDocuments: {
            type: [String],
            default: []
        },

        applicationInstructions: {
            type: String,
            default: "",
            trim: true
        },

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Scholarship",
    scholarshipSchema
);