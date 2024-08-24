import { AuthInput, CourseVerifyStatus, InstructorStatus, ReportProcessStatus, SystemRoles } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID, Max, Min, MinLength } from "class-validator"

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
        note?: string
    @ApiProperty()
        verifyStatus: CourseVerifyStatus

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
        deleteRoleIds: Array<string>
}

export class UpdateAccountRoleInput implements AuthInput<UpdateAccountRoleInputData> {
    accountId: string
    data: UpdateAccountRoleInputData
}

export class CreateAccountReportInputData {
    @IsUUID("4")
    @ApiProperty()
        reportedId: string
    @ApiProperty()
    @MinLength(20)
        title: string
    @ApiProperty()
    @MinLength(20)
        description: string
}

export class CreateAccountReportInput implements AuthInput<CreateAccountReportInputData> {
    accountId: string
    data: CreateAccountReportInputData
}

export class UpdateAccountReportInputData {
    @IsUUID("4")
    @ApiProperty()
        reportAccountId: string
    @ApiProperty()
    @MinLength(20)
        title: string
    @ApiProperty()
    @MinLength(20)
        description: string
}

export class UpdateAccountReportInput implements AuthInput<UpdateAccountReportInputData> {
    accountId: string
    data: UpdateAccountReportInputData
}

export class ResolveAccountReportInputData {
    @ApiProperty()
    @IsUUID("4")
        reportAccountId: string
    @ApiProperty()
        processStatus: ReportProcessStatus
    @ApiProperty()
    @MinLength(20)
        processNote: string
}

export class ResolveAccountReportInput implements AuthInput<ResolveAccountReportInputData> {
    accountId: string
    data: ResolveAccountReportInputData
}

export class CreateConfigurationInputData {
    @ApiProperty()
        foundation: number
}

export class CreateConfigurationInput implements AuthInput<CreateConfigurationInputData> {
    accountId: string
    data: CreateConfigurationInputData
}

export class UpdateAccountInputData {
    @ApiProperty()
        accountId: string
    @ApiProperty()
        username?: string
    @ApiProperty()
        firstName?: string
    @ApiProperty()
        lastName?: string
    @ApiProperty()
        birthdate?: Date
    @ApiProperty()
        roles?: Array<SystemRoles>
    @ApiProperty()
        isDisabled?: boolean
}

export class UpdateAccountInput implements AuthInput<UpdateAccountInputData> {
    accountId: string
    data: UpdateAccountInputData
}

export class CreateAccountInputData {
    @ApiProperty()
        email: string
    @ApiProperty()
        username?: string
    @ApiProperty()
        firstName?: string
    @ApiProperty()
        lastName?: string
    @ApiProperty()
        birthdate?: Date
    @ApiProperty()
        roles?: Array<SystemRoles>
}

export class CreateAccountInput implements AuthInput<CreateAccountInputData> {
    accountId: string
    data: CreateAccountInputData
}

export class VerifyInstructorInputData {
    @ApiProperty()
    @IsUUID("4")
        instructorId: string
    @ApiProperty()
        verifyStatus: InstructorStatus
    @ApiProperty()
    @MinLength(20)
        note: string
}

export class VerifyInstructorInput implements AuthInput<VerifyInstructorInputData> {
    accountId: string
    data: VerifyInstructorInputData
}