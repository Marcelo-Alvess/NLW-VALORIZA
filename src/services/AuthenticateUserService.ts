import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AppError } from "../error/AppError";

interface IAuthenticateRequest {
    email: string;
    password: string;
}

export class AuthenticateUserService {
    
    
    async execute({ email, password }: IAuthenticateRequest) {
        const usersRepositories = getCustomRepository(UsersRepositories);

        const user = await usersRepositories.findOne({
            email
        });

        if(!user) {
            throw new AppError("Email/Password incorrect", 401);
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch) {
            throw new AppError("Email/Password incorrect", 401);
        }

        const token = sign({
            email: user.email
        }, "ff3e804d698c54d98c6c8aac66b5fc72", {
            subject: user.id,
            expiresIn: "1d"
        })

        return token;
    }
}