import mongoose, { connect } from "mongoose";


const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database Connected Successfully'));
        mongoose.connection.on('error', (err) => console.error('Database connection error:', err));

        await mongoose.connect(`${process.env.MONGODB_URI}/blog`, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        throw error; // Propagate error to prevent server from starting blindly
    }
}

export default connectDB;