import dotenv from 'dotenv';

const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: envFile });

export const config = {
    port: Number.isFinite(Number(process.env.PORT))
        ? Number(process.env.PORT)
        : 3000,
    host: (process.env.HOST as string) ?? 'localhost',
    DB_USERNAME: (process.env.DB_USERNAME as string) ?? 'teamPulse',
    DB_PASSWORD: (process.env.DB_PASSWORD as string) ?? 'postgres',
    DB_HOST: (process.env.DB_HOST as string) ?? 'localhost',
    DB_PORT: Number.isFinite(Number(process.env.DB_PORT))
        ? Number(process.env.DB_PORT)
        : 5432,
    databaseUrl: (process.env.DATABASE_URL as string) ?? '',
};
