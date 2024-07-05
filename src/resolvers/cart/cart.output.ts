import { AuthOutput, AuthTokens, ResultsWithMetadata } from "@common"
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
export class FindManyAccountOrdersOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyAccountOrdersOutputData
implements ResultsWithMetadata<OrderMySqlEntity, FindManyAccountOrdersOutputMetadata>
{
    @Field(() => [OrderMySqlEntity])
        results: Array<OrderMySqlEntity>
    @Field(() => FindManyAccountOrdersOutputMetadata, { nullable: true })
        metadata: FindManyAccountOrdersOutputMetadata
}

@ObjectType()
export class FindManyAccountOrdersOutput implements AuthOutput<FindManyAccountOrdersOutputData> {
    @Field(() => FindManyAccountOrdersOutputData)
        data: FindManyAccountOrdersOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}