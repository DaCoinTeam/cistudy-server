import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"

export class CreateOrderData {
    @ApiProperty()
        amount: number
    @ApiProperty()
        isSandbox?: boolean
}

export class CreateOrderInput implements AuthInput<CreateOrderData> {
    @IsUUID("4")
    	accountId: string
    data: CreateOrderData
}

export class CaptureOrderData {
    @ApiProperty()
        orderId: string
    @ApiProperty()
        isSandbox?: boolean
}

export class CaptureOrderInput implements AuthInput<CaptureOrderData> {
    @IsUUID("4")
    	accountId: string
    data: CaptureOrderData
}