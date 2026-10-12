
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            family: 4
        });

        console.log("Connected cluster:", mongoose.connection.host);
        console.log("Connected database:", mongoose.connection.name);
        console.log("MongoDB connected successfully!");

    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
