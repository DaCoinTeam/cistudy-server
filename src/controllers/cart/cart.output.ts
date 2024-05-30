import { Output } from "@common";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCartOutputOthers {
    @ApiProperty()
    cartId : string;
}

export class CreateCartOutput implements Output<CreateCartOutputOthers> {
    @ApiProperty()
    message: string;
    others?: CreateCartOutputOthers;
}

export class AddProductCartOthers {
    @ApiProperty()
    productId : string;
}

export class AddProductCartOutput implements Output<AddProductCartOthers> {
    @ApiProperty()
    message: string;
    others?: AddProductCartOthers;
}

export class DeleteCartProductOthers {
    @ApiProperty()
    cartId : string;
}

export class DeleteCartProductOutput implements Output<DeleteCartProductOthers> {
    @ApiProperty()
    message: string;
    others?: DeleteCartProductOthers;
}

export class DeleteUserCartOthers {
    @ApiProperty()
    cartId : string;
}

export class DeleteUserCartOutput implements Output<DeleteUserCartOthers> {
    @ApiProperty()
    message: string;
    others?: DeleteUserCartOthers;
}