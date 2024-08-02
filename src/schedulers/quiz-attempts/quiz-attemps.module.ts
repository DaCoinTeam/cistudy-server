import { Module } from "@nestjs/common"
import {
    QuizAttemptMySqlEntity,
} from "@database"
import { TypeOrmModule } from "@nestjs/typeorm"
import { QuizAttemptsService } from "./quiz-attempts.service"

@Module({
    imports: [
        TypeOrmModule.forFeature([QuizAttemptMySqlEntity]),
    ],
    providers: [QuizAttemptsService],
})
export class QuizAttemptsModule {}
