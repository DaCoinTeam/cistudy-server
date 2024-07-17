import { Output } from "@common"

export class CreateOrderOutputOthers {
    orderId: string
}

export class CreateOrderOutput implements Output<CreateOrderOutputOthers> {
    message: string
    others: CreateOrderOutputOthers
}

export class CaptureOrderOutputOthers {
    amount: number
}

export class CaptureOrderOutput implements Output<CaptureOrderOutputOthers> {
    message: string
    others: CaptureOrderOutputOthers
}