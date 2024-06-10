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

export class AddToCartOthers {
    @ApiProperty()
    cartCourseId : string;
}

export class AddToCartOutput implements Output<AddToCartOthers> {
    @ApiProperty()
    message: string;
    others?: AddToCartOthers;
}

export class DeleteFromCartOutputOthers {
    @ApiProperty()
    cartId : string;
}

export class DeleteFromCartOutput implements Output<DeleteFromCartOutputOthers> {
    @ApiProperty()
    message: string;
    others?: DeleteFromCartOutputOthers;
}

export class CheckOutOutputOthers {
    @ApiProperty()
    orderId : string;
}

export class CheckOutOutput implements Output<CheckOutOutputOthers> {
    @ApiProperty()
    message: string;
    others?: CheckOutOutputOthers;
}
