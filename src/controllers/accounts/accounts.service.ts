import { CourseVerifyStatus, InstructorStatus, NotificationType, ReportProcessStatus, SystemRoles } from "@common"
import {
    AccountMySqlEntity,
    AccountReviewMySqlEntity,
    ConfigurationMySqlEntity,
    CourseMySqlEntity,
    EnrolledInfoMySqlEntity,
    FollowMySqlEnitity,
    NotificationMySqlEntity,
    ReportAccountMySqlEntity,
    RoleMySqlEntity,
} from "@database"
import { MailerService } from "@global"
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, In, Repository } from "typeorm"
import {
    CreateAccountInput,
    CreateAccountReportInput,
    CreateAccountReviewInput,
    CreateAccountRoleInput,
    CreateConfigurationInput,
    DeleteAccountReviewInput,
    DeleteCourseInput,
    ResolveAccountReportInput,
    ToggleFollowInput,
    ToggleRoleInput,
    UpdateAccountInput,
    UpdateAccountReportInput,
    UpdateAccountReviewInput,
    UpdateAccountRoleInput,
    VerifyCourseInput,
    VerifyInstructorInput
} from "./accounts.input"
import {
    CreateAccountOutput,
    CreateAccountReportOutput,
    CreateAccountReviewOutput,
    CreateAccountRoleOutput,
    CreateConfigurationOutput,
    ResolveAccountReportOutput,
    ToggleRoleOutput,
    UpdateAccountOutput,
    UpdateAccountReportOutput,
    UpdateAccountRoleOutput,
    VerifyCourseOuput,
    VerifyInstructorOuput
} from "./accounts.output"

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(EnrolledInfoMySqlEntity)
        private readonly enrolledInfoMySqlRepository: Repository<EnrolledInfoMySqlEntity>,
        @InjectRepository(AccountReviewMySqlEntity)
        private readonly accountReviewMySqlRepository: Repository<AccountReviewMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
        @InjectRepository(ReportAccountMySqlEntity)
        private readonly reportAccountMySqlRepository: Repository<ReportAccountMySqlEntity>,
        @InjectRepository(NotificationMySqlEntity)
        private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
        @InjectRepository(ConfigurationMySqlEntity)
        private readonly configurationMySqlRepository: Repository<ConfigurationMySqlEntity>,
        private readonly mailerService: MailerService,
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService
    ) { }

    async toggleFollow(input: ToggleFollowInput) {
        const { accountId, data } = input
        const { followedAccountId } = data

        if (accountId === followedAccountId)
            throw new ConflictException("You cannot follow yourself.")

        const responseMessage = (followId: string, followed: boolean = true) =>
            `${followed ? "Follow" : "Unfollow"} successfully with id ${followId}`

        const found = await this.followMySqlRepository.findOne({
            where: {
                followerId: accountId,
                followedAccountId,
            },
            relations:{
                follower: true
            }
        })

        if (found === null) {
            const created = await this.followMySqlRepository.save({
                followerId: accountId,
                followedAccountId,
            })

            const { followId, followed } = created

            await this.notificationMySqlRepository.save({
                senderId: accountId,
                receiverId: followedAccountId,
                title: "You have new follower!",
                type: NotificationType.Interact,
                description: `User ${found.follower.username} has followed you`,
                referenceLink: `/accounts/${accountId}`
            })
            return responseMessage(followId, followed)
        }

        const { followId, followed } = found
        await this.followMySqlRepository.update(followId, {
            followed: !followed,
        })

        return responseMessage(followId, !followed)
    }

    async verifyInstructor(input: VerifyInstructorInput): Promise<VerifyInstructorOuput> {
        const { data } = input
        const { instructorId, verifyStatus, note } = data

        const account = await this.accountMySqlRepository.findOne({
            where: {
                accountId: instructorId,
                verified: true
            }
        })

        if (!account) {
            throw new ConflictException("Account not found or has not been verified")
        }

        if(account.instructorStatus !== InstructorStatus.Pending){
            throw new ConflictException("Instructor request is not submitted for verifying or it has been verified")
        }

        await this.mailerService.sendVerifyInstructorMail(account.email, account.username, note, verifyStatus)

        await this.accountMySqlRepository.update({accountId: instructorId}, { instructorStatus: verifyStatus })

        if (verifyStatus === InstructorStatus.Approved) {
            await this.roleMySqlRepository.save({
                accountId: instructorId,
                name: SystemRoles.Instructor
            })
            
            await this.notificationMySqlRepository.save({
                receiverId: instructorId,
                title: "You have new updates on your instructor request",
                type: NotificationType.Instructor,
                description: "Your request to be an instructor has been accepted, you can now starting to create courses. Thanks for choosing CiStudy!"
            })
        } else {
            await this.notificationMySqlRepository.save({
                receiverId: instructorId,
                title: "You have new updates on your instructor request",
                type: NotificationType.Instructor,
                description: "Your request to be an instructor has been rejected due to issues identified by our moderation team. Please check your email for more details."
            })
        }

        return {
            message: "Account's Instructor Status Updated",
        }
    }

    async verifyCourse(input: VerifyCourseInput): Promise<VerifyCourseOuput> {
        const { data } = input
        const { courseId, verifyStatus, note } = data

        const course = await this.courseMySqlRepository.findOne({
            where: {
                courseId,
                isDeleted: false
            }
        })

        if (!course) {
            throw new ConflictException("Course not found or have been disabled")
        }

        if(course.verifyStatus !== CourseVerifyStatus.Pending){
            throw new ConflictException("Course is not submitted for verifying or it has been verified")
        }

        const creator = await this.accountMySqlRepository.findOneBy({accountId: course.creatorId})

        await this.mailerService.sendVerifyCourseMail(creator.email, creator.username, course, note, verifyStatus)

        await this.courseMySqlRepository.update(courseId, { verifyStatus })

        if (verifyStatus === CourseVerifyStatus.Approved) {
            await this.notificationMySqlRepository.save({
                receiverId: course.creatorId,
                title: "You have new updates on your created course",
                type: NotificationType.Course,
                courseId,
                referenceLink: `/courses/${courseId}`,
                description: `Your course ${course.title} has been verified and it now available for learner to access. Thanks for choosing CiStudy!`
            })
        } else {
            await this.notificationMySqlRepository.save({
                receiverId: course.creatorId,
                title: "You have new updates on your created course",
                type: NotificationType.Course,
                courseId,
                referenceLink: `/courses/${courseId}/management`,
                description: `Your course, "${course.title}", has been rejected due to issues identified by our moderation team. Please check your email for more details.`
            })
            await this.courseMySqlRepository.update(courseId,{previousFeedback: note})
        }

        return {
            message: "Course Verify Status Updated",
            others: {
                courseId
            }
        }
    }

    async deleteCourses(input: DeleteCourseInput): Promise<string> {
        const { data } = input
        const { courseIds } = data

        const course = await this.courseMySqlRepository.find({ where: { courseId: In(courseIds) } })

        if (!course) {
            throw new NotFoundException("Course not found or have been already disabled")
        }

        await this.courseMySqlRepository.update(courseIds, { isDeleted: true })

        return "Course(s) has been disabled"
    }

    async createAccountReview(input: CreateAccountReviewInput): Promise<CreateAccountReviewOutput> {
        const { accountId, data } = input
        const { content, rating, reviewedAccountId } = data

        if (accountId === reviewedAccountId) {
            throw new ConflictException("You can't post a review of yourself")
        }

        const exist = await this.accountReviewMySqlRepository.findOne({
            where: {
                reviewedAccountId,
                accountId
            }
        })

        if (exist) {
            throw new ConflictException("You have already posted a review on this account")
        }

        const numberOfAccountCreatedCourses = await this.courseMySqlRepository.count({
            where: {
                creatorId: reviewedAccountId
            },
        })
    
        if (numberOfAccountCreatedCourses < 1) {
            throw new ConflictException("This account didn't have any course yet")
        }

        const hasEnrolledCourse = await this.enrolledInfoMySqlRepository.count({
            where: {
                course: {
                    creatorId: reviewedAccountId,
                },
                accountId
            },
            relations: {
                course: true
            }
        })

        if (hasEnrolledCourse < 1) {
            throw new ConflictException("You must enroll in at least one course created by this account to write a review.")
        }

        const { accountReviewId } = await this.accountReviewMySqlRepository.save({ content, rating, reviewedAccountId, accountId })
        const { username } = await this.accountMySqlRepository.findOneBy({accountId})

        await this.notificationMySqlRepository.save({
            senderId: accountId,
            receiverId: reviewedAccountId,
            type: NotificationType.Interact,
            title: "You have new review by one of your learner",
            description: `User ${username} has left you a ${rating}-star review. Check it out!`,
        })

        return {
            message: "Account Review Created Successfully",
            others: {
                accountReviewId,
            }
        }
    }

    async updateAccountReview(input: UpdateAccountReviewInput): Promise<string> {
        const { data, accountId } = input
        const { accountReviewId, content, rating } = data


        const found = await this.accountReviewMySqlRepository.findOne({
            where: {
                accountReviewId,
                accountId,
            }
        })

        if (!found) {
            throw new NotFoundException("This review is not found or not owned by sender")
        }

        const dateReviewed = new Date(found.createdAt)
        const restrictUpdate = new Date(dateReviewed)
        restrictUpdate.setMinutes(restrictUpdate.getMinutes() + 30)

        const currentDate = new Date()
        if (currentDate.getTime() < restrictUpdate.getTime()) {
            throw new ConflictException("You can only update the review after 30 minutes")
        }

        await this.accountReviewMySqlRepository.update(accountReviewId, { content, rating })

        return "Account review updated successfully"
    }

    async deleteAccountReview(input: DeleteAccountReviewInput): Promise<string> {
        const { data, accountId } = input
        const { accountReviewId } = data

        const review = await this.accountReviewMySqlRepository.findOne({
            where: {
                accountReviewId,
                accountId
            }
        })

        if (!review) {
            // nó chỉ quăng lỗi khi mà cái review không tìm thấy hoặc nó không thuộc về người đó
            throw new NotFoundException("This review is not found or not owned by sender.")
        }

        await this.accountReviewMySqlRepository.delete({ accountReviewId })

        return "Account review deleted successfully"
    }

    async createAccountRole(input: CreateAccountRoleInput): Promise<CreateAccountRoleOutput> {
        const { data } = input
        const { accountId, roleName } = data


        const exist = await this.roleMySqlRepository.findOneBy({ accountId, name: roleName })

        if (exist) {
            throw new ConflictException("This user already have this role")
        }

        const { name } = await this.roleMySqlRepository.save({
            accountId,
            name: roleName,
        })
 
        return {
            message: `Role "${name}" have been added to account successfully`,
        }
    }

    async toggleRole(input: ToggleRoleInput): Promise<ToggleRoleOutput> {
        const { data } = input
        const { roleId } = data

        const found = await this.roleMySqlRepository.findOneBy({ roleId })

        if (!found) {
            throw new NotFoundException("Role Not Found")
        }

        if (found.name === SystemRoles.User) {
            throw new ConflictException(`Cannot disable role ${SystemRoles.User} from this account`)
        }

        await this.roleMySqlRepository.update(roleId, { isDisabled: !found.isDisabled })
        found.isDisabled = !found.isDisabled

        return {
            message: `Role ${found.name} has been ${found.isDisabled ? "disabled" : "enabled"}`
        }
    }

    async updateAccountRole(input: UpdateAccountRoleInput): Promise<UpdateAccountRoleOutput> {
        const { data } = input
        const { accountId, roles, deleteRoleIds } = data

        const currentRoles = await this.roleMySqlRepository.find({ where: { accountId } })
        if (!currentRoles || currentRoles.length === 0) {
            throw new NotFoundException("This account doesn't have any roles.")
        }

        if (deleteRoleIds && deleteRoleIds.length > 0) {

            const userRoles = await this.roleMySqlRepository.find({
                where: { roleId: In(deleteRoleIds) },
            })
            const existUserRole = userRoles.some((role) => role.name === SystemRoles.User)
            if (existUserRole) {
                throw new ConflictException(`Cannot delete role ${SystemRoles.User} from this account.`)
            }

            await this.roleMySqlRepository.delete({ accountId, roleId: In(deleteRoleIds) })
        }

        if (roles && roles.length > 0) {
            const existingRoles = await this.roleMySqlRepository.find({
                where: { accountId, name: In(roles) },
            })
            const existingRolesSet = new Set(existingRoles.map((role) => role.name))

            // Thêm role mới nếu chưa có, lọc ra role có rồi thì k thêm lại
            const rolesToAdd = roles.filter((role) => !existingRolesSet.has(role))
            for (const role of rolesToAdd) {
                const newRole: Partial<RoleMySqlEntity> = {
                    accountId,
                    name: role,
                }
                await this.roleMySqlRepository.save(newRole)
            }
        }

        return {
            message: "Account roles updated successfully.",
        }
    }

    async createAccountReport(input: CreateAccountReportInput): Promise<CreateAccountReportOutput> {
        const { data, accountId } = input
        const { reportedId, title, description } = data

        if (accountId === reportedId) {
            throw new ConflictException("You cannot report yourself.")
        }

        const reportedAccount = await this.accountMySqlRepository.findOneBy({ accountId: reportedId })

        if (!reportedAccount) {
            throw new NotFoundException("Reported user is not found or has been deleted")
        }

        const processing = await this.reportAccountMySqlRepository.find({
            where: {
                reportedId
            }
        })

        if (processing && processing.some(processing => processing.processStatus === ReportProcessStatus.Processing)) {
            throw new ConflictException("You have reported this accout before and it is processing. Try update your report instead.")
        }

        const { reportAccountId } = await this.reportAccountMySqlRepository.save({
            reporterId: accountId,
            reportedId,
            title,
            description
        })

        return {
            message: `A report to user ${reportedAccount.accountId} has been submitted.`,
            others: {
                reportAccountId
            }
        }
    }

    async updateAccountReport(input: UpdateAccountReportInput): Promise<UpdateAccountReportOutput> {
        const { data, accountId } = input
        const { reportAccountId, title, description } = data

        const found = await this.reportAccountMySqlRepository.findOneBy({ reportAccountId })

        if (!found) {
            throw new NotFoundException("Account's report not found.")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has been resolved and closed.")
        }

        if (found.reporterId !== accountId) {
            throw new ConflictException("You aren't the owner of this report.")
        }

        await this.reportAccountMySqlRepository.update(reportAccountId, { title, description })

        return {
            message: "Your Report has been updated successfully",
            others: {
                reportAccountId
            }
        }
    }

    async resolveAccountReport(input: ResolveAccountReportInput): Promise<ResolveAccountReportOutput> {
        const { data } = input
        const { reportAccountId, processNote, processStatus } = data

        const found = await this.reportAccountMySqlRepository.findOne({ 
            where:{
                reportAccountId 
            },
            relations:{
                reporterAccount: true,
                reportedAccount: true
            }
        })

        if (!found) {
            throw new NotFoundException("Report not found")
        }

        if (found.processStatus !== ReportProcessStatus.Processing) {
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportAccountMySqlRepository.update(reportAccountId, { processStatus, processNote })

        const { reportedAccount, reporterAccount, createdAt, title, description } = found

        await this.mailerService.sendReportAccountMail(reportedAccount.email, reporterAccount.username, reportedAccount.username, createdAt, title, description, processStatus, processNote)

        return {
            message: "Report successfully resolved and closed."
        }
    }

    async createConfiguration(input: CreateConfigurationInput): Promise<CreateConfigurationOutput> {
        const { data } = input
        await this.configurationMySqlRepository.save({
            appliedAt: new Date("2024-09-01"),
            ...data
        })
        return {
            message: "Create configuration successfully"
        }
    }

    async updateAccount(input: UpdateAccountInput): Promise<UpdateAccountOutput> {
        const { data } = input
        const { accountId, birthdate, firstName, isDisabled, lastName, roles, username } = data

        await this.accountMySqlRepository.update(accountId, { birthdate, firstName, lastName, username, isDisabled })
        
        if (roles) {
            await this.roleMySqlRepository.delete({
                accountId
            })
            await this.roleMySqlRepository.save(roles.map((name) => ({
                name,
                accountId,
            })))
        }
        
        return {
            message: "Updated successfully",
        }
    }

    async createAccount(input: CreateAccountInput): Promise<CreateAccountOutput> {
        const { data } = input
        const { email, birthdate, firstName, lastName, roles, username } = data


        const existUsername = await this.accountMySqlRepository.findOne({ 
            where: {
                username
            }
        })
        if (existUsername) throw new ConflictException("User with this username has been existed.")

        const existEmail = await this.accountMySqlRepository.findOne({ 
            where: {
                email
            }
        })
        if (existEmail) throw new ConflictException("User with this email has been existed.")

        await this.accountMySqlRepository.save({
            email,
            birthdate: new Date(birthdate),
            firstName,
            lastName,
            username,
            roles: roles.map((name) => ({
                name
            })),
            verified: true
        })
 
        return {
            message: "Create account successfully",
        }
    }

}