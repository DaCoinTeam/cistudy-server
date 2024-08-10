import { AuthEmptyDataInput, AuthInput, OptionsOnly, OrderStatus, ParamsOnly } from "@common"
import { Field, ID, InputType, Int } from "@nestjs/graphql"


export class FindOneCartInput implements AuthEmptyDataInput {
    accountId: string
}

@InputType()
export class FindOneOrderInputParams {
    @Field(() => ID)
        orderId: string
}

@InputType()
export class FindOneOrderInputData implements ParamsOnly<FindOneOrderInputParams> {
    @Field(() => FindOneOrderInputParams)
        params: FindOneOrderInputParams
}

export class FindOneOrderInput implements AuthInput<FindOneOrderInputData> {
    accountId: string
    data: FindOneOrderInputData
}


@InputType()
export class FindManyOrdersInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
    @Field(() => String, {nullable: true})
        orderStatus?: OrderStatus
}

@InputType()
export class FindManyOrdersInputData
implements
    OptionsOnly<FindManyOrdersInputOptions> {
    @Field(() => FindManyOrdersInputOptions, { nullable: true })
        options?: FindManyOrdersInputOptions
}

export class FindManyOrdersInput implements AuthInput<FindManyOrdersInputData> {
    accountId: string
    data: FindManyOrdersInputData
}

