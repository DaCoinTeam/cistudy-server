import { ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { DataSource, In, Repository } from "typeorm"
import { CreateUserReviewInput, DeleteCourseInput, DeleteUserReviewInput, ToggleFollowInput, UpdateUserReviewInput, VerifyCourseInput } from "./accounts.input"
import { AccountMySqlEntity, CourseMySqlEntity, EnrolledInfoMySqlEntity, FollowMySqlEnitity, UserReviewMySqlEntity } from "@database"
import { CreateUserReviewOutput, VerifyCourseOuput } from "./accounts.output"
import { JwtService } from "@nestjs/jwt"
import { AccountRole } from "@common"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(UserReviewMySqlEntity)
        private readonly userReviewMySqlRepository: Repository<UserReviewMySqlEntity>,
        private readonly dataSource: DataSource,
        private readonly jwtService: JwtService
    ) { }

    async toggleFollow(input: ToggleFollowInput) {
        const { accountId, data } = input
        const { followedUserId } = data

        if (accountId === followedUserId)
            throw new ConflictException("You cannot follow yourself.")

        const responseMessage = (followId: string, followed: boolean = true) =>
            `${followed ? "Follow" : "Unfollow"} successfully with id ${followId}`

        const found = await this.followMySqlRepository.findOne({
            where: {
                followerId: accountId,
                followedUserId,
            },
        })

        if (found === null) {
            const created = await this.followMySqlRepository.save({
                followerId: accountId,
                followedUserId,
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

    // async verifyAccount(input: VerifyAccountInput): Promise<VerifyAccountOuput> {
    //     const { accountId, data } = input;
    //     const { courseId, verifyStatus } = data;

    //     // const decoded = await this.jwtService.verify(token, { secret: process.env.SECRET });

    //     // const userRole = decoded.accountRole;

    //     // console.log('User role:', userRole);
    //     const { accountRole } = await this.accountMySqlRepository.findOneBy({ accountId })

    //     if (accountRole === AccountRole.User) {
    //         throw new ConflictException("User don't have permission to perform this action")
    //     }

    //     const course = await this.courseMySqlRepository.findOne({
    //         where: {
    //             courseId,
    //             isDeleted: false
    //         }
    //     })

    //     if (!course) {
    //         throw new ConflictException("Course not found or have been disabled")
    //     }

    //     await this.courseMySqlRepository.update(courseId, { verifyStatus })

    //     return {
    //         message: "Course Verify Status Updated",
    //         others: {
    //             courseId
    //         }
    //     }
    // }

    async verifyCourse(input: VerifyCourseInput): Promise<VerifyCourseOuput> {
        const { accountId, data } = input;
        const { courseId, verifyStatus } = data;

        // const decoded = await this.jwtService.verify(token, { secret: process.env.SECRET });

        // const userRole = decoded.accountRole;

        // console.log('User role:', userRole);
        const { accountRole } = await this.accountMySqlRepository.findOneBy({ accountId })

        if (accountRole === AccountRole.User) {
            throw new ConflictException("User don't have permission to perform this action")
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
            throw new ConflictException("User don't have permission to perform this action")
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

    async createUserReview(input: CreateUserReviewInput): Promise<CreateUserReviewOutput> {
        const { accountId, data } = input
        const { content, rating, userId } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {

            if (accountId === userId) {
                throw new ConflictException("You can't post a review of yourself")
            }

            const exist = await this.userReviewMySqlRepository.findOne({
                where: {
                    userId,
                    accountId
                }
            })

            if (exist) {
                throw new ConflictException("You have already posted a review on this user")
            }

            const numberOfUserCreatedCourses = await queryRunner.manager.createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(CourseMySqlEntity, "course")
                .where("course.creatorId = :userId", { userId })
                .getRawOne()

            if (numberOfUserCreatedCourses.count < 1) {
                throw new ConflictException("This user didn't have any course yet")
            }

            const hasEnrolledCourse = await queryRunner.manager.createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(EnrolledInfoMySqlEntity, "enrolled_info")
                .leftJoin("enrolled_info.course", "course")
                .where("course.creatorId = :userId", { userId })
                .andWhere("enrolled_info.accountId = :accountId", { accountId })
                .getRawOne();

            if (hasEnrolledCourse.count < 1) {
                throw new ConflictException("You must enroll in at least one course created by this user to write a review.");
            }

            const { userReviewId } = await this.userReviewMySqlRepository.save({ content, rating, userId, accountId })

            return {
                message: "User Review Created Successfully",
                others: {
                    userReviewId,
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

    async updateUserReview(input: UpdateUserReviewInput): Promise<string> {
        const { data, accountId } = input
        const { userReviewId, content, rating } = data

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {

            const found = await this.userReviewMySqlRepository.findOne({
                where: {
                    userReviewId,
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
                throw new ConflictException("User can only update the review after 30 minutes");
            }

            await this.userReviewMySqlRepository.update(userReviewId, { content, rating })

            return "User review updated successfully"
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }

    async deleteUserReview(input: DeleteUserReviewInput): Promise<string> {
        const { data, accountId } = input;
        const { userReviewId } = data;

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {

            const review = await this.userReviewMySqlRepository.findOne({
                where: {
                    userReviewId,
                    accountId
                }
            });

            if (!review) {
                // nó chỉ quăng lỗi khi mà cái review không tìm thấy hoặc nó không thuộc về người đó
                throw new NotFoundException("This review is not found or not owned by sender.");
            }

            await this.userReviewMySqlRepository.delete({ userReviewId });

            return "User review deleted successfully"
        } catch (ex) {
            console.log(ex)
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }
    }
}
