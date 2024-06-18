import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, In, Repository } from "typeorm"
import { CreateAccountReviewInput, DeleteCourseInput, DeleteAccountReviewInput, ToggleFollowInput, UpdateAccountReviewInput, VerifyCourseInput } from "./accounts.input"
import { AccountMySqlEntity, CourseMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, AccountReviewMySqlEntity } from "@database"
import { CreateAccountReviewOutput, VerifyCourseOuput } from "./accounts.output"
import { JwtService } from "@nestjs/jwt"
import { AccountRole } from "@common"

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

        const { accountRole } = await this.accountMySqlRepository.findOneBy({ accountId })

        if (accountRole === AccountRole.User) {
            throw new ConflictException("Your account don't have permission to perform this action")
        }

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

        const { accountRole } = await this.accountMySqlRepository.findOneBy({ accountId })

        if (accountRole === AccountRole.User || accountRole === AccountRole.Moderator) {
            throw new ConflictException("Your account don't have permission to perform this action")
        }

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
}
