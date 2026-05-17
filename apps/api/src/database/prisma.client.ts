import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'colors';

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
                connectionString: process.env.DATABASE_URL,
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
