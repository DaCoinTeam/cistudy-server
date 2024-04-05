import { ResultsWithMetadata } from "@common"
import { TransactionMongoEntity } from "@database"
import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class FindManyTransactionsOutputMetadata {
  @Field(() => Int, { nullable: true })
      count: number
}

@ObjectType()
export class FindManyTransactionsOutput
implements
    ResultsWithMetadata<
      TransactionMongoEntity,
      FindManyTransactionsOutputMetadata
    >
{
  @Field(() => [TransactionMongoEntity])
      results: Array<TransactionMongoEntity>
  @Field(() => FindManyTransactionsOutputMetadata, { nullable: true })
      metadata: FindManyTransactionsOutputMetadata
}