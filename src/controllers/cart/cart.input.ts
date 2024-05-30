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

export class DeleteCartProductData {
    @ApiProperty()
    productId : string[]
}

export class DeleteCartProductDataInput implements AuthInput<DeleteCartProductData>{
    @IsUUID("4")
    userId: string;
    data: DeleteCartProductData;
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