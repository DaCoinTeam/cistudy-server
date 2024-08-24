import { Output } from "@common"

export class UpdateProfileOutput implements Output {
    message: string
}

export class WithdrawOutput implements Output {
    message: string
}

export class DepositOthers {
    amount: number
}

export class DepositOutput implements Output<DepositOthers> {
    message: string
    others: DepositOthers
}

export class MarkNotificationAsReadOutput implements Output {
    message: string
}

export class MarkAllNotificationsAsReadOutput implements Output {
    message: string
}


export class DeleteNotificationOutput implements Output {
    message: string
}

export class IsSastifyCommunityStandardOutput {
    data: {
        result: boolean
        reason?: string
    }
}

export class AddJobOutput implements Output {
    message: string
}

export class UpdateJobOutput implements Output {
    message: string
}

export class DeleteJobOutput implements Output {
    message: string
}

export class DeleteQualificationOutput implements Output {
    message: string
}

export class AddQualificationInputOutput implements Output {
    message: string
}

export class RegisterInstructorOutput implements Output {
    message: string
}

export class UpdateQualificationOutput implements Output {
    message: string
}

export class ChangePasswordOutput implements Output {
    message: string
}

export class CreateCourseConfigurationOutput implements Output {
    message: string
}