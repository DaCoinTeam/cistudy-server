import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { AccountEntity } from "./account.entity"
import { QuizEntity } from "./quiz.entity"
import { QuizAttemptStatus } from "@common"
import { QuizQuestionAnswerEntity } from "./quiz-question-answer.entity"
import { QuizAttemptAnswerEntity } from "./quiz-attempt-answer.entity"
//import { QuizAttemptAnswerEntity } from "./quiz-attempt-answer.entity";

@ObjectType()
@Entity("quiz-attempt")
export class QuizAttemptEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        quizAttemptId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => Float, { nullable: true })
    @Column({ type: "float", default: 0, nullable: true })
        score: number

    @Field(() => String)
    @Column({ type: "enum", enum: QuizAttemptStatus, default: QuizAttemptStatus.Started })
        attemptStatus: QuizAttemptStatus

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

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

    @Field(() => [QuizQuestionAnswerEntity])
    @OneToMany(() => QuizQuestionAnswerEntity, (quizQuestionAnswer) => quizQuestionAnswer.attempt, { onDelete: "CASCADE" ,nullable: true })
        questionAnswers: Array<QuizQuestionAnswerEntity>
    
    @Field(() => [QuizAttemptAnswerEntity])
    @OneToMany(() => QuizAttemptAnswerEntity, (attemptAnswers) => attemptAnswers.quizAttempt, { onDelete: "CASCADE" ,nullable: true })
        attemptAnswers: Array<QuizAttemptAnswerEntity>
}