import { appConfig, jwtConfig, servicesConfig } from "@config"
import { Injectable } from "@nestjs/common"
import { createTransport } from "nodemailer"
import { CourseVerifyStatus, TokenType } from "@common"
import { JwtService } from "@nestjs/jwt"
import { CourseMySqlEntity } from "@database"

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

    private verifyCourseMailOptions = (email: string, username: string, course : CourseMySqlEntity, note: string, verifyStatus: CourseVerifyStatus) => {
        const  {title, courseId} = course
        const acceptHTML = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>COURSE VERIFICATION RESULT</h1>
        </div>
        <div class="content">
            <h3>Dear ${username ? username : email},</h3>
            <p>We are pleased to inform you that your course submission on <span style="color: #14B8A6;">Ci</span><span style="color: #116761;">Study</span> has been successfully reviewed and approved. Your course has met all the necessary criteria and standards set by our team.</p>
            <p>Your course titled <strong>"${title}"</strong> has been thoroughly evaluated and we are delighted to inform you that it has been approved. You can now see your course live on our platform and accessible to all users.</p>
            <p>We appreciate the effort and dedication you have put into creating this course. We believe it will be a valuable resource for learners on our platform.</p>
            <p>Should you have any questions or need further assistance, please do not hesitate to contact our support team.</p>
            <p>Thank you for being a part of <span style="color: #14B8A6;">Ci</span><span style="color: #116761;">Study</span>.</p>
            <p>Best regards,</p>
            Cistudy Support Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 <span style="color: #14B8A6;">Ci</span><span style="color: #116761;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
        `
        const rejectHTML = `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Course Verification Status on CiStudy</title>
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
            background-color: #14B8A6;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>COURSE VERIFICATION RESULT</h1>
        </div>
        <div class="content">
            <h3>Dear ${username ? username : email},</h3>
            <p>Thank you for your recent course submission on <span style="color: #14B8A6, font-weight:900">Ci</span><span style="color: #116761, font-weight:900">Study</span>. We appreciate your effort in contributing to our learning community.</p>
            <p>After a thorough review of your course titled <strong>"${title}"</strong>, we regret to inform you that it does not meet the necessary criteria and standards for approval.</p>
            ${note ? `
            <p>We also gives you a note about your course's content that require improvement: </p>
            <ul>
                <p>${note}</p>
            </ul>        
            ` : null}
            <p>We encourage you to revise and enhance your course based on the feedback provided. Once you have made the necessary improvements, you are welcome to resubmit your course for review.</p>
            <p>If you have any questions or need further guidance on how to improve your course, please feel free to contact our support team.</p>
            <p style="text-align: center;">
                <a href="https://cistudy-client-2.vercel.app/courses/${courseId}/management" class="button">Go to this course management</a>
            </p>
            <p>Thank you for your understanding and continued support of <span style="color: #14B8A6;">Ci</span><span style="color: #116761;">Study</span>.</p>
            <p>Best regards,</p>
            Cistudy Support Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 <span style="color: #14B8A6;">Ci</span><span style="color: #116761;">Study</span>. All rights reserved.</p>
            <p>This email was sent from an automated system, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
        `
        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "You have new updates on your submitted course",
            html: (verifyStatus === CourseVerifyStatus.Approved) ? acceptHTML : rejectHTML,
               
        }
    }

    private signUpMailOptions = (accountId: string, email: string, username: string) => {
        const appUrl = appConfig().url
        const token = this.jwtService.sign(
            { accountId, type: TokenType.Verify },
            { secret: jwtConfig().secret },
        )

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
        }
    }

    async sendVerifyRegistrationMail(accountId: string, email: string, username: string) {
        return await this.transporter.sendMail(this.signUpMailOptions(accountId, email, username))
    }

    async sendVerifyCourseMail(email: string, username: string, course : CourseMySqlEntity,note : string, verifyStatus: CourseVerifyStatus) {
        return await this.transporter.sendMail(this.verifyCourseMailOptions(email, username, course, note, verifyStatus))
    }
}
