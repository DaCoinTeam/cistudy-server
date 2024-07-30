import { QuizAttemptStatus } from "@common"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { QuizAttemptAnswerEntity } from "./quiz-attempt-answer.entity"
import { QuizEntity } from "./quiz.entity"


@ObjectType()
@Entity("quiz-attempt")
export class QuizAttemptEntity {

    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn("uuid")
        quizAttemptId: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36 })
        quizId: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => Float, { nullable: true })
    @Column({ type: "float", default: 0, nullable: true })
        receivedPercent?: number

    @Field(() => Float, { nullable: true })
    @Column({ type: "boolean", default: false, nullable: true })
        isPassed?: boolean

    @Field(() => String, { nullable: true })
    @Column({ type: "enum", enum: QuizAttemptStatus, default: QuizAttemptStatus.Started })
        attemptStatus: QuizAttemptStatus

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", default: 0 })
        timeTaken : number
    
    @Field(() => Int, { nullable: true })
    @Column({ type: "int", default: 1000 * 60 * 60 * 60 })
        timeLeft : number
    
    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
        receivedPoints : number
    
    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
        totalPoints : number
    
    @Field(() => Int)
    @Column({ type: "int", default: 1 })
        currentQuestionPosition: number

    @Field(() => Date)
    @CreateDateColumn()

        createdAt: Date
    @Field(() => Date)

    @CreateDateColumn()
        observedAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.quizAttempts, { onDelete: "CASCADE" })
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

    @Field(() => QuizEntity)
    @ManyToOne(() => QuizEntity, (quiz) => quiz.quizAttempts, { onDelete : "CASCADE" })
    @JoinColumn({ name: "quizId" })
        quiz: QuizEntity
    
    @Field(() => [QuizAttemptAnswerEntity])
    @OneToMany(() => QuizAttemptAnswerEntity, (attemptAnswers) => attemptAnswers.quizAttempt)
        attemptAnswers: Array<QuizAttemptAnswerEntity>

}