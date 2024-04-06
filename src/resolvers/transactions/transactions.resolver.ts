import { Resolver, Query, Args } from "@nestjs/graphql"
import { TransactionsService } from "./transactions.service"
import { FindManyTransactionsInputData } from "./transactions.input"
import {
    FindManyTransactionsOutput
} from "./transactions.output"

@Resolver()
export class TransactionsResolver {
    constructor(private readonly transactionsService: TransactionsService) {}

  @Query(() => FindManyTransactionsOutput)
    async findManyTransactions(
    @Args("data") data: FindManyTransactionsInputData,
    ) {
        return this.transactionsService.findManyTransactions({ data })
    }
}
