import { CourseMySqlEntity, FollowMySqlEnitity, AccountMySqlEntity, UserReviewMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { FindManyCreatedCoursesInput, FindManyFollowersInput, FindManyUserReviewsInput, FindManyAccountsInput, FindOneAccountInput } from "./accounts.input"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyUserReviewsOutputData, FindManyAccountsOutputData } from "./accounts.output"
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        @InjectRepository(UserReviewMySqlEntity)
        private readonly userReviewMySqlRepository: Repository<UserReviewMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findOneAccount(input: FindOneAccountInput): Promise<AccountMySqlEntity> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { followerId } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const user = await queryRunner.manager.findOne(AccountMySqlEntity, {
                where: { accountId },
                relations: {
                    //cart: true
                }
            })

            const follow = await queryRunner.manager.findOne(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId,
                        followedUserId: accountId,
                        followed: true
                    }
                }
            )

            const numberOfFollowersResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :accountId", { accountId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            user.numberOfFollowers = numberOfFollowersResult.count
            const followed = follow?.followed
            user.followed = followed ?? false

            return user
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyFollowers(input: FindManyFollowersInput): Promise<Array<AccountMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { accountId } = params

        const followRelations = await this.followMySqlRepository.find(
            {
                where: {
                    followedUserId: accountId,
                    followed: true
                },
                relations: {
                    follower: true
                }
            }
        )
        return followRelations.map(followRelation => followRelation.follower)
    }

    async findManyCreatedCourses(input: FindManyCreatedCoursesInput): Promise<Array<CourseMySqlEntity>> {
        const { data } = input
        const { params, options } = data
        const { accountId } = params
        const { take, skip } = { ...options }

        return await this.courseMySqlRepository.find(
            {
                where: {
                    creatorId: accountId,
                },
                take,
                skip
            }
        )
    }

    async findManyUsers(input: FindManyAccountsInput): Promise<FindManyAccountsOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const results = await this.accountMySqlRepository.find(
                {
                    skip,
                    take,
                })

            const count = await this.accountMySqlRepository.count()

            await queryRunner.commitTransaction()

            return {
                results,
                metadata: {
                    count,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyUserReviews(input: FindManyUserReviewsInput): Promise<FindManyUserReviewsOutputData> {
        const { data } = input;
        const { params, options } = data;
        const { accountId } = params;
        const { skip, take } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const results = await this.userReviewMySqlRepository.find({
                where: { accountId },
                relations: {
                    account: true,
                    user: true
                },
                skip,
                take,
                order: { createdAt: 'DESC' }
            });
            const numberOfCourseReviewsResult = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "count")
                .from(UserReviewMySqlEntity, "user-review")
                .where("accountId = :accountId ", { accountId })
                .getRawOne()

            return {
                results,
                metadata: {
                    count: numberOfCourseReviewsResult.count,
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
            throw ex
        } finally {
            await queryRunner.release()
        }

        // async findManyCourseReviews(input: FindManyCourseReviewsInput): Promise<FindManyCourseReviewsOutputData> {
        //     const { data } = input;
        //     const { params, options } = data;
        //     const { courseId } = params;
        //     const { skip, take } = options

        //     const queryRunner = this.dataSource.createQueryRunner()
        //     await queryRunner.connect()
        //     await queryRunner.startTransaction()

        //     try {
        //         console.log(courseId)
        //         const results = await this.courseReviewMySqlRepository.find({
        //             where: { courseId },
        //             relations: {
        //                 course: true,
        //                 account: true,
        //             },
        //             skip,
        //             take,
        //             order: { createdAt: 'DESC' }
        //         });
        //         console.log(results.length)
        //         const numberOfCourseReviewsResult = await queryRunner.manager
        //             .createQueryBuilder()
        //             .select("COUNT(*)", "count")
        //             .from(CourseReviewMySqlEntity, "course-review")
        //             .where("courseId = :courseId ", { courseId })
        //             .getRawOne()

        //         return {
        //             results,
        //             metadata: {
        //                 count: numberOfCourseReviewsResult.count,
        //             }
        //         }
        //     } catch (ex) {
        //         await queryRunner.rollbackTransaction()
        //         throw ex
        //     } finally {
        //         await queryRunner.release()
        //     }
        // }
    }
}