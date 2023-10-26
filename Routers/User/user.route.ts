import { Routers } from "../index.route";

export class UserRouter extends Routers {
    constructor() {
        super();
        this.router.get('/api/v1/ping', (req, res) => {
            res.status(200).json({ message: 'Pong' })
        });

        this.router.post('/api/v1/users/login', (req, res) => {
            res.status(200).json({ message: 'Login Successful' })
        });

        this.router.post('/api/v1/users/register', (req, res) => {
            res.status(200).json({ message: 'Login Successful' })
        });
    }
}

export default new UserRouter();