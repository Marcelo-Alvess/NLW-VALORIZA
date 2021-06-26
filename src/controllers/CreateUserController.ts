import { Request, Response } from 'express';
import { CreateUserService } from '../services/CreateUserService';
import * as yup from 'yup';
import { AppError } from '../error/AppError';

export class CreateUserController {
    async handle(request: Request, response: Response) {
        const { name, email, admin, password } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required(),
            email: yup.string().email().required(),
            admin: yup.boolean().required(),
            password: yup.string().min(8).required()
        });

        const data = {
            name,
            email,
            admin,
            password
        }

        try {
            await schema.validate(data, { abortEarly: false });
        } catch (err) {
            throw new AppError(err.errors, 401);
        }

        const createUserService = new CreateUserService();

        const user = await createUserService.execute(data);

        return response.status(201).json(user);
    }
}