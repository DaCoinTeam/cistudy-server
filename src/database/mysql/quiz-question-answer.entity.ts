import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QuizEntity } from "./quiz.entity";
import { QuizQuestionEntity } from "./quiz-question.entity";
import { QuizAttemptEntity } from "./quiz-attempt.entity";

@ObjectType()
@Entity("quiz-question-answer")
export class QuizQuestionAnswerEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    quizQuestionAnswerId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    quizQuestionId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 1000 , nullable: true })
    content: string

    @Field(() => Boolean)
    @Column({ type: "boolean", default: false , nullable: true })
    isCorrect: boolean

    @Field(() => [QuizQuestionEntity])
    @ManyToOne(() => QuizQuestionEntity, (quizQuestion) => quizQuestion.answers, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "quizQuestionId" })
    quizQuestion: QuizQuestionEntity
    
    // @Field(() => QuizAttemptAnswerEntity)
    // @ManyToOne(() => QuizAttemptAnswerEntity, (attemptAnswers) => attemptAnswers.answers)
    // attemptAnswers : QuizAttemptAnswerEntity

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => QuizAttemptEntity)
    @ManyToOne(() => QuizAttemptEntity, (quizAttempt) => quizAttempt.questionAnswers)
    attempt : QuizAttemptEntity
    
}