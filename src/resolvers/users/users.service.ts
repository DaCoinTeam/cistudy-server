import { FollowMySqlEnitity, UserMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource } from "typeorm"
import { FindOneUserInput } from "./users.input"
@Injectable()
export class UsersService {
    constructor(
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
                where: { userId }
            })
            const follows = await queryRunner.manager.find(
                FollowMySqlEnitity,
                {
                    where: {
                        followerId,
                        followedUserId: userId
                    }
                }
            ) 
            const numberOfFollowers = await queryRunner.manager
                .createQueryBuilder()
                .select("COUNT(*)", "result")
                .from(FollowMySqlEnitity, "follow")
                .where("followedUserId = :userId", { userId })
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
}