import express, { Request, Response, NextFunction, Express } from 'express';

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