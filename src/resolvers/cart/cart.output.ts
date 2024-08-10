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
export class FindManyOrdersOutputMetadata {
    @Field(() => Int, { nullable: true })
        count?: number
}

@ObjectType()
export class FindManyOrdersOutputData
implements ResultsWithMetadata<OrderMySqlEntity, FindManyOrdersOutputMetadata>
{
    @Field(() => [OrderMySqlEntity])
        results: Array<OrderMySqlEntity>
    @Field(() => FindManyOrdersOutputMetadata, { nullable: true })
        metadata: FindManyOrdersOutputMetadata
}

@ObjectType()
export class FindManyOrdersOutput implements AuthOutput<FindManyOrdersOutputData> {
    @Field(() => FindManyOrdersOutputData)
        data: FindManyOrdersOutputData
    @Field(() => AuthTokens, { nullable: true })
        tokens?: AuthTokens
}