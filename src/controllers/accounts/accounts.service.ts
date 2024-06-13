import { ConflictException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ToggleFollowInput, UpdateCourseApprovalInput } from "./accounts.input"
import { AccountMySqlEntity, CourseMySqlEntity, FollowMySqlEnitity } from "@database"
import { UpdateCourseApproveStatusOuput } from "./accounts.output"
import { JwtService } from "@nestjs/jwt"
import { AccountRole, CourseApproveStatus } from "@common"

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(FollowMySqlEnitity)
        private readonly followMySqlRepository: Repository<FollowMySqlEnitity>,
        @InjectRepository(AccountMySqlEntity)
        private readonly accountMySqlRepository: Repository<AccountMySqlEntity>,
        @InjectRepository(CourseMySqlEntity)
        private readonly courseMySqlRepository: Repository<CourseMySqlEntity>,
        private readonly jwtService: JwtService,
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

    async updateCourseApproval(input: UpdateCourseApprovalInput): Promise<UpdateCourseApproveStatusOuput> {
        const { accountId, data } = input;
        const { courseId, approveStatus } = data;

        // const decoded = await this.jwtService.verify(token, { secret: process.env.SECRET });

        // const userRole = decoded.accountRole;

        // console.log('User role:', userRole);
        const { accountRole } = await this.accountMySqlRepository.findOneBy({ accountId })

        if (accountRole === AccountRole.User) {
            throw new ConflictException("User don't have permission to perform this")
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

        await this.courseMySqlRepository.update(courseId, { approveStatus })
        return {
            message: "Course Approval Updated",
            others: {
                courseId
            }
        }
    }

}
