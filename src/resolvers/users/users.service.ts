import { CourseMySqlEntity, FollowMySqlEnitity, UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource, Repository } from "typeorm"
import { FindManyCreatedCoursesInput, FindManyFollowersInput, FindOneUserInput } from "./users.input"
import { InjectRepository } from "@nestjs/typeorm"
@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(FollowMySqlEnitity)
    private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
    @InjectRepository(CourseMySqlEntity)
    private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
    private readonly dataSource: DataSource,
    ) {}

    async findOneUser(input: FindOneUserInput): Promise<UserMySqlEntity> {
        const { data } = input
        const { userId, options } = data
        const { followerId } = options

        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()

        try {
            const user = await queryRunner.manager.findOne(UserMySqlEntity, {
                where: { userId },
            })

            const follows = await queryRunner.manager.find(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId,
                        followedUserId: userId,
                        followed: true
                    }
                }
            ) 

            const numberOfFollowers = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "result")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :userId", { userId })
                .andWhere("followed = :followed", { followed: true })
                .getRawOne()

            await queryRunner.commitTransaction()

            if (follows.length) {
                user.followed = follows.at(0).followed
            } else {
                user.followed = false
            }
            user.numberOfFollowers = numberOfFollowers.result

            return user
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }

    async findManyFollowers(input: FindManyFollowersInput): Promise<Array<UserMySqlEntity>> {
        const { data } = input
        const { userId } = data
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
        const { userId } = data
        return await this.courseMySqlRepository.find(
            {
                where: {
                    creatorId: userId,
                },
            }
        ) 
    }
}