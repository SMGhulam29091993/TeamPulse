import { JWTError } from './../errors/jwtError';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/appError';
import * as jwt from 'jsonwebtoken';
import { config } from '../../config/env-config';

export class AuthMiddleware {
    public static async authenticate(
        req: Request,
        _res: Response,
        next: NextFunction
    ) {
        // Implement your authentication logic here
        const authHeader = req.headers?.authorization?.split(' ')[1];
        if (!authHeader) {
            throw new JWTError('No token provided...');
        }

        // Verify the token and extract user information
        const user = await AuthMiddleware.verifyToken(authHeader, req);

        // Attach user information to the request object
        req.user = user;

        next();
    }

    private static async verifyToken(token: string, req: Request) {
        // Implement your token verification logic here
        const tokenDecoded = jwt.verify(token, config.jwtSecret) as {
            id: string;
            jti: string;
        };

        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new JWTError('Unauthorized Token...');
        }

        const refreshTokenDecoded = jwt.verify(
            refreshToken,
            config.refreshJWTSecret
        ) as {
            id: string;
            jti: string;
        };

        if (tokenDecoded.jti !== refreshTokenDecoded.jti) {
            throw new JWTError('Session Over...');
        }
        if (tokenDecoded.id !== refreshTokenDecoded.id) {
            throw new JWTError('Unauthorized user...');
        }

        return { id: tokenDecoded.id };
    }
}
