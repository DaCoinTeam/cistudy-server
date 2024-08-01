import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
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
import { QuizQuestionEntity } from "./quiz-question.entity"

//future plan
@ObjectType()
@Entity("quiz-attempt-question")
export class QuizAttemptQuestionEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        quizAttemptQuestionId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizAttemptId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizQuestionId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0})
        maxPoints: number

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        actualPoints: number

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
        observedAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => QuizAttemptEntity)
    @ManyToOne(() => QuizAttemptEntity, (quizAttempt) => quizAttempt.attemptQuestions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quizAttemptId" })
        quizAttempt: QuizAttemptEntity

    @Field(() => QuizQuestionEntity)
    @ManyToOne(() => QuizQuestionEntity, (quizQuestion) => quizQuestion.attemptQuestions, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quizQuestionId" })
        quizQuestion: QuizQuestionEntity

}