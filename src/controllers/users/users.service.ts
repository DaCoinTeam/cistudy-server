import { ConflictException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UpsertFollowInput } from "./users.input"
import { FollowMySqlEnitity } from "@database"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
    ) { }

    async upsertFollow(input: UpsertFollowInput) {
        const { userId, data } = input
        const { followedUserId, followed } = data

        if (userId === followedUserId) throw new ConflictException("You cannot follow yourself.")

        const found = await this.followMySqlRepository.findOne({
            where: {
                followerId: userId,
                followedUserId,
            }
        })

        if (found === null) {
            const created = await this.followMySqlRepository.save({
                followerId: userId,
                followedUserId,
                followed
            })
            return `A follow with id ${created.followId} has been created successfully.`
        }

        const { followId } = found
        await this.followMySqlRepository.update(followId, {
            followed
        })
        return `Follow with id ${followId} has been updated successfully.`
    }
}