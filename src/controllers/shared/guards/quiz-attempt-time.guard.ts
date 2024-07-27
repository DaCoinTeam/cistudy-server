import { Payload, QuizAttemptStatus } from "@common"
import { QuizAttemptMySqlEntity } from "@database"
import { CanActivate, ConflictException, ExecutionContext, Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class QuizAttemptTimeGuard implements CanActivate {
    constructor(
        @InjectRepository(QuizAttemptMySqlEntity)
        private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>,
    ) { }
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const { accountId } = request.user as Payload
        const { quizId } = request.body
        
        if (!quizId) throw new NotFoundException("Quiz Id not found")

        const { quizAttemptId, timeLeft, updatedAt } = await this.quizAttemptMySqlRepository.findOne({
            where: {
                accountId,
                attemptStatus: QuizAttemptStatus.Started,
                quizId
            }
        })

        const currentTimeLeft = timeLeft - (Date.now() - updatedAt.getTime())
        
        if (currentTimeLeft <= 0) {
            await this.quizAttemptMySqlRepository.update(quizAttemptId, {
                attemptStatus: QuizAttemptStatus.Ended,
                timeLeft: 0
            })
            throw new ConflictException("Quiz attempt has been ended")
        } else {
            await this.quizAttemptMySqlRepository.update(quizAttemptId, {
                timeLeft: currentTimeLeft
            })
        }
        return true
    }
}