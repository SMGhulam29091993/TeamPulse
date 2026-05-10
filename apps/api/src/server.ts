import app from "./app";
import "colors";
import dotenv from 'dotenv';
import { config } from "./config/env-config";

dotenv.config();

const PORT = config.port;
const HOST = config.host;

const server = app.listen(Number(PORT), HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`.bgGreen);
});

server.on('error', (err) => {
    console.error('Error starting server:'.bgRed, err);
});
