import { AuthInput, CourseApproveStatus } from "@common"
import { InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

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

@InputType()
export class UpdateCourseApprovalInputData{
    @IsUUID("4")
    @ApiProperty()
    courseId: string

    @ApiProperty()
    approveStatus : CourseApproveStatus
}

export class UpdateCourseApprovalInput implements AuthInput <UpdateCourseApprovalInputData>{
    accountId: string
    data: UpdateCourseApprovalInputData
}