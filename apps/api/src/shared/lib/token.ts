import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/env-config';

export const tokens = (
    userId: string
): { accessToken: string; refreshToken: string } => {
    const jti = sessionIdentifier();

    const accessToken = jwt.sign({ id: userId, jti }, config.jwtSecret, {
        expiresIn: '15m',
    });

    const refreshToken = jwt.sign(
        { id: userId, jti },
        config.refreshJWTSecret,
        {
            expiresIn: '7d',
        }
    );

    return { accessToken, refreshToken };
};

export const sessionIdentifier = (): string => {
    return crypto.randomBytes(16).toString('hex');
};
