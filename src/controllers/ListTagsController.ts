import { Request, Response } from 'express';
import { ListTagsService } from '../services/ListTagsService';

export class ListTagsController {
    async handle(_request: Request, response: Response) {
        const listTagsService = new ListTagsService();

        const tags = await listTagsService.execute();

        return response.status(200).json(tags);
    }
}