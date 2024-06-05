import { ParamsOnly, Input, AuthInput, OptionsOnly } from "@common";
import { OrderMySqlEntity } from "@database";
import { Field, ID, InputType, Int } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class FindOneCartInputParams {
    @Field(() => ID)
        cartId: string
}

@InputType()
export class FindOneCartInputData implements ParamsOnly<FindOneCartInputParams> {
    @Field(() => FindOneCartInputParams)
        params: FindOneCartInputParams
}

export class FindOneCartInput implements AuthInput<FindOneCartInputData> {
    userId: string;
    data: FindOneCartInputData
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
    userId: string;
    data: FindOneOrderInputData
}


@InputType()
export class FindManyUserOrdersInputOptions {
    @Field(() => Int, { nullable: true })
        take?: number
    @Field(() => Int, { nullable: true })
        skip?: number
}

@InputType()
export class FindManyUserOrdersInputData
implements
    OptionsOnly<FindManyUserOrdersInputOptions>
{
    @Field(() => FindManyUserOrdersInputOptions, { nullable: true })
    @IsOptional()
        options?: FindManyUserOrdersInputOptions
}

export class FindManyUserOrdersInput implements AuthInput<FindManyUserOrdersInputData> {
    userId: string;
    data: FindManyUserOrdersInputData
}