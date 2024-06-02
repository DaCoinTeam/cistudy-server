import { AuthEmptyDataInput, AuthInput } from "@common";
import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class CreateCartInput implements AuthEmptyDataInput{
    @IsUUID("4")
    userId: string
}

export class CreateCourseCartInputData {
    @IsUUID(4)
    @ApiProperty()
    courseId : string
    @ApiProperty()
    cartId : string
}

export class AddCourseCartInput implements AuthInput<CreateCourseCartInputData>{
    @IsUUID("4")
    userId: string
    @ApiProperty()
    data: CreateCourseCartInputData
}

export class DeleteCartCourseData {
    @ApiProperty()
    cartCourseId : string[]
}

export class DeleteCartCourseDataInput implements AuthInput<DeleteCartCourseData>{
    @IsUUID("4")
    userId: string;
    data: DeleteCartCourseData;
}

export class DeleteCartData {
    @IsUUID("4")
    @ApiProperty()
    cartId : string
}

export class DeleteCartDataInput implements AuthInput<DeleteCartData>{
    @IsUUID("4")
    userId: string;
    data: DeleteCartData;
}

export class CreateOrderInputData {
    @IsUUID("4")
    @ApiProperty()
    cartId: string
}

export class CreateOrderInput implements AuthInput<CreateOrderInputData>{
    @IsUUID("4")
    userId: string
    data: CreateOrderInputData;
}