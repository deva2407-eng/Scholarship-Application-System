require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

const updateStudentGpa = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });

        console.log("Connected to MongoDB");

        const student = await User.findOneAndUpdate(
            {
                email: "demostudent@example.com"
            },
            {
                gpa: 8.5
            },
            {
                new: true
            }
        );

        if (!student) {
            console.log("Student not found.");
            return;
        }

        console.log("Student GPA updated successfully!");
        console.log("Student:", student.email);
        console.log("GPA:", student.gpa);

    } catch (error) {
        console.error(
            "Error updating GPA:",
            error.message
        );

    } finally {
        await mongoose.disconnect();
    }
};

updateStudentGpa();