import * as dotenv from "dotenv";
import { ENVIRONMENT } from "./environment";

dotenv.config();

export const config = Object.freeze({
  app: {
    port: parseInt(process.env.PORT!),
    environment: {
      mode: process.env.NODE_ENV,
      isInProduction: process.env.NODE_ENV === ENVIRONMENT.PROD,
      isInDevelopment: process.env.NODE_ENV === ENVIRONMENT.DEV,
      isInTesting: process.env.NODE_ENV === ENVIRONMENT.TEST,
    },
    blacklist: {
      ID: process.env.BLACKLIST_ID as string,
    },
  },
  mail: {
    globalFrom: process.env.MAIL_FROM || ("ecx@gmail.com" as string), //TODO: fix ecx mail.
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    smtpUsername: process.env.USER_EMAIL,
    smtpClientId: process.env.CLIENT_ID as string,
    smtpClientSecret: process.env.CLIENT_SECRET as string,
    smtpRefreshToken: process.env.REFRESH_TOKEN as string,
  },
  auth: {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    accessTokenExpiresIn: process.env.ACCESS_TOKEN_SECRET_LIFE_SPAN as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    refreshTokenExpiresIn: process.env.ACCESS_TOKEN_SECRET_LIFE_SPAN as string,
    resetPasswordTokenSecret: process.env.RESET_PASSWORD_TOKEN_SECRET as string,
    resetPasswordTokenExpiresIn: process.env.RESET_PASSWORD_TOKEN_SECRET_LIFE_SPAN as string,
  },
  cache: {
    port: parseInt(process.env.REDIS_PORT!),
    host: process.env.REDIS_HOST,
    ttl: parseInt(process.env.REDIS_TTL!),
  },
  db: {
    mongodb: {
      MONGO_URL: process.env.MONGODB_URL as string,
    },
    postgresql: {
      POSTGRESQL_USER: process.env.POSTGRESQL_USER as string,
      POSTGRESQL_USER_PASSWORD: process.env.POSTGRESQL_USER_PASSWORD as string,
      POSTGRESQL_DATABASE: process.env.POSTGRESQL_DATABASE as string,
      POSTGRESQL_PORT: parseInt(process.env.POSTGRESQL_PORT!),
    },
  },
  baseLink: process.env.BASE_URL as string,
  rateLimit: {
    limit: process.env.WINDOW_RATE_LIMIT,
  },
  superAdmin: {
    email: process.env.SUPER_ADMIN_EMAIL as string,
    username: process.env.SUPER_ADMIN_USERNAME as string,
    password: process.env.SUPER_ADMIN_PASSWORD as string
  }
});

export enum Roles {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export default config;