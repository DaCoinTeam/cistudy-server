import { AuthInput } from "@common"
import { ApiProperty } from "@nestjs/swagger"
import { IsUUID } from "class-validator"


export class AddToCartInputData {
    @IsUUID("4")
    @ApiProperty()
        courseId : string
}

export class AddToCartInput implements AuthInput<AddToCartInputData>{
    @IsUUID("4")
        accountId: string
    @ApiProperty()
        data: AddToCartInputData
}

export class DeleteFromCartInputData {
    @ApiProperty()
        cartCourseIds : string[]
}

export class DeleteFromCartInput implements AuthInput<DeleteFromCartInputData>{
    @IsUUID("4")
        accountId: string
    data: DeleteFromCartInputData
}


export class CheckOutInputData {
    @ApiProperty()
        cartCourseIds: string[]
}

export class CheckOutInput implements AuthInput<CheckOutInputData>{
    @IsUUID("4")
        accountId: string
    data: CheckOutInputData
}
