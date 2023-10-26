import express from "express";


export class Routers {
    router = express.Router();
    constructor() {
        this.router.get('/', (req, res) => {
            res.send('Hello World');
        });
    }
}