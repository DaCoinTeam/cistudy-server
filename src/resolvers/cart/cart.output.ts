import { Output } from "@common"
import { OrderMySqlEntity } from "@database"
import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManyUserOrderOutput
{
    @Field(() => [OrderMySqlEntity])
    results: Array<OrderMySqlEntity>
}