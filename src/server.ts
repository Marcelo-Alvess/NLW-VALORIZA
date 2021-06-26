import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import { AppError } from './error/AppError';
import { router } from './routes';

import './database';

const app = express();

app.use(express.json());
app.use(router);
app.use((
    err: Error, 
    _request: Request, 
    response: Response, 
    _next: NextFunction
) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        });
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal Server Error ${err.message}`
    });
});

app.listen(3000, () => console.log('Server is Running...'));

