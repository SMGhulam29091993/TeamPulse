import { OtpVerification, User } from '@prisma/client';
import { CreateUserDto, OtpDto } from './auth.types';

export interface IAuthRepository {
    findById(userId: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    create(user: CreateUserDto): Promise<User>;
    verifyUser(userId: string): Promise<void>;
    upsertOtp(payload: OtpDto): Promise<void>;
    findOtpByIdentifier(
        hashedIdentifier: string
    ): Promise<OtpVerification | null>;
    deleteOtp(hashedIdentifier: string): Promise<void>;
}
