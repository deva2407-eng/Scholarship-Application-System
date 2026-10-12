require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });

        console.log("Connected to MongoDB");

        const adminEmail = "admin@example.com";
        const adminPassword = "Admin12345";

        // Check whether admin already exists
        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            adminPassword,
            10
        );

        // Create admin
        const admin = await User.create({
            name: "System Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "admin"
        });

        console.log("Admin created successfully!");
        console.log("Email:", admin.email);
        console.log("Role:", admin.role);

        process.exit(0);

    } catch (error) {
        console.error(
            "Error creating admin:",
            error.message
        );

        process.exit(1);
    }
};

createAdmin();