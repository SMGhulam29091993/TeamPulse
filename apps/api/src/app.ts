import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response, type Express } from 'express';
import { ErrorHandlerMiddleware } from './shared/middlewares/errorHandler.middleware';
import appRoutes from './routes/v1/index';

const app: Express = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
    origin: (
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void
    ) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/v1', appRoutes);

app.use(ErrorHandlerMiddleware.handleError);

export default app;
