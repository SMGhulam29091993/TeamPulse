import { IAuthRepository } from './auth.interface';
import { RegisterDto, RegisterResponseDto } from './auth.types';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import otpTemplate from '../../shared/templates/otpEmail';
import { ValidationError } from '../../shared/errors/validationError';
import { EmailError } from '../../shared/errors/emailError';
import { sendEmail } from '../../shared/lib/mailer';

export class AuthService {
    constructor(private readonly authRepository: IAuthRepository) {}

    public async register(dto: RegisterDto): Promise<RegisterResponseDto> {
        const { firstName, lastName, username, email, password } = dto;

        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser) {
            throw new ValidationError('User with this email already exists');
        }

        const hashedPassword = await this.hashPassword(password);

        const user = await this.authRepository.create({
            firstName,
            lastName,
            username,
            email,
            hashedPassword,
        });

        const otp = this.generateOtp();
        const { hashedIdentifier, identifier } = this.hashIdentifier();
        const otpHashed = await this.hashOtp(otp);

        await this.authRepository.upsertOtp({
            otpHashed,
            hashedIdentifier,
            userId: user.id,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        const content = otpTemplate(otp, firstName);

        const subject = 'Your OTP for TeamPulse Email Verification';
        const emailStatus = await this.sendOtpEmail(email, subject, content);

        if (!emailStatus) {
            throw new EmailError('Failed to send OTP email');
        }

        return { identifier };
    }

    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private generateOtp(): string {
        return crypto.randomInt(100000, 999999).toString();
    }

    private hashIdentifier(): {
        hashedIdentifier: string;
        identifier: string;
    } {
        const identifier = crypto.randomBytes(16).toString('hex');
        const hashedIdentifier = crypto
            .createHash('sha256')
            .update(identifier)
            .digest('hex');

        return { hashedIdentifier, identifier };
    }

    private async hashOtp(otp: string): Promise<string> {
        return await bcrypt.hash(otp, 10);
    }

    private async sendOtpEmail(
        email: string,
        subject: string,
        content: string
    ): Promise<boolean> {
        try {
            await sendEmail(email, subject, content);
            return true;
        } catch (error) {
            console.error('Failed to send OTP email', error);
            return false;
        }
    }
}
