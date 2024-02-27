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

            const follows = await queryRunner.manager.createQueryBuilder().select()
                .from(FollowMySqlEnitity, "follow")
                .where("followerId = :followerId", { followerId })
                .andWhere("followedUserId = :userId", { userId })
                .getRawMany()
            
            await queryRunner.commitTransaction()

            if (follows.length) {
                user.followed = follows.at(0).followed
            } else {
                user.followed = false
            }

            return user
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}
