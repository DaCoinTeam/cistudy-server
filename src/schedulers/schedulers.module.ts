import { Module } from "@nestjs/common"
import { BlockchainEvmModule } from "./blockchain-evm"
import { QuizAttemptsModule } from "./quiz-attempts"

@Module({
    imports: [BlockchainEvmModule, QuizAttemptsModule],
})
export class SchedulersModule {}
