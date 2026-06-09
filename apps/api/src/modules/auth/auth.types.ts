export interface RegisterDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface RegisterResponseDto {
    hashedIdentifier: string;
}

export interface VerifyOtpDto {
    otp: string;
    hashedIdentifier: string;
}

export interface VerifyOtpResponseDto {
    username: string;
    email: string;
    accessToken: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface LoginResponseDto {
    accessToken: string;
}

export interface CreateUserDto {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    hashedPassword: string;
}

export interface OtpDto {
    otpHashed: string;
    hashedIdentifier: string;
    userId: string;
    expiresAt: Date;
}
