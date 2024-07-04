import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, DeepPartial, In, Repository } from "typeorm"
import { CreateAccountReviewInput, DeleteCourseInput, DeleteAccountReviewInput, ToggleFollowInput, UpdateAccountReviewInput, VerifyCourseInput, ToggleRoleInput, CreateAccountRoleInput, UpdateAccountRoleInput, CreateAccountReportInput, UpdateAccountReportInput, ResolveAccountReportInput } from "./accounts.input"
import { AccountMySqlEntity, CourseMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, AccountReviewMySqlEntity, RoleMySqlEntity, ReportAccountMySqlEntity } from "@database"
import { CreateAccountReportOutput, CreateAccountReviewOutput, CreateAccountRoleOutput, ResolveAccountReportOutput, ToggleRoleOutput, UpdateAccountReportOutput, UpdateAccountRoleOutput, VerifyCourseOuput } from "./accounts.output"
import { JwtService } from "@nestjs/jwt"
import { ReportProcessStatus, SystemRoles } from "@common"

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(AccountReviewMySqlEntity)
        private readonly accountReviewMySqlRepository: Repository<AccountReviewMySqlEntity>,
        @InjectRepository(RoleMySqlEntity)
        private readonly roleMySqlRepository: Repository<RoleMySqlEntity>,
        @InjectRepository(ReportAccountMySqlEntity)
        private readonly reportAccountMySqlRepository: Repository<ReportAccountMySqlEntity>,
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
        })

        if (found === null) {
            const created = await this.followMySqlRepository.save({
                followerId: accountId,
                followedAccountId,
            })

            const { followId, followed } = created
            return responseMessage(followId, followed)
        }

        const { followId, followed } = found
        await this.followMySqlRepository.update(followId, {
            followed: !followed,
        })
        return responseMessage(followId, !followed)
    }


    async verifyCourse(input: VerifyCourseInput): Promise<VerifyCourseOuput> {
        const { accountId, data } = input;
        const { courseId, verifyStatus } = data;

        const course = await this.courseMySqlRepository.findOne({
            where: {
                courseId,
                isDeleted: false
            }
        })

        if (!course) {
            throw new ConflictException("Course not found or have been disabled")
        }

        await this.courseMySqlRepository.update(courseId, { verifyStatus })

        return {
            message: "Course Verify Status Updated",
            others: {
                courseId
            }
        }
    }

    async deleteCourses(input: DeleteCourseInput): Promise<string> {
        const { accountId, data } = input
        const { courseIds } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {

            const course = await this.courseMySqlRepository.find({ where: { courseId: In(courseIds) } })

            if (!course) {
                throw new NotFoundException("Course not found or have been already disabled")
            }

            await this.courseMySqlRepository.update(courseIds, { isDeleted: true })

            return "Course(s) has been disabled"
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async createAccountReview(input: CreateAccountReviewInput): Promise<CreateAccountReviewOutput> {
        const { accountId, data } = input
        const { content, rating, reviewedAccountId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {

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

            const numberOfAccountCreatedCourses = await queryRunner.manager.createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .where("course.creatorId = :reviewedAccountId", { reviewedAccountId })
                .getRawOne()

            if (numberOfAccountCreatedCourses.count < 1) {
                throw new ConflictException("This account didn't have any course yet")
            }

            const hasEnrolledCourse = await queryRunner.manager.createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(EnrolledInfoMySqlEntity, "enrolled_info")
                .leftJoin("enrolled_info.course", "course")
                .where("course.creatorId = :reviewedAccountId", { reviewedAccountId })
                .andWhere("enrolled_info.accountId = :accountId", { accountId })
                .getRawOne();

            if (hasEnrolledCourse.count < 1) {
                throw new ConflictException("You must enroll in at least one course created by this account to write a review.");
            }

            const { accountReviewId } = await this.accountReviewMySqlRepository.save({ content, rating, reviewedAccountId, accountId })

            return {
                message: "Account Review Created Successfully",
                others: {
                    accountReviewId,
                }
            }
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async updateAccountReview(input: UpdateAccountReviewInput): Promise<string> {
        const { data, accountId } = input
        const { accountReviewId, content, rating } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {

            const found = await this.accountReviewMySqlRepository.findOne({
                where: {
                    accountReviewId,
                    accountId,
                }
            })

            if (!found) {
                throw new NotFoundException("This review is not found or not owned by sender")
            }

            const dateReviewed = new Date(found.createdAt);
            const restrictUpdate = new Date(dateReviewed);
            restrictUpdate.setMinutes(restrictUpdate.getMinutes() + 30);

            const currentDate = new Date();
            if (currentDate.getTime() < restrictUpdate.getTime()) {
                throw new ConflictException("You can only update the review after 30 minutes");
            }

            await this.accountReviewMySqlRepository.update(accountReviewId, { content, rating })

            return "Account review updated successfully"
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async deleteAccountReview(input: DeleteAccountReviewInput): Promise<string> {
        const { data, accountId } = input;
        const { accountReviewId } = data;

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {

            const review = await this.accountReviewMySqlRepository.findOne({
                where: {
                    accountReviewId,
                    accountId
                }
            });

            if (!review) {
                // nó chỉ quăng lỗi khi mà cái review không tìm thấy hoặc nó không thuộc về người đó
                throw new NotFoundException("This review is not found or not owned by sender.");
            }

            await this.accountReviewMySqlRepository.delete({ accountReviewId });

            return "Account review deleted successfully"
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async createAccountRole(input: CreateAccountRoleInput): Promise<CreateAccountRoleOutput> {
        const { data } = input;
        const { accountId, roleName } = data


        const exist = await this.roleMySqlRepository.findOneBy({ accountId, name: roleName })

        if(exist){
            throw new ConflictException("This user already have this role")
        }

        const {name} = await this.roleMySqlRepository.save({
            accountId,
            name: roleName,
        })

        return {
            message: `Role "${name}" have been added to account successfully`,
        };
    }

    async toggleRole(input: ToggleRoleInput): Promise<ToggleRoleOutput> {
        const { data } = input;
        const { roleId } = data

        const found = await this.roleMySqlRepository.findOneBy({ roleId })

        if (!found) {
            throw new NotFoundException("Role Not Found");
        }
        
        if(found.name === SystemRoles.User){
            throw new ConflictException(`Cannot disable role ${SystemRoles.User} from this account`)
        }

        await this.roleMySqlRepository.update(roleId, { isDisabled: !found.isDisabled })
        found.isDisabled = !found.isDisabled

        return {
            message: `Role ${found.name} has been ${found.isDisabled ? "disabled" : "enabled"}`
        }
    }

    async updateAccountRole(input: UpdateAccountRoleInput): Promise<UpdateAccountRoleOutput> {
        const { data } = input;
        const { accountId, roles, deleteRoleIds } = data;

        const currentRoles = await this.roleMySqlRepository.find({ where: { accountId } });
        if (!currentRoles || currentRoles.length === 0) {
            throw new NotFoundException("This account doesn't have any roles.");
        }

        const queryRunner = this.roleMySqlRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
   
            if (deleteRoleIds && deleteRoleIds.length > 0) {
                
                const userRoles = await this.roleMySqlRepository.find({
                    where: { roleId: In(deleteRoleIds) },
                });
                const existUserRole = userRoles.some((role) => role.name === SystemRoles.User);
                if (existUserRole) {
                    throw new ConflictException(`Cannot delete role ${SystemRoles.User} from this account.`);
                }
                
                await this.roleMySqlRepository.delete({ accountId, roleId: In(deleteRoleIds) });
            }

            if (roles && roles.length > 0) {
                const existingRoles = await this.roleMySqlRepository.find({
                    where: { accountId, name: In(roles) },
                });
                const existingRolesSet = new Set(existingRoles.map((role) => role.name));

                // Thêm role mới nếu chưa có, lọc ra role có rồi thì k thêm lại
                const rolesToAdd = roles.filter((role) => !existingRolesSet.has(role));
                for (const role of rolesToAdd) {
                    const newRole: Partial<RoleMySqlEntity> = {
                        accountId,
                        name: role,
                    };
                    await this.roleMySqlRepository.save(newRole);
                }
            }
            
            await queryRunner.commitTransaction();

            return {
                message: 'Account roles updated successfully.',
            };
        } catch (error) {
            // Rollback transaction on error
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Release query runner
            await queryRunner.release();
        }
    }

    async createAccountReport(input: CreateAccountReportInput): Promise<CreateAccountReportOutput> {
        const { data, accountId } = input;
        const { reportedAccountId, description } = data

        if(accountId === reportedAccountId){
            throw new ConflictException("You cannot report yourself.");
        }
        
        const reportedAccount = await this.accountMySqlRepository.findOneBy({accountId: reportedAccountId})

        if(!reportedAccount){
            throw new NotFoundException("Reported user is not found or has been deleted")
        }

        const processing = await this.reportAccountMySqlRepository.find({
            where:{
                reportedAccountId
            }
        })

        if(processing && processing.some(processing => processing.processStatus === ReportProcessStatus.Processing)){
            throw new ConflictException("You have reported this accout before and it is processing. Try update your report instead.")
        }

        const { reportAccountId } = await this.reportAccountMySqlRepository.save({
            reporterAccountId: accountId,
            reportedAccountId,
            description
        })

        return {
            message: `A report to user ${reportedAccount.accountId} has been submitted.`,
            others:{
                reportAccountId
            }
        };
    }

    async updateAccountReport(input: UpdateAccountReportInput): Promise<UpdateAccountReportOutput> {
        const { data, accountId } = input;
        const { reportAccountId, description } = data

        const found = await this.reportAccountMySqlRepository.findOneBy({reportAccountId})

        if(!found){
            throw new NotFoundException("Account's report not found.")
        }

        if(found.processStatus !== ReportProcessStatus.Processing){
            throw new ConflictException("This report has been resolved and closed.")
        }

        if(found.reporterAccountId !== accountId){
            throw new ConflictException("You isn't the owner of this report.")
        }

        await this.reportAccountMySqlRepository.update(reportAccountId, {description})

        return {
            message: `Your Report has been updated successfully`,
            others:{
                reportAccountId
            }
        };
    }

    async resolveAccountReport (input : ResolveAccountReportInput) : Promise<ResolveAccountReportOutput> {
        const {data} = input
        const { reportAccountId, processNote, processStatus} = data

        const found = await this.reportAccountMySqlRepository.findOneBy({reportAccountId})

        if(! found){
            throw new NotFoundException("Report not found")
        }

        if(found.processStatus !== ReportProcessStatus.Processing){
            throw new ConflictException("This report has already been resolved")
        }

        await this.reportAccountMySqlRepository.update(reportAccountId, {processStatus, processNote})

        return{
            message : "Report successfully resolved and closed."
        }
    }
}
