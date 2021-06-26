import { getCustomRepository } from "typeorm";
import { AppError } from "../error/AppError";
import { TagsRepositories } from "../repositories/TagsRepositories";

export class CreateTagService {
    async execute(name: string) {
        const tagsRepositories = getCustomRepository(TagsRepositories);

        if(!name) {
            throw new AppError("Incorrect name!");
        }

        const tagAlreadyExists = await tagsRepositories.findOne({
            name
        });

        if(tagAlreadyExists) {
            throw new AppError("Tag already exists!");
        }

        const tag = tagsRepositories.create({
            name
        });

        await tagsRepositories.save(tag);

        return tag;
    }
}