import { NextFunction, Request, Response } from 'express';
import { cookieOptions } from '../../shared/lib/constants';
import { successResponse } from '../../shared/utils/response.util';
import { IAuthService } from './auth.interface';
import {
    LoginDto,
    LoginResponseDto,
    RegisterDto,
    VerifyOtpDto,
    VerifyOtpResponseDto,
} from './auth.types';
import { JWTError } from '../../shared/errors/jwtError';

export class AuthController {
    constructor(private readonly authService: IAuthService) {}

    register = async (req: Request, res: Response, _next: NextFunction) => {
        const { firstName, lastName, email, username, password } = req.body;
        const payload: RegisterDto = {
            firstName,
            lastName,
            username,
            email,
            password,
        };
        const registerResponse = await this.authService.register(payload);
        return successResponse(
            res,
            201,
            'Registration successful',
            registerResponse
        );
    };

    verifyEmail = async (req: Request, res: Response, _next: NextFunction) => {
        const { otp, identifier } = req.body;

        const payload: VerifyOtpDto = { otp, identifier };
        const verifyOtpResponse = await this.authService.verifyEmail(payload);
        const response: Partial<VerifyOtpResponseDto> = {
            username: verifyOtpResponse.username,
            email: verifyOtpResponse.email,
            accessToken: verifyOtpResponse.accessToken,
        };
        res.cookie(
            'refreshToken',
            verifyOtpResponse.refreshToken,
            cookieOptions
        );
        return successResponse(
            res,
            200,
            'Email verified successfully',
            response
        );
    };

    login = async (req: Request, res: Response, _next: NextFunction) => {
        const { email, password } = req.body;
        const payload: LoginDto = {
            email,
            password,
        };

        const { accessToken, refreshToken }: LoginResponseDto =
            await this.authService.login(payload);

        res.cookie('refreshToken', refreshToken, cookieOptions);

        return successResponse(res, 200, 'Login Successful.', { accessToken });
    };

    getMe = async (req: Request, res: Response, _next: NextFunction) => {
        const userId = req.user?.id;
        if (!userId) {
            throw new JWTError('User might not be authenticated.');
        }

        const user = await this.authService.getMe(userId);
        return successResponse(res, 200, 'User fetched successfully', user);
    };
}
