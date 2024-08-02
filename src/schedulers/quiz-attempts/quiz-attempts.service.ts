import { QuizAttemptStatus, parseDuration } from "@common"
import { QuizAttemptMySqlEntity } from "@database"
import { Injectable, Logger } from "@nestjs/common"
import { Interval } from "@nestjs/schedule"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

@Injectable()
export class QuizAttemptsService {
    private readonly logger = new Logger(QuizAttemptsService.name)
    constructor(
        @InjectRepository(QuizAttemptMySqlEntity)
        private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>
    ) {

    }
    @Interval(1000)
    async start() {
        const attempts = await this.quizAttemptMySqlRepository.find({
            where: {
                attemptStatus: QuizAttemptStatus.Started
            },
            relations: {
                attemptAnswers: {
                    quizQuestionAnswer: true,
                },
                quiz: {
                    questions: {
                        answers: true,
                    },
                },
            },
        })

        const promises: Array<Promise<void>> = []
        let messages: Array<string> = []

        for (const attempt of attempts) {
            const promise = async () => {
                const { quizAttemptId, timeLeft } = attempt
                if (timeLeft < 1000) { 
                    //chấm điểm
                    await this.quizAttemptMySqlRepository.update(attempt.quizAttemptId, {
                        timeLeft: 0,
                        attemptStatus: QuizAttemptStatus.Ended,
                    })

                    const { attemptAnswers, quiz, timeLeft, timeLimitAtStart } = attempt
                    const { questions } = quiz

                    let receivedPoints = 0

                    for (const { answers, point } of questions) {
                        const correctAnswers = answers.filter(({ isCorrect }) => isCorrect)
                        if (!correctAnswers.length) {
                            receivedPoints += point
                            continue
                        }
                        const pointEachCorrectAnswer = point / correctAnswers.length
                        const attemptAnswersInThisQuestion = attemptAnswers.filter(
                            ({ quizQuestionAnswerId }) =>
                                answers
                                    .map(({ quizQuestionAnswerId }) => quizQuestionAnswerId)
                                    .includes(quizQuestionAnswerId),
                        )
                        if (attemptAnswersInThisQuestion.length > correctAnswers.length)
                            continue
                        for (const { quizQuestionAnswerId } of attemptAnswersInThisQuestion) {
                            if (
                                correctAnswers
                                    .map(({ quizQuestionAnswerId }) => quizQuestionAnswerId)
                                    .includes(quizQuestionAnswerId)
                            ) {
                                receivedPoints += pointEachCorrectAnswer
                            }
                        }
                    }

                    const totalPoints = questions.reduce((accumulator, { point }) => {
                        return accumulator + point
                    }, 0)

                    const receivedPercent = (receivedPoints / totalPoints) * 100
                    const isPassed = receivedPercent >= quiz.passingPercent
                    const timeTaken = timeLimitAtStart - timeLeft

                    await this.quizAttemptMySqlRepository.update(quizAttemptId, {
                        isPassed,
                        timeLeft: 0,
                        receivedPercent,
                        timeTaken,
                        receivedPoints,
                        totalPoints,
                        observedAt: new Date(),
                        attemptStatus: QuizAttemptStatus.Ended,
                    })
                    messages.push(`Quiz ${quizAttemptId} has been finished.`)
                } else {
                    await this.quizAttemptMySqlRepository.update(quizAttemptId, {
                        timeLeft: timeLeft - 1000,
                    })
                    messages.push(`Quiz ${quizAttemptId} has been reduced time limit by 1s. Now ${parseDuration(timeLeft/1000 - 1)}`)
                }
            }
            promises.push(promise())
        }
        await Promise.all(promises)
        this.logger.verbose(messages)
        messages = []
    }
}