import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { hash } from 'bcryptjs';
import { AppError } from "../error/AppError";

interface IUserRequest {
    name: string;
    email: string;
    admin?: boolean;
    password: string;
}

export class CreateUserService {
    async execute({ name, email, admin = false, password }: IUserRequest) {
        const usersRepository = getCustomRepository(UsersRepositories);

        if(!email) {
            throw new AppError("Email incorrect", 401);
        }

        const userAlreadyExists = await usersRepository.findOne({
            email,
        });
        
        if(userAlreadyExists) {
            throw new AppError("User already exists");
        }

        const passwordHash = await hash(password, 8);

        const user = usersRepository.create({
            name,
            email,
            admin,
            password: passwordHash
        })

        await usersRepository.save(user);

        return user
    }
}