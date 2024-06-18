import { ParamsOnly, Input, AuthInput, OptionsOnly, AuthEmptyDataInput, OrderStatus } from "@common";
import { OrderMySqlEntity } from "@database";
import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { IsOptional } from "class-validator";


export class FindOneCartInput implements AuthEmptyDataInput {
    accountId: string;
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
    accountId: string;
    data: FindOneOrderInputData
}


@InputType()
export class FindManyAccountOrdersInputOptions {
    @Field(() => Int, { nullable: true })
    take?: number
    @Field(() => Int, { nullable: true })
    skip?: number
    @Field(() => String)
    orderStatus: OrderStatus
}

@InputType()
export class FindManyAccountOrdersInputData
    implements
    OptionsOnly<FindManyAccountOrdersInputOptions> {
    @Field(() => FindManyAccountOrdersInputOptions, { nullable: true })
    options?: FindManyAccountOrdersInputOptions
}

export class FindManyAccountOrdersInput implements AuthInput<FindManyAccountOrdersInputData> {
    accountId: string;
    data: FindManyAccountOrdersInputData
}

