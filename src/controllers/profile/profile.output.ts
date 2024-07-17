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
