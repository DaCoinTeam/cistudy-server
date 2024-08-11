import { Output } from "@common"
import { IsUUID } from "class-validator"

export class VerifyCourseOuputOther {
    courseId : string
}

export class VerifyCourseOuput implements Output<VerifyCourseOuputOther>{
    message: string
    others : VerifyCourseOuputOther
}

export class CreateAccountReviewOutputOthers {
    @IsUUID("4")
        accountReviewId : string
}

export class CreateAccountReviewOutput implements Output<CreateAccountReviewOutputOthers>{
    message: string
    others?: CreateAccountReviewOutputOthers
}

export class CreateRoleOutput implements Output{
    message: string
}

export class CreateAccountRoleOutput implements Output{
    message: string
}

export class ToggleRoleOutput implements Output{
    message: string
}

export class UpdateRoleOutput implements Output{
    message: string
}

export class UpdateAccountRoleOutput implements Output{
    message: string
}

export class CreateAccountReportOutputOthers {
    @IsUUID("4")
        reportAccountId : string
}

export class CreateAccountReportOutput implements Output<CreateAccountReportOutputOthers>{
    message: string
    others?: CreateAccountReportOutputOthers
}

export class UpdateAccountReportOutputOthers {
    @IsUUID("4")
        reportAccountId : string
}

export class UpdateAccountReportOutput implements Output<UpdateAccountReportOutputOthers>{
    message: string
    others?: UpdateAccountReportOutputOthers
}

export class ResolveAccountReportOutput implements Output{
    message: string   
}

export class CreateConfigurationOutput implements Output{
    message: string   
}