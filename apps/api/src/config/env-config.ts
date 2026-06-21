import dotenv from 'dotenv';

const envFile =
    process.env.NODE_ENV === 'production' ? '.env' : '.env.development';
dotenv.config({ path: envFile });

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error('JWT Secret Is Required!!!');

const refreshJWTSecret = process.env.REFRESH_JWT_SECRET;
if (!refreshJWTSecret) throw new Error('Refresh JWT Secret Is Required!!!');

export const config = {
    port: Number.isFinite(Number(process.env.PORT))
        ? Number(process.env.PORT)
        : 3000,
    nodeEnv: process.env.NODE_ENV,
    host: (process.env.HOST as string) ?? 'localhost',
    dbUsername: (process.env.DB_USERNAME as string) ?? 'teamPulse',
    dbPassword: (process.env.DB_PASSWORD as string) ?? 'postgres',
    dbHost: (process.env.DB_HOST as string) ?? 'localhost',
    dbPort: Number.isFinite(Number(process.env.DB_PORT))
        ? Number(process.env.DB_PORT)
        : 5432,
    databaseUrl,
    // SMTP configuration for email sending
    smtpHost: (process.env.SMTP_HOST as string) ?? 'smtp.gmail.com',
    smtpPort: Number.isFinite(Number(process.env.SMTP_PORT))
        ? Number(process.env.SMTP_PORT)
        : 587,
    smtpUser: (process.env.SMTP_USER as string) ?? '',
    smtpPass: (process.env.SMTP_PASS as string) ?? '',
    //jwt secret
    jwtSecret,
    refreshJWTSecret,
    refreshMaxAge:
        Number(process.env.REFRESH_MAX_AGE) ?? 1000 * 60 * 60 * 24 * 7,
};
