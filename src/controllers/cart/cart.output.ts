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
    cartId : string;
}

export class AddProductCartOutput implements Output<AddProductCartOthers> {
    @ApiProperty()
    message: string;
    others?: CreateCartOutputOthers;
}