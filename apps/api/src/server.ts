import app from './app';
import { config } from './config/env-config';

const PORT = config.port;
const HOST = config.host;

const server = app.listen(Number(PORT), HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});

server.on('error', (err) => {
    console.error('Error starting server:', err);
    process.exit(1);
});
