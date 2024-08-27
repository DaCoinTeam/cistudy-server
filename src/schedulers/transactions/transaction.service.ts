import { TransactionStatus } from "@common"
import { TransactionMySqlEntity } from "@database"
import { Injectable } from "@nestjs/common"
import { Cron } from "@nestjs/schedule"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(TransactionMySqlEntity)
        private readonly transactionMySqlRepository: Repository<TransactionMySqlEntity>,
    ) {}
    
    @Cron("* * * * *")
    async handleCron() {
        const trasactions = await this.transactionMySqlRepository.find({
            where: {
                status: TransactionStatus.Pending
            }
        })

        for (const { createdAt, transactionId } of trasactions) {
            const after3Days = new Date(createdAt)
            after3Days.setDate(after3Days.getDate() + 3)

            const promises: Array<Promise<void>> = []
            if (new Date() > after3Days) {
                promises.push((async () => {
                    await this.transactionMySqlRepository.update(transactionId, {
                        status: TransactionStatus.Success
                    })
                })())
            }

            Promise.all(promises)
        }
    }
}
