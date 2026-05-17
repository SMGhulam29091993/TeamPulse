import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'colors';
import { config } from '../config/env-config';

// Extend globalThis with a cached Prisma instance type.
const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

// Reuse the existing client if available (hot-reload/dev), otherwise create one.
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        // Prisma 7 "client" engine requires either an adapter or accelerate URL.
        adapter: new PrismaPg(
            new Pool({
                connectionString: config.databaseUrl,
                connectionTimeoutMillis: 5_000, // Optional: Set a connection timeout for faster failure in case of DB issues.
                idleTimeoutMillis: 10_000, // Optional: Close idle connections after a certain time to prevent resource leaks.
            })
        ),
        // Keep verbose query logs in development, but reduce noise in production.
        log:
            process.env.NODE_ENV === 'development'
                ? ['query', 'error', 'warn']
                : ['error'],
    });

// Cache the instance in non-production to avoid opening multiple DB connections.
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Attempt an eager connection once so startup logs show DB readiness clearly.
prisma
    .$connect()
    .then(() => {
        console.log('Connected to database successfully'.bgYellow);
    })
    .catch((error: unknown) => {
        console.error('Failed to connect to database'.bgRed, error);
    });

export default prisma;
