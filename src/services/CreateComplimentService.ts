import { getCustomRepository } from "typeorm";
import { AppError } from "../error/AppError";
import { ComplimentsRepositories } from "../repositories/ComplimentsRepositories";
import { TagsRepositories } from "../repositories/TagsRepositories";
import { UsersRepositories } from "../repositories/UsersRepositories";

interface IComplimentRequest {
    tag_id: string;
    user_sender: string;
    user_receiver: string;
    message: string;
}

export class CreateComplimentService {
    
    async execute({ tag_id, user_receiver, user_sender, message }: IComplimentRequest) {
        const complimentsRepositories = getCustomRepository(ComplimentsRepositories);
        const usersRepositories = getCustomRepository(UsersRepositories);
        const tagsRepositories = getCustomRepository(TagsRepositories);
        
        const userReceiverExists = await usersRepositories.findOne(user_receiver);
        const tagExists = await tagsRepositories.findOne(tag_id);
        
        if(!userReceiverExists) {
            throw new AppError("User Receiver does not exists");
        }

        if(!tagExists) {
            throw new AppError("Tag does not exists");
        }

        if(user_sender === user_receiver) {
            throw new AppError("Incorrect User Receiver", 401);
        }

        const compliment = complimentsRepositories.create({
            tag_id,
            user_receiver,
            user_sender,
            message
        });

        await complimentsRepositories.save(compliment);

        return compliment;
    }
}