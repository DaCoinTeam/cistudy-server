import { AuthEmptyDataInput, AuthInput } from "@common";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateCartInput implements AuthEmptyDataInput{
    @IsUUID("4")
    userId: string
}

export class CreateProductCartInputData {
    @IsUUID(4)
    @ApiProperty()
    courseId : string
    @ApiProperty()
    cartId : string
}

export class AddProductCartInput implements AuthInput<CreateProductCartInputData>{
    @IsUUID("4")
    userId: string
    @ApiProperty()
    data: CreateProductCartInputData
}