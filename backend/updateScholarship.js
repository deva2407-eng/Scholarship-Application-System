require("dotenv").config();

const mongoose = require("mongoose");
const Scholarship = require("./models/Scholarship");

const updateScholarship = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });

        console.log("Connected to MongoDB");

        const scholarship = await Scholarship.findOne({
            title: "Merit Scholarship 2026"
        });

        if (!scholarship) {
            console.log("Scholarship not found.");
            process.exit(0);
        }

        scholarship.minGpa = 8.0;

        await scholarship.save();

        console.log("Scholarship updated successfully!");
        console.log("Title:", scholarship.title);
        console.log("Minimum GPA:", scholarship.minGpa);

        process.exit(0);

    } catch (error) {
        console.error(
            "Error updating scholarship:",
            error.message
        );

        process.exit(1);
    }
};

updateScholarship();