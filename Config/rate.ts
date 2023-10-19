import rateLimit from 'express-rate-limiter';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

class RateLimiter {
    public static getLimiter(): any {
        return limiter;
    }

    public static getLimiterWithMessage(): any {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again after 15 minutes',
        });
    }

    public static getLimiterWithMessageAndStatusCode(): any {
        return rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again after 15 minutes',
            statusCode: 429,
        });
    }
}

export default limiter;
