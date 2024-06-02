import { ParamsOnly, Input } from "@common";
import { Field, ID, InputType } from "@nestjs/graphql";

@InputType()
export class FindOneCartInputParams {
    @Field(() => ID)
        cartId: string
    @Field(() => ID, { nullable: true })
        userId?: string
}

@InputType()
export class FindOneCartInputData implements ParamsOnly<FindOneCartInputParams> {
    @Field(() => FindOneCartInputParams)
        params: FindOneCartInputParams
}

export class FindOneCartInput implements Input<FindOneCartInputData> {
    data: FindOneCartInputData
}

@InputType()
export class FindOneOrderInputParams {
    @Field(() => ID)
        orderId: string
    @Field(() => ID, { nullable: true })
        userId?: string
}

@InputType()
export class FindOneOrderInputData implements ParamsOnly<FindOneOrderInputParams> {
    @Field(() => FindOneOrderInputParams)
        params: FindOneOrderInputParams
}

export class FindOneOrderInput implements Input<FindOneOrderInputData> {
    data: FindOneOrderInputData
}