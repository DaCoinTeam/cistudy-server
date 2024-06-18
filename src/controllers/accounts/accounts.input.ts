import { AuthInput, CourseApproveStatus, VerifyStatus } from "@common"
import { InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, Max, Min } from "class-validator"
import { app } from "firebase-admin"

export class ToggleFollowInputData {
    @IsUUID("4")
    @ApiProperty()
    followedUserId: string
}

export class ToggleFollowInput implements AuthInput<ToggleFollowInputData> {
    @IsUUID("4")
    @ApiProperty()
    accountId: string
    data: ToggleFollowInputData
}

export class VerifyCourseInputData {
    @IsUUID("4")
    @ApiProperty()
    courseId: string

    @ApiProperty()
    verifyStatus: VerifyStatus

}

export class VerifyCourseInput implements AuthInput<VerifyCourseInputData> {
    accountId: string
    data: VerifyCourseInputData
}

export class DeleteCourseInputData {
    @IsUUID("4")
    @ApiProperty()
    courseIds: Array<string>
}

export class DeleteCourseInput implements AuthInput<DeleteCourseInputData> {
    accountId: string
    data: DeleteCourseInputData
}

export class CreateUserReviewInputData {
    @IsUUID("4")
    @ApiProperty()
    userId: string

    @ApiProperty()
    content: string

    @Min(1)
    @Max(5)
    @ApiProperty()
    rating: number
}

export class CreateUserReviewInput implements AuthInput<CreateUserReviewInputData> {
    accountId: string
    data: CreateUserReviewInputData
}

export class UpdateUserReviewInputData {
    @IsUUID("4")
    @ApiProperty()
    userReviewId: string

    @ApiProperty()
    content?: string

    @Min(1)
    @Max(5)
    @ApiProperty()
    rating?: number
}

export class UpdateUserReviewInput implements AuthInput<UpdateUserReviewInputData> {
    accountId: string
    data: UpdateUserReviewInputData
}

export class DeleteUserReviewInputData {
    @IsUUID("4")
    @ApiProperty()
    userReviewId: string
}

export class DeleteUserReviewInput implements AuthInput<DeleteUserReviewInputData> {
    accountId: string
    data: DeleteUserReviewInputData

}