

// export interface IConfig {
//     port: number;
//     environment: IEnvironment;
//     blacklist: IBlacklist;
//     mail: IMail;
//     auth: IAuth;
//     cache: ICache;
//     db: IDB;
//     baseLink: string;
//     rateLimit: IRateLimit;
//     superAdmin: ISuperAdmin;
//     }

import { IToken } from "../../Auth/token.auth";
import config from "../../Config/config";


export interface IMail {
    email: string;
    subject: string;
    message: string;
}


export class MailManager {
    static async sendMail(mail: IMail) {
        const nodemailer = require("nodemailer");
        const transporter = nodemailer.createTransport({
            host: config.mail.smtpHost,
            port: config.mail.smtpPort,
            secure: true,
            auth: {
                type: "OAuth2",
                user: config.mail.smtpUsername,
                clientId: config.mail.smtpClientId,
                clientSecret: config.mail.smtpClientSecret,
                refreshToken: config.mail.smtpRefreshToken,
        },
        });
        const mailOptions = {
            from: config.mail.globalFrom,
            to: mail.email,
            subject: mail.subject,
            text: mail.message,
        };
        await transporter.sendMail(mailOptions);
    }

    static async sendResetPasswordMail(email: string, token: IToken) {
        const mail: IMail = {
            email,
            subject: "Reset Password",
            message: `Please click on the link below to reset your password: ${config.baseLink}/reset-password/${token}`,
        };
        await this.sendMail(mail);
    }

    static async sendVerificationMail(email: string, token: IToken) {
        const mail: IMail = {
            email,
            subject: "Verify Email",
            message: `Please click on the link below to verify your email: ${config.baseLink}/verify-email/${token}`,
        };
        await this.sendMail(mail);
    }

    static async sendWelcomeMail(email: string, token: IToken) {
        const mail: IMail = {
            email,
            subject: "Welcome",
            message: `Welcome to our Safu App. We are glad to have you on board. Please click on the link below to verify your email: ${config.baseLink}/verify-email/${token}. it expires in ${token.expiresIn} seconds. Thank you.`,
        };
        await this.sendMail(mail);
    }

    static async sendTransactionMail(email: string, amount: number, currency: string) {
        const mail: IMail = {
            email,
            subject: "Transaction",
            message: `You have successfully transferred ${amount} ${currency} to your Safu wallet.`,
        };
        await this.sendMail(mail);
    }

    static async sendTransactionMailToReceiver(email: string, amount: number, currency: string, sender: string) {
        const mail: IMail = {
            email,
            subject: "Transaction",
            message: `You have successfully received ${amount} ${currency} from ${sender} to your Safu wallet.`,
        };
        await this.sendMail(mail);
    }
}