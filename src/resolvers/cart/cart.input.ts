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