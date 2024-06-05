import { CourseMySqlEntity, FollowMySqlEnitity, UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { FindManyCreatedCoursesInput, FindManyFollowersInput, FindManyUsersInput, FindOneUserInput } from "./users.input"
import { InjectRepository } from "@nestjs/typeorm"
import { FindManyUsersOutputData } from "./user.output"
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserMySqlEntity)
        private readonly userMySqlRepository: Repository<UserMySqlEntity>,
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        private readonly dataSource: DataSource,
    ) { }

    async findOneUser(input: FindOneUserInput): Promise<UserMySqlEntity> {
        const { data } = input
        const { params } = data
        const { userId } = params
        //const { followerId } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const user = await queryRunner.manager.findOne(UserMySqlEntity, {
                where: { userId },
                relations: {
                    cart: true
                }
            })

            // const follow = await queryRunner.manager.findOne(
            //     FollowMySqlEnitity,
            //     {
            //         where: {
            //             followerId,
            //             followedUserId: userId,
            //             followed: true
            //         }
            //     }
            // )

            // const numberOfFollowersResult = await queryRunner.manager
            //     .createQueryBuilder()
            //     .select("COUNT(*)", "count")
            //     .from(FollowMySqlEnitity, "follow")
            //     .where("followedUserId = :userId", { userId })
            //     .andWhere("followed = :followed", { followed: true })
            //     .getRawOne()

            await queryRunner.commitTransaction()

            // user.numberOfFollowers = numberOfFollowersResult.count
            // const followed = follow?.followed
            // user.followed = followed ?? false

            return user
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyFollowers(input: FindManyFollowersInput): Promise<Array<UserMySqlEntity>> {
        const { data } = input
        const { params } = data
        const { userId } = params

        const followRelations = await this.followMySqlRepository.find(
            {
                where: {
                    followedUserId: userId,
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
        const { userId } = params
        const { take, skip } = { ...options }

        return await this.courseMySqlRepository.find(
            {
                where: {
                    creatorId: userId,
                },
                take,
                skip
            }
        )
    }

    async findManyUsers(input: FindManyUsersInput): Promise<FindManyUsersOutputData> {
        const { data } = input
        const { options } = data
        const { skip, take } = { ...options }

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const results = await this.userMySqlRepository.find(
                {
                    skip,
                    take,
                })

            const count = await this.userMySqlRepository.count()

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
}