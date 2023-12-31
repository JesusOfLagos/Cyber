import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IRateLimiter {
    windowMs: number,
    max: number,
    message?: string,
    statusCode?: number
}

export interface IRateLimiterWithMessage extends IRateLimiter {
    message: string
}

export interface IRateLimiterWithMessageAndStatusCode extends IRateLimiterWithMessage {
    statusCode: number
}

export interface IRateLimiterWithMessageAndStatusCodeAndHandler extends IRateLimiterWithMessageAndStatusCode {
    handler: any
}


export interface TokenUser {
    id: string,
    email: string,
    role: string
}

export interface IToken {
    token: string,
    expiresIn: number
}

export interface AuthenticatedRequest extends Request {
    user: TokenUser
}

export interface ITokenRequest extends Request {
    token: string
}

// export class TokenManage {
//     public static generateToken(user: TokenUser): IToken {
//         const token = jwt.sign(user, process.env.JWT_SECRET, {
//             expiresIn: process.env.JWT_EXPIRES_IN
//         });

//         return {
//             token,
//             expiresIn: process.env.JWT_EXPIRES_IN as unknown as number
//         };
//     }

//     public static verifyToken(token: string): TokenUser {
//         return jwt.verify(token, process.env.JWT_SECRET) as TokenUser;
//     }

//     public static decodeToken(token: string): TokenUser {
//         return jwt.decode(token) as TokenUser;
//     }

//     public static getTokenFromHeader(req: Request): string | null {
//         if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//             return req.headers.authorization.split(' ')[1];
//         }

//         return null;
//     }

//     public static getTokenFromCookie(req: Request): string | null {
//         if (req.cookies && req.cookies.token) {
//             return req.cookies.token;
//         }

//         return null;
//     }

//     public static getTokenFromQuery(req: Request): string | null {
//         if (req.query && req.query.token) {
//             return req.query.token as string;
//         }

//         return null;
//     }
// }

export class TokenManager {

    static generateToken(user: TokenUser, secret: string, expiresIn: any ): IToken {
        const token = jwt.sign(user, secret, {
            expiresIn: expiresIn
        });

        return {
            token,
            expiresIn: expiresIn
        };
    }

    static verifyToken(token: string, secret: string): TokenUser {
        return jwt.verify(token, secret) as TokenUser;
    }

    static decodeToken(token: string): TokenUser {
        return jwt.decode(token) as TokenUser;
    }
}