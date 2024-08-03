import { Inject, Logger } from "@nestjs/common"

import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    WsResponse,
} from "@nestjs/websockets"

import { Server, Socket } from "socket.io"
import { INITIALIZE, INITIALIZED } from "./initialization.events"
import { InitializeOutputData } from "./initialization.output"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { Cache } from "cache-manager"
import { Interval } from "@nestjs/schedule"
import { InjectRepository } from "@nestjs/typeorm"
import { NotificationMySqlEntity, QuizAttemptMySqlEntity } from "@database"
import { Repository } from "typeorm"
import { uuidV4 } from "web3-utils"
import { QuizAttemptStatus } from "@common"

@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class InitializationGateway
implements OnGatewayConnection, OnGatewayDisconnect
{
    private readonly logger = new Logger(InitializationGateway.name)

    constructor(
    @InjectRepository(NotificationMySqlEntity)
    private readonly notificationMySqlRepository: Repository<NotificationMySqlEntity>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
    @InjectRepository(QuizAttemptMySqlEntity)
    private readonly quizAttemptMySqlRepository: Repository<QuizAttemptMySqlEntity>,
    ) {}

  @WebSocketServer()
    private readonly server: Server

  handleConnection(client: Socket) {
      this.logger.verbose(client.id)
  }

  async handleDisconnect(client: Socket) {
      const accountId = (await this.cacheManager.get(client.id)) as string
      if (accountId) {
          let clientIds = ((await this.cacheManager.get(accountId)) ?? []) as Array<string>
          clientIds = clientIds.filter((clientId) => clientId !== client.id)
          if (!clientIds.length) {
              await this.cacheManager.set(accountId, clientIds, 0)
          } else {
              await this.cacheManager.del(accountId)
          }
      }
      await this.cacheManager.del(client.id)
  }

  @SubscribeMessage(INITIALIZE)
  async handleInitialize(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: InitializeBody,
  ): Promise<WsResponse<InitializeOutputData>> {
      const { accountId } = body
      const clientIds =
      ((await this.cacheManager.get(accountId)) as Array<string>) ?? []
      await this.cacheManager.set(accountId, [...clientIds, client.id], 0)
      await this.cacheManager.set(client.id, accountId, 0)
      return { event: INITIALIZED, data: "Connected" }
  }

  @Interval(1000)
  async publish() {
      const notifications = await this.notificationMySqlRepository.find({
          where: {
              isPublished: false,
          },
      })

      await this.notificationMySqlRepository.save(notifications.map(notification => {
          notification.isPublished = true
          return notification
      }))
      
      for (const notification of notifications) {
          const { receiverId } = notification
          const clientIds =
        ((await this.cacheManager.get(receiverId)) as Array<string>) ?? []
          for (const clientId of clientIds) {
              this.server.to(clientId).emit("notifications", uuidV4())
          }
      }
  }

  @Interval(1000)
  async processAttempts() {
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

      for (const attempt of attempts) {
          const promise = async () => {
              const { quizAttemptId, timeLeft } = attempt
              if (timeLeft < 1000) { 
                  //chấm điểm
                  await this.quizAttemptMySqlRepository.update(attempt.quizAttemptId, {
                      timeLeft: 0,
                      attemptStatus: QuizAttemptStatus.Ended,
                  })

                  const { attemptAnswers, quiz, timeLeft, timeLimitAtStart, accountId } = attempt
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

                  const clientIds =
                  ((await this.cacheManager.get(accountId)) as Array<string>) ?? []
                  for (const clientId of clientIds) {
                      this.server.to(clientId).emit("finishAttempt", {
                          receivedPercent,
                          isPassed,
                          timeTaken,
                          receivedPoints,
                          totalPoints,
                      })
                  }
                       
              } else {
                  await this.quizAttemptMySqlRepository.update(quizAttemptId, {
                      timeLeft: timeLeft - 1000,
                  })
              }
          }
          promises.push(promise())
      }
      await Promise.all(promises)
  }
}

export interface InitializeBody {
  accountId: string
}
