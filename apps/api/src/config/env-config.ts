import dotenv from 'dotenv';

const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: envFile });

export const config = {
    port: Number.isFinite(Number(process.env.PORT))
        ? Number(process.env.PORT)
        : 3000,
    host: (process.env.HOST as string) ?? 'localhost',
};
