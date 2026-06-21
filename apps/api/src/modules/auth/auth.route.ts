import express from 'express';
import prisma from '../../database/prisma.client';
import { asyncHandler } from '../../shared/utils/asyncHandler';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';

const authRepository = new AuthRepository(prisma);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const route: express.Router = express.Router();

route.post('/register', asyncHandler(authController.register));
route.post('/verify-email', asyncHandler(authController.verifyEmail));
route.post('/login', asyncHandler(authController.login));

export default route;
