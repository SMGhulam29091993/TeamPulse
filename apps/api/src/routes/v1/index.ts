import express, { NextFunction, Request, Response } from 'express';
import authRoutes from '../../modules/auth/auth.route';

const route: express.Router = express.Router();

route.get('/', (_req: Request, res: Response, _next: NextFunction) => {
    res.send('Hello World!');
});
route.use('/auth', authRoutes);

export default route;
