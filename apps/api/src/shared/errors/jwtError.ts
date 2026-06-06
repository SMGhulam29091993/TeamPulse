import { AppError } from './appError';

export class JWTError extends AppError {
    constructor(message: string) {
        super(401, message);
    }
}
