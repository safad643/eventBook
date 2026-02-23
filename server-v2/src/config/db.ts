import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async (): Promise<void> => {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
};
