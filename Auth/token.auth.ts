

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


export class TokenManager {
    public static generateToken(user: TokenUser): IToken {
        const token = jwt.sign(user, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        return {
            token,
            expiresIn: process.env.JWT_EXPIRES_IN
        };
    }

    public static verifyToken(token: string): TokenUser {
        return jwt.verify(token, process.env.JWT_SECRET) as TokenUser;
    }

    public static decodeToken(token: string): TokenUser {
        return jwt.decode(token) as TokenUser;
    }

    public static getTokenFromHeader(req: Request): string {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        }

        return null;
    }

    public static getTokenFromCookie(req: Request): string {
        if (req.cookies && req.cookies.token) {
            return req.cookies.token;
        }

        return null;
    }

    public static getTokenFromQuery(req: Request): string {
        if (req.query && req.query.token) {
            return req.query.token;
        }

        return null;
    }
}