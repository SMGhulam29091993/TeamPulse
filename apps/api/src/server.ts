import app from './app';
import { config } from './config/env-config';
import prisma from './database/prisma.client';

const PORT = config.port;
const HOST = config.host;

const server = app.listen(Number(PORT), HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Attempt an eager connection once so startup logs show DB readiness clearly.
// This is optional, but can help catch DB connection issues early and provide clearer logs.
void prisma
    .$connect()
    .then(() => {
        console.log('Connected to database successfully');
    })
    .catch((error: unknown) => {
        console.error('Failed to connect to database', error);
        process.exit(1); // Exit the process if the database connection fails, since the app likely can't function without it.
    });

server.on('error', (err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
