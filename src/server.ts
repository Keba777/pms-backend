import dotenv from 'dotenv';
import path from 'path';
import http from 'http';
import sequelize from './config/db';
import app from './app';

// Load environment variables
dotenv.config({
    path: path.join(__dirname, "../.env"),
});

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
        // Auto‑sync models (optional)
        if (process.env.NODE_ENV !== 'production') {
            console.log("Auto-migrating database schema...");

            // Log each model being synced for better visibility
            const models = sequelize.models;
            for (const modelName in models) {
                console.log(`[Sequelize Sync] Checking model: ${modelName}`);
            }

            await sequelize.sync({ alter: true, logging: (msg) => console.log(`[Sequelize Sync] ${msg}`) });
            console.log("Database schema synced.");
        }
    } catch (err) {
        console.error('Unable to connect to DB:', err);
        process.exit(1);
    }

    const server = http.createServer(app);

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

start();
