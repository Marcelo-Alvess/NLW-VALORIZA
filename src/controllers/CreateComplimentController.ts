import { Request, Response } from 'express';
import { CreateComplimentService } from "../services/CreateComplimentService";
import * as yup from 'yup';
import { AppError } from '../error/AppError';

export class CreateComplimentController {
    async handle(request: Request, response: Response) {
        const { tag_id, user_receiver, message } = request.body;
        const { user_id } = request;

        const schema = yup.object().shape({
            tag_id: yup.string().max(36).required(),
            user_receiver: yup.string().max(36).required(),
            message: yup.string().min(1).max(350).required()
        });

        const data = {
            tag_id,
            user_receiver,
            message
        }

        try {
            await schema.validate(data, { abortEarly: false });
        } catch (err) {
            throw new AppError(err.errors, 401);
        }

        const createComplimentService = new CreateComplimentService();

        const compliment = await createComplimentService.execute({
            ...data,
            user_sender: user_id
        });

        return response.status(201).json(compliment);
    }
}