import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (): Promise<void> => {
    const conn = await mongoose.connect(env.MONGO_URI, {
        connectTimeoutMS: 10_000,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 45_000,
        maxPoolSize: 10,
        minPoolSize: 1,
        retryWrites: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
};
