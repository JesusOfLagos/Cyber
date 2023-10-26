import express, { Request, Response, NextFunction, Express } from 'express';
import { UserRouter } from '../Routers/User/user.route';
import { corsOptions } from './cors';
import cors from 'cors';

export default class App {
    public app: Express;
    public port: number;

    constructor(controllers: any, port: number) {
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(new UserRouter().router)
        this.app.use(express.urlencoded({ extended: true }));
        // this.app.use(cors)
    }

    private initializeControllers(controllers: any): void {
        // controllers.forEach((controller: any) => {
        //     this.app.use('/', controller.router);
        // });
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}