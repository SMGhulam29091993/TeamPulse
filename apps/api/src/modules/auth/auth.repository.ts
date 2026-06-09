import { IAuthRepository } from './auth.interface';
import { PrismaClient } from '@prisma/client';
import { CreateUserDto, OtpDto } from './auth.types';

export class AuthRepository implements IAuthRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async create(user: CreateUserDto) {
        return await this.prisma.user.create({ data: user });
    }

    async verifyUser(userId: string) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { isEmailVerified: true },
        });
    }

    async upsertOtp(payload: OtpDto) {
        const updatePayload = {
            otpHashed: payload.otpHashed,
            hashedIdentifier: payload.hashedIdentifier,
            expiresAt: payload.expiresAt,
        };
        await this.prisma.otpVerification.upsert({
            where: { hashedIdentifier: payload.hashedIdentifier },
            update: updatePayload,
            create: payload,
        });
    }

    async findOtpByIdentifier(hashedIdentifier: string) {
        return await this.prisma.otpVerification.findUnique({
            where: { hashedIdentifier },
        });
    }

    async deleteOtp(hashedIdentifier: string) {
        await this.prisma.otpVerification.delete({
            where: { hashedIdentifier },
        });
    }
}
