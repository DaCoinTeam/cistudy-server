import { AuthOutput, AuthTokens, Output, ResultsWithMetadata } from "@common"
import { CartMySqlEntity, OrderMySqlEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"


@ObjectType()
export class FindOneCartOutput implements AuthOutput<CartMySqlEntity> {
    @Field(() => CartMySqlEntity)
    data: CartMySqlEntity

    @Field(() => AuthTokens, { nullable: true })
    tokens?: AuthTokens
}

@ObjectType()
export class FindOneOrderOutput implements AuthOutput<OrderMySqlEntity> {
    @Field(() => OrderMySqlEntity)
    data: OrderMySqlEntity

    @Field(() => AuthTokens, { nullable: true })
    tokens?: AuthTokens
}

@ObjectType()
export class FindManyUserOrdersOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyUserOrdersOutputData
implements ResultsWithMetadata<OrderMySqlEntity, FindManyUserOrdersOutputMetadata>
{
    @Field(() => [OrderMySqlEntity])
        results: Array<OrderMySqlEntity>
    @Field(() => FindManyUserOrdersOutputMetadata, { nullable: true })
        metadata: FindManyUserOrdersOutputMetadata
}

@ObjectType()
export class FindManyUserOrdersOutput implements AuthOutput<FindManyUserOrdersOutputData> {
    @Field(() => FindManyUserOrdersOutputData)
        data: FindManyUserOrdersOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}