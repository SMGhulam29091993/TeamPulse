import app from "./app";
import "colors";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '127.0.0.1';

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`.bgGreen);
});

server.on('error', (err) => {
    console.error('Error starting server:'.bgRed, err);
});
