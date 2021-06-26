import { Request, Response } from 'express';
import { AppError } from '../error/AppError';
import { AuthenticateUserService } from '../services/AuthenticateUserService';
import * as yup from 'yup';

export class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { email, password } = request.body;

        const schema = yup.object().shape({
            email: yup.string().email().required(),
            password: yup.string().min(8).required()
        });

        const data = {
            email,
            password
        }

        try {
            await schema.validate(data, { abortEarly: false });
        } catch (err) {
            throw new AppError(err.errors, 401);
        }

        const authenticateUserService = new AuthenticateUserService();

        const token = await authenticateUserService.execute(data);

        return response.json(token);
    }
}