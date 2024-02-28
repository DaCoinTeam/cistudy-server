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
    ) {}

    async upsertFollow(input: UpsertFollowInput) {
        const { userId, data } = input
        const { followedUserId, followed } = data

        if (userId === followedUserId)
            throw new ConflictException("You cannot follow yourself.")

        const responseMessage = (followId: string, followed: boolean = true) =>
            `${followed ? "Follow" : "Unfollow"} successfully with id ${followId}`

        const found = await this.followMySqlRepository.findOne({
            where: {
                followerId: userId,
                followedUserId,
            },
        })

        if (found === null) {
            if (!followed) throw new ConflictException("You haven't followed yet.")

            const created = await this.followMySqlRepository.save({
                followerId: userId,
                followedUserId,
                followed,
            })
            return responseMessage(created.followId, followed)
        }

        const { followId } = found
        await this.followMySqlRepository.update(followId, {
            followed,
        })
        return responseMessage(followId, followed)
    }
}
