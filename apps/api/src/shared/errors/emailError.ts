import { AppError } from './appError';

export class EmailError extends AppError {
    constructor(message: string) {
        super(500, message);
        this.name = 'EmailError';
    }
}
