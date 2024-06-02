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

export class AddCourseCartOthers {
    @ApiProperty()
    cartCourseId : string;
}

export class AddCourseCartOutput implements Output<AddCourseCartOthers> {
    @ApiProperty()
    message: string;
    others?: AddCourseCartOthers;
}

export class DeleteCartCourseOthers {
    @ApiProperty()
    cartId : string;
}

export class DeleteCartCourseOutput implements Output<DeleteCartCourseOthers> {
    @ApiProperty()
    message: string;
    others?: DeleteCartCourseOthers;
}

export class DeleteUserCartOutputOthers {
    @ApiProperty()
    cartId : string;
}

export class DeleteUserCartOutput implements Output<DeleteUserCartOutputOthers> {
    @ApiProperty()
    message: string;
    others?: DeleteUserCartOutputOthers;
}

export class CreateOrderOutputOthers {
    @ApiProperty()
    orderId : string;
}

export class CreateOrderOutput implements Output<CreateOrderOutputOthers> {
    @ApiProperty()
    message: string;
    others?: CreateOrderOutputOthers;
}