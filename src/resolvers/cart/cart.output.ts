import { AuthOutput, AuthTokens, Output } from "@common"
import { CartMySqlEntity, OrderMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManyUserOrderOutput implements AuthOutput<Array<OrderMySqlEntity>> {
    @Field(() => [OrderMySqlEntity])
    data: Array<OrderMySqlEntity>
    @Field(() => AuthTokens, { nullable: true })
    tokens?: AuthTokens
}

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