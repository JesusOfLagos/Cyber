import { AuthManager } from "../../Services/Auth/auth.services";
import { Routers } from "../index.route";


export class UserRouter extends Routers {
    constructor() {
        super();
        this.router.get('/api/v1/ping', (req, res) => {
            res.status(200).json({ message: 'Pong' })
        });

        this.router.post('/api/v1/users/login', AuthManager.LoginUser);

        this.router.post('/api/v1/users/register', AuthManager.RegisterUser)

        this.router.post('/api/v1/users/logout', AuthManager.LogoutUser)
        this.router.post('/api/v1/users/reset-password', AuthManager.ResetPassword)
        this.router.post('/api/v1/users/forgot-password', AuthManager.ForgotPassword)
        this.router.post('/api/v1/users/verify-link', AuthManager.VerifyEmail)
}

}

export default new UserRouter();