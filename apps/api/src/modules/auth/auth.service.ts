import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { EmailError } from '../../shared/errors/emailError';
import { NotFoundError } from '../../shared/errors/notFoundError';
import { ValidationError } from '../../shared/errors/validationError';
import { sendEmail } from '../../shared/lib/mailer';
import otpTemplate from '../../shared/templates/otpEmail';
import { tokens } from './../../shared/lib/token';
import { IAuthRepository } from './auth.interface';
import {
    LoginDto,
    LoginResponseDto,
    RegisterDto,
    RegisterResponseDto,
    VerifyOtpDto,
    VerifyOtpResponseDto,
} from './auth.types';

export class AuthService {
    constructor(private readonly authRepository: IAuthRepository) {}

    public async register(dto: RegisterDto): Promise<RegisterResponseDto> {
        const { firstName, lastName, username, email, password } = dto;

        const { otp, otpHashed, hashedIdentifier, identifier } =
            await this.createOtp();

        const content = otpTemplate(otp, firstName);

        const subject = 'Your OTP for TeamPulse Email Verification';

        const existingUser = await this.authRepository.findByEmail(email);
        if (existingUser && existingUser.isEmailVerified) {
            throw new ValidationError('User with this email already exists');
        }

        let emailStatus: boolean;

        if (existingUser && !existingUser.isEmailVerified) {
            await this.authRepository.upsertOtp({
                otpHashed,
                hashedIdentifier,
                userId: existingUser.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 10),
            });

            emailStatus = await this.sendOtpEmail(
                existingUser.email,
                subject,
                content
            );

            if (!emailStatus) {
                throw new EmailError(
                    'Failed to send email. Please try again after sometime...'
                );
            }

            return { hashedIdentifier };
        }

        const existingUsername =
            await this.authRepository.findByUsername(username);

        if (existingUsername)
            throw new ValidationError('Username already exists!!!');

        const hashedPassword = await this.hashPassword(password);

        const user = await this.authRepository.create({
            firstName,
            lastName,
            username,
            email,
            hashedPassword,
        });

        await this.authRepository.upsertOtp({
            otpHashed,
            hashedIdentifier,
            userId: user.id,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        });

        emailStatus = await this.sendOtpEmail(email, subject, content);

        if (!emailStatus) {
            throw new EmailError('Failed to send OTP email');
        }

        return { hashedIdentifier };
    }

    public async verifyEmail(dto: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
        const { otp, hashedIdentifier } = dto;

        const otpRecord =
            await this.authRepository.findOtpByIdentifier(hashedIdentifier);

        if (!otpRecord || otpRecord.expiresAt < new Date()) {
            throw new ValidationError('OTP has expired or is invalid');
        }

        const isOtpValid = await bcrypt.compare(otp, otpRecord.otpHashed);
        if (!isOtpValid) {
            throw new ValidationError('Invalid OTP');
        }

        await this.authRepository.verifyUser(otpRecord.userId);

        const user = await this.authRepository.findById(otpRecord.userId);

        if (!user) throw new NotFoundError('User not Found');

        await this.authRepository.deleteOtp(hashedIdentifier);

        const { accessToken, refreshToken } = await this.generateToken(
            otpRecord.userId
        );

        return {
            username: user.username,
            email: user.email,
            accessToken,
            refreshToken,
        };
    }

    public async login(dto: LoginDto): Promise<LoginResponseDto> {
        const { email, password } = dto;

        const existingUser = await this.authRepository.findByEmail(email);
        if (!existingUser) throw new NotFoundError('User not found');

        const isValidPassword = await bcrypt.compare(
            password,
            existingUser.hashedPassword
        );

        if (!isValidPassword)
            throw new ValidationError('Incorrect Credentials');

        if (!existingUser.isEmailVerified)
            throw new ValidationError(
                'Email not verified. Please verify it...'
            );

        const { accessToken, refreshToken } = await this.generateToken(
            existingUser.id
        );

        return { accessToken, refreshToken };
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

    private async generateToken(
        userId: string
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const { accessToken, refreshToken } = tokens(userId);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async createOtp(): Promise<{
        otp: string;
        otpHashed: string;
        hashedIdentifier: string;
        identifier: string;
    }> {
        const otp = this.generateOtp();
        const { hashedIdentifier, identifier } = this.hashIdentifier();
        const otpHashed = await this.hashOtp(otp);

        return { otp, otpHashed, hashedIdentifier, identifier };
    }
}
