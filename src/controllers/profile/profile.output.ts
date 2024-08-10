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
