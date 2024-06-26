import { appConfig, jwtConfig, servicesConfig } from "@config";
import { Injectable } from "@nestjs/common";
import { createTransport } from "nodemailer";
import { TokenType } from "@common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class MailerService {

    constructor(private readonly jwtService: JwtService) { }

    private transporter = createTransport({
        service: "gmail",
        auth: {
            user: servicesConfig().mailer.user,
            pass: servicesConfig().mailer.pass,
        },
    })

    private mailOptions = (accountId: string, email: string, username: string) => {
        const appUrl = appConfig().url;
        const token = this.jwtService.sign(
            { accountId, type: TokenType.Verify },
            { secret: jwtConfig().secret },
        );

        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "REGISTRATION CONFIRMATION - CISTUDY",
            html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Complete Your Registration on CiStudy</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            padding: 20px;
            background-color: #f9f9f9;
        }
        .header {
            background-color: #D9D9DB;
            padding: 10px 20px;
            color: black;
            text-align: center;
        }
        .content {
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            color: white;
            background-color: rgb(20, 183, 164);
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to <strong style="color: #14B8A6;">Ci</strong><strong style="color: #116761;">Study</strong>!</h1>
        </div>
        <div class="content">
            <p>Hello <strong>${username ? username : email},</strong></p>
            <p>Thank you for registering on the CiStudy online learning platform. You have taken the first step towards expanding your knowledge and skills.</p>
            <p>To complete your registration, please confirm your email by clicking the button below: </p>
            <p style="text-align: center;">
                <a href="${appUrl}/api/auth/verify-registration-page?&token=${token}" class="button">Confirm Email</a>
            </p>
            
            <p>After confirming, you can access your account and start exploring exciting courses on CiStudy.</p>
            <p>If you have any questions or need further assistance, do not hesitate to contact our support team.</p>
            <p>Best regards,</p>
            <p>The CiStudy Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 CiStudy. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
            `,
        };
    }

    async sendMail(accountId: string, email: string, username: string) {
        return await this.transporter.sendMail(this.mailOptions(accountId, email, username));
    }
}
