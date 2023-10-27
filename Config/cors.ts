


import { CorsOptions } from 'cors';

export const ENVIRONMENT = {
  PROD: 'production',
  DEV: 'development',
  TEST: 'testing',
} as const;

export class Cors {
  public static allowedOrigins: string | RegExp | (string | RegExp)[] = [
    "https://safu-kappa.vercel.app",
  ];

  public static allowedMethods: string[] = ["GET", "POST", "PUT", "DELETE", "PATCH"];

  public static allowedHeaders: string[] = [
    "Content-Type",
    "Content-Length",
    "Content-Transfer-Encoding",
    "Authorization",
  ]


  public static corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  static async setCorsOptions(): Promise<void> {
    this.corsOptions = {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    };
  }
}

export const corsConfig: CorsOptions = {
  origin: Cors.allowedOrigins,
  methods: Cors.allowedMethods,
  credentials: true,
  allowedHeaders: Cors.allowedHeaders,
  optionsSuccessStatus: 200,
};

