import { ConflictException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { FollowOrUnfollowInput } from "./users.input"
import { FollowMySqlEnitity } from "@database"

@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(FollowMySqlEnitity)
    private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
    ) {}

    async followOrUnfollow(input: FollowOrUnfollowInput) {
        const { userId, data } = input
        const { followedUserId } = data

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
            const created = await this.followMySqlRepository.save({
                followerId: userId,
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
}
