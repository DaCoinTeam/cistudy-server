import { TransactionMongoEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { DataSource } from "typeorm"
import {
    FindManyTransactionsInput
} from "./transactions.input"
import { FindManyTransactionsOutput } from "./transactions.output"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"

@Injectable()
export class TransactionsService {
    constructor(
    @InjectModel(TransactionMongoEntity.name)
    private readonly transactionMongoModel: Model<TransactionMongoEntity>,
    private readonly dataSource: DataSource,
    ) {}

    async findManyTransactions(
        input: FindManyTransactionsInput,
    ): Promise<FindManyTransactionsOutput> {
        const { data } = input
        const { options } = data
        const { take, skip } = { ...options }
        
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
 
        try {
            const transactions = await this.transactionMongoModel.find().skip(skip).limit(take).exec()

            const count = await this.transactionMongoModel.countDocuments()
            await queryRunner.commitTransaction()

            return {
                results: transactions,
                metadata: {
                    count
                }
            }
        } catch (ex) {
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
    }
}
