import { AppError } from './appError';

export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
    }
}
