import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { QuizAttemptEntity } from "./quiz-attempt.entity"
import { QuizQuestionAnswerEntity } from "./quiz-question-answer.entity"

@ObjectType()
@Entity("quiz-attempt-answer")
export class QuizAttemptAnswerEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        quizAttemptAnswerId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizAttemptId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizQuestionAnswerId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => QuizAttemptEntity)
    @ManyToOne(() => QuizAttemptEntity, (quizAttempt) => quizAttempt.attemptAnswers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quizAttemptId" })
        quizAttempt: QuizAttemptEntity

    @Field(() => QuizQuestionAnswerEntity)
    @ManyToOne(() => QuizQuestionAnswerEntity, (questionAnswer) => questionAnswer.attemptAnswers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quizQuestionAnswerId" })
        quizQuestionAnswer: QuizQuestionAnswerEntity
}