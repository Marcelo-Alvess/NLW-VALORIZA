import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface IPayload {
    sub: string;
}

export function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
) {
    const authToken = request.headers.authorization;

    if(!authToken) {
        return response.status(401).end();
    }

    const [, token] = authToken.split(" ");

    try {
        const { sub } = verify(token, "ff3e804d698c54d98c6c8aac66b5fc72") as IPayload;
        
        request.user_id = sub;
        
        return next();
    } catch (err) {
        return response.status(401).end();
    }

}