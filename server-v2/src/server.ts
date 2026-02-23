import 'reflect-metadata';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

connectDB()
    .then(() => {
        app.listen(env.PORT, () => {
            console.log(`Server running on port ${env.PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });

process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err.message);
    process.exit(1);
});
