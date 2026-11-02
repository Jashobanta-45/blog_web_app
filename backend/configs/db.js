import mongoose from "mongoose";

const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is missing. Add it to the Vercel backend service environment variables.");
    }

    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        mongoose.connection.on("error", (error) => {
            console.error("MongoDB connection error:", error.message);
        });

        await mongoose.connect(mongoUri, {
            dbName: "blog",
            serverSelectionTimeoutMS: 10000
        });
    } catch (error) {
        console.error("MongoDB startup connection failed:", error.message);
        throw error;
    }
};

export default connectDB;
