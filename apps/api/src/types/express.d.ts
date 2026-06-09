import 'express';
import { Role } from '@prisma/client';

declare module 'express-serve-static-core' {
    export interface Request {
        user?: {
            id: string;
            role: Role;
        };
    }
}
