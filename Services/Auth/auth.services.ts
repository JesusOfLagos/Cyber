import { Response, Request } from 'express'
import { AuthenticatedRequest, TokenManager, TokenUser } from '../../Auth/token.auth';
import config from '../../Config/config';
import { hashCompare, hashData } from '../../Config/bcrypt';
import { BlacklistTokens } from '../../Models/blacklistTokens';
import { User } from '../../Models/user.model';
import { MailManager } from '../Mail/mail.services';
import bcrypt from 'bcrypt';

export class AuthManager {
    static async RegisterUser(req: Request, res: Response) {
        console.log("RegisterUser")
        const { email, password } = req.body
        // const hashedPassword = await hashData(password)
        // const hashedPassword = bcrypt.hashSync(password, 10);
        // console.log("hashedPassword", hashedPassword)
        const hashedPassword = password
        const USER = await User.getUserByEmail(email)
        if (USER) {
            return res.status(400).json({ message: "User already exists" })
        }
        const user = await User.addUser(email, hashedPassword)
        if (!user) {
            return res.status(500).json({ message: "Something went wrong" })
        }
        return res.status(200).json({
            user,
            message: "User registered successfully"
        })
    }

    static async LoginUser(req: Request, res: Response) {
        const { email, password } = req.body
        const user: TokenUser = { id: '', email, role: 'user' };
        const token = TokenManager.generateToken(user, config.auth.accessTokenSecret, config.auth.accessTokenExpiresIn);
        const refreshToken = TokenManager.generateToken(user, config.auth.refreshTokenSecret, config.auth.refreshTokenExpiresIn);
        const USER = await User.getUserByEmail(email)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        // const isMatch = await hashCompare(password, USER.password)
        const isMatch = password === USER.password
        if (!isMatch) {
            return res.status(404).json({ message: "Incorrect password" })
        }
        return res.status(200).json({
            token,
            refreshToken,
            expiresIn: config.auth.accessTokenExpiresIn as unknown as number
        })
    }

    static async LogoutUser(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token" })
        }
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.accessTokenSecret);
        const USER = await User.getUserByEmail(decodedToken.email)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        await BlacklistTokens.addToken(token as string)
        USER.refreshToken = ''
        await USER.save()
        return res.status(200).json({ message: "User logged out successfully" })
    }

    static async RefreshToken(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.refreshTokenSecret);
        const USER = await User.getUserByEmail(decodedToken.email)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        if (USER.refreshToken !== token) {
            return res.status(401).json({ message: "Invalid refresh token" })
        }
        const newToken = TokenManager.generateToken(decodedToken, config.auth.accessTokenSecret, config.auth.accessTokenExpiresIn);
        return {
            token,
            expiresIn: config.auth.accessTokenExpiresIn as unknown as number
        };
    }

    static async LogoutAll(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.accessTokenSecret);
        const USER = await User.getUserByEmail(decodedToken.email)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        await BlacklistTokens.deleteAllTokensByUserId(USER._id)
        USER.refreshToken = ''
        await USER.save()
        return res.status(200).json({ message: "User logged out successfully" })
    }

    static async DeleteUser(req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.accessTokenSecret);
        const USER = await User.getUserByEmail(decodedToken.email)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }

        const userId = USER._id as unknown as string
        await BlacklistTokens.deleteAllTokensByUserId(USER._id)
        await User.deleteUserById(userId)
        return res.status(200).json({ message: "User deleted successfully" })
    }

    static async ChangePassword (req: Request, res: Response) {
        const userId = req.body.userId
        const { oldPassword, newPassword } = req.body
        const USER: any = await User.getUserById(userId)
        const isMatch = await hashCompare(oldPassword, USER?.password)
        if (!isMatch) {
            return res.status(404).json({ message: "Incorrect password" })
        }
        const hashedPassword = await hashData(newPassword)
        USER.password = hashedPassword
        await USER.save()
        return res.status(200).json({ message: "Password changed successfully" })
    }

    static async ForgotPassword (req: Request, res: Response) {
        const { email } = req.body
        const USER: any = await User.getUserByEmail(email)
        const user = { id: USER._id, email, role: 'user' };
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        const token = TokenManager.generateToken(user, config.auth.resetPasswordTokenSecret, config.auth.resetPasswordTokenExpiresIn);
        await MailManager.sendResetPasswordMail(email, token)
        return res.status(200).json({ message: "Reset password token generated successfully" })
    }

    static async ResetPassword (req: Request, res: Response) {
        const { token, newPassword } = req.body
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.resetPasswordTokenSecret);
        const USER: any = await User.getUserById(decodedToken.id)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        const hashedPassword = await hashData(newPassword)
        USER.password = hashedPassword
        await USER.save()
        return res.status(200).json({ message: "Password reset successfully" })
    }

    static async VerifyEmail (req: Request, res: Response) {
        const { token } = req.body
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.resetPasswordTokenSecret);
        const USER: any = await User.getUserById(decodedToken.id)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        USER.isVerified = true
        await USER.save()
        return res.status(200).json({ message: "Email verified successfully" })
    }

    static async ResendVerificationEmail (req: Request, res: Response) {
        const { email } = req.body
        const USER: any = await User.getUserByEmail(email)
        const user = { id: USER._id, email, role: 'user' };
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        const token = TokenManager.generateToken(user, config.auth.resetPasswordTokenSecret, config.auth.resetPasswordTokenExpiresIn);
        await MailManager.sendVerificationMail(email, token)
        return res.status(200).json({ message: "Verification email sent successfully" })
    }

    static async GetProfile (req: Request, res: Response) {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = TokenManager.verifyToken(token as string, config.auth.accessTokenSecret);
        const USER = await User.getUserByEmail(decodedToken.email)
        if (!USER) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ user: USER })
    }
}