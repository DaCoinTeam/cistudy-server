import { AuthInput, CourseApproveStatus, SystemRoles, VerifyStatus } from "@common"
import { InputType } from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, Max, Min } from "class-validator"
import { app } from "firebase-admin"

export class ToggleFollowInputData {
    @IsUUID("4")
    @ApiProperty()
    followedAccountId: string
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

export class CreateAccountReviewInputData {
    @IsUUID("4")
    @ApiProperty()
    reviewedAccountId: string

    @ApiProperty()
    content: string

    @Min(1)
    @Max(5)
    @ApiProperty()
    rating: number
}

export class CreateAccountReviewInput implements AuthInput<CreateAccountReviewInputData> {
    accountId: string
    data: CreateAccountReviewInputData
}

export class UpdateAccountReviewInputData {
    @IsUUID("4")
    @ApiProperty()
    accountReviewId: string

    @ApiProperty()
    content?: string

    @Min(1)
    @Max(5)
    @ApiProperty()
    rating?: number
}

export class UpdateAccountReviewInput implements AuthInput<UpdateAccountReviewInputData> {
    accountId: string
    data: UpdateAccountReviewInputData
}

export class DeleteAccountReviewInputData {
    @IsUUID("4")
    @ApiProperty()
    accountReviewId: string
}

export class DeleteAccountReviewInput implements AuthInput<DeleteAccountReviewInputData> {
    accountId: string
    data: DeleteAccountReviewInputData

}

export class CreateRoleInputData {
    @ApiProperty()
    name: string
}

export class CreateRoleInput implements AuthInput<CreateRoleInputData> {
    accountId: string
    data: CreateRoleInputData
}

export class CreateAccountRoleInputData {
    @IsUUID("4")
    @ApiProperty()
    accountId: string

    @ApiProperty()
    roleName: SystemRoles
}

export class CreateAccountRoleInput implements AuthInput<CreateAccountRoleInputData> {
    accountId: string
    data: CreateAccountRoleInputData
}

export class ToggleRoleInputData {
    @ApiProperty()
    roleId: string
}

export class ToggleRoleInput implements AuthInput<ToggleRoleInputData> {
    accountId: string
    data: ToggleRoleInputData
}

export class UpdateRoleInputData {
    @ApiProperty()
    roleId: string

    @ApiProperty()
    name: string
}

export class UpdateRoleInput implements AuthInput<UpdateRoleInputData> {
    accountId: string
    data: UpdateRoleInputData
}

export class UpdateAccountRoleInputData {
    @IsUUID("4")
    @ApiProperty()
    accountId: string

    @ApiProperty()
    roles: Array<SystemRoles>

    @ApiProperty()
    deleteRoleIds : Array<string>
}

export class UpdateAccountRoleInput implements AuthInput<UpdateAccountRoleInputData> {
    accountId: string
    data: UpdateAccountRoleInputData
}