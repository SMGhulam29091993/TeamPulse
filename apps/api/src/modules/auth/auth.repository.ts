import { IAuthRepository } from './auth.interface';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserDto, OtpDto } from './auth.types';

export class AuthRepository implements IAuthRepository {
    constructor(private readonly prisma: PrismaClient) {}

    async findById(userId: string): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { id: userId } });
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { username } });
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
            where: { userId: payload.userId },
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
