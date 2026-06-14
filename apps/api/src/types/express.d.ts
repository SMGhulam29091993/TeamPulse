import 'express';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: {
            id: string;
            jti: string;
        };
    }
}
