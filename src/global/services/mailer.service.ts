import { CourseVerifyStatus, InstructorStatus, TokenType } from "@common"
import { appConfig, jwtConfig, servicesConfig } from "@config"
import { CourseMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { createTransport } from "nodemailer"
import { acceptCourseMail, acceptInstructorMail, forgotPasswordMail, newPasswordMail, rejectCourseMail, rejectInstructorMail, reportAccountMail, reportCourseMail, reportPostCommentMail, reportPostMail, verifyAccountMail } from "../templates/mail.template"

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

    private verifyCourseMailOptions = (email: string, username: string, course: CourseMySqlEntity, note: string, verifyStatus: CourseVerifyStatus) => {
        const { title, courseId } = course
        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "YOU HAVE NEW UPDATES ON YOUR SUBMITTED COURSE",
            html: (verifyStatus === CourseVerifyStatus.Approved) ? acceptCourseMail(username, email, title) : rejectCourseMail(username, email, title, note, courseId),

        }
    }

    private verifyAccountMailOptions = (accountId: string, email: string, username: string) => {
        const frontendUrl = appConfig().frontendUrl
        const token = this.jwtService.sign(
            { accountId, type: TokenType.Verify },
            { secret: jwtConfig().secret },
        )

        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "REGISTRATION CONFIRMATION - CISTUDY",
            html: verifyAccountMail(username, email, frontendUrl, token),
        }
    }

    private newPasswordMailOptions = (email: string, username: string, newPassword: string) => {
        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "PASSWORD HAS BEEN CHANGED - CISTUDY",
            html: newPasswordMail(email, username, newPassword),
        }
    }

    private verifyInstructorMailOptions = (email: string, username: string, note: string, verifyStatus: InstructorStatus) => {
        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "INSTRUCTOR REGISTRATION RESULT",
            html: (verifyStatus === InstructorStatus.Approved) ? acceptInstructorMail(username, email) : rejectInstructorMail(username,email,note),
        }
    }

    private reportAccountMailOptions = (reportedUserEmail: string, reporterUsername: string, reportedUsername: string, reportedDate: Date, title: string, description: string, processStatus: string ,processNote: string) => {
        return {
            from: servicesConfig().mailer.user,
            to: reportedUserEmail,
            subject: "You have received a report.",
            html: reportAccountMail(reporterUsername, reportedUsername, reportedDate, title, description, processStatus, processNote),

        }
    }

    private reportCourseMailOptions = (reportedCourseCreatorEmail: string, reporterUsername: string, courseTitle: string, reportedDate: Date, title: string, description: string, processStatus: string ,processNote: string) => {
        return {
            from: servicesConfig().mailer.user,
            to: reportedCourseCreatorEmail,
            subject: "You have received a report.",
            html: reportCourseMail(reportedCourseCreatorEmail, reporterUsername, courseTitle, reportedDate, title, description, processStatus, processNote),

        }
    }

    private reportPostMailOptions = (reportedPostCreatorEmail: string, reporterUsername: string, postTitle: string, reportedDate: Date, title: string, description: string, processStatus: string ,processNote: string) => {
        return {
            from: servicesConfig().mailer.user,
            to: reportedPostCreatorEmail,
            subject: "You have received a report.",
            html: reportPostMail(reportedPostCreatorEmail, reporterUsername, postTitle, reportedDate, title, description, processStatus, processNote),
        }
    }

    private reportPostCommentMailOptions = (reportedPostCommentCreatorEmail: string, reporterUsername: string, postCommentContent: string, reportedDate: Date, title: string, description: string, processStatus: string ,processNote: string) => {
        return {
            from: servicesConfig().mailer.user,
            to: reportedPostCommentCreatorEmail,
            subject: "You have received a report.",
            html: reportPostCommentMail(reportedPostCommentCreatorEmail, reporterUsername, postCommentContent, reportedDate, title, description, processStatus, processNote),

        }
    }

    private forgotPasswordMailOptions = (email : string, username : string, accountId : string) => {
        const frontendUrl = appConfig().frontendUrl
        const token = this.jwtService.sign(
            { accountId, type: TokenType.ChangePassword },
            { secret: jwtConfig().secret },
        )
        return {
            from: servicesConfig().mailer.user,
            to: email,
            subject: "Password Changing Requested.",
            html: forgotPasswordMail(email, username, frontendUrl, token),
        }
    }

    async sendVerifyRegistrationMail(
        accountId: string, 
        email: string, 
        username: string
    ) {
        return await this.transporter.sendMail(
            this.verifyAccountMailOptions(
                accountId, 
                email, 
                username
            ))
    }

    async sendForgotPasswordMail(
        email: string, 
        username: string,
        accountId: string
    ) {
        return await this.transporter.sendMail(
            this.forgotPasswordMailOptions(
                email, 
                username,
                accountId
            ))
    }

    async sendNewPasswordMail(
        email: string, 
        username: string,
        newPassword: string, 
    ) {
        return await this.transporter.sendMail(
            this.newPasswordMailOptions(
                email,
                username,
                newPassword
            ))
    }

    async sendVerifyInstructorMail(
        email: string, 
        username: string,
        note: string,
        verifyStatus : InstructorStatus
    ) {
        return await this.transporter.sendMail(
            this.verifyInstructorMailOptions(
                email, 
                username,
                note,
                verifyStatus
            ))
    }

    async sendVerifyCourseMail(
        email: string, 
        username: string, 
        course: CourseMySqlEntity, 
        note: string, 
        verifyStatus: CourseVerifyStatus
    ) {
        return await this.transporter.sendMail(
            this.verifyCourseMailOptions(
                email, 
                username, 
                course, 
                note, 
                verifyStatus
            ))
    }

    async sendReportAccountMail(
        reportedUserEmail: string, 
        reporterUsername: string, 
        reportedUsername: string, 
        reportedDate: Date, 
        title: string, 
        description: string, 
        processStatus: string, 
        processNote: string
    ) {
        return await this.transporter.sendMail(
            this.reportAccountMailOptions(
                reportedUserEmail, 
                reporterUsername, 
                reportedUsername, 
                reportedDate, 
                title, 
                description, 
                processStatus, 
                processNote
            ))
    }

    async sendReportCourseMail(
        reportedCourseCreatorEmail: string, 
        reporterUsername: string, 
        courseTitle: string, 
        reportedDate: Date, 
        title: string, 
        description: string, 
        processStatus: string ,
        processNote: string
    ) {
        return await this.transporter.sendMail(
            this.reportCourseMailOptions(
                reportedCourseCreatorEmail, 
                reporterUsername, 
                courseTitle, 
                reportedDate, 
                title, 
                description, 
                processStatus, 
                processNote
            ))
    }

    async sendReportPostMail(
        reportedPostCreatorEmail: string, 
        reporterUsername: string, 
        postTitle: string, 
        reportedDate: Date, 
        title: string, 
        description: string, 
        processStatus: string ,
        processNote: string
    ) {
        return await this.transporter.sendMail(
            this.reportPostMailOptions(
                reportedPostCreatorEmail, 
                reporterUsername, 
                postTitle, 
                reportedDate, 
                title, 
                description, 
                processStatus, 
                processNote
            ))
    }

    async sendReportPostCommentMail(
        reportedPostCommentCreatorEmail: string, 
        reporterUsername: string, 
        postCommentContent: string, 
        reportedDate: Date, 
        title: string, 
        description: string, 
        processStatus: string ,
        processNote: string
    ) {
        return await this.transporter.sendMail(
            this.reportPostCommentMailOptions(
                reportedPostCommentCreatorEmail, 
                reporterUsername, 
                postCommentContent, 
                reportedDate, 
                title, 
                description, 
                processStatus, 
                processNote
            ))
    }
}
