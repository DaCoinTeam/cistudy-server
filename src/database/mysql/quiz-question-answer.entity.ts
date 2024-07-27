import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { QuizQuestionEntity } from "./quiz-question.entity"
import { QuizAttemptAnswerEntity } from "./quiz-attempt-answer.entity"

@ObjectType()
@Entity("quiz-question-answer")
export class QuizQuestionAnswerEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        quizQuestionAnswerId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizQuestionId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number

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
    
    @Field(() => QuizAttemptAnswerEntity)
    @OneToMany(() => QuizAttemptAnswerEntity, (attemptAnswers) => attemptAnswers.quizQuestionAnswer, { onDelete: "CASCADE" })
        attemptAnswers : Array<QuizAttemptAnswerEntity>

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date
    
}