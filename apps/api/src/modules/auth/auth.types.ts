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
