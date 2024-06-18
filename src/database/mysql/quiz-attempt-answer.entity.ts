import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QuizEntity } from "./quiz.entity";
import { QuizQuestionEntity } from "./quiz-question.entity";
import { QuizAttemptEntity } from "./quiz-attempt.entity";
import { QuizQuestionAnswerEntity } from "./quiz-question-answer.entity";

// @ObjectType()
// @Entity("quiz-attempt-answer")
// export class QuizAttemptAnswerEntity {

//     @Field(() => ID)
//     @PrimaryGeneratedColumn("uuid")
//     quizAttemptAnswerId: string

//     @Field(() => ID)
//     @Column({ type: "uuid", length: 36 })
//     quizAttemptId: string

//     @Field(() => ID)
//     @Column({ type: "uuid", length: 36 })
//     quizQuestionId: string

//     @Field(() => String)
//     @Column({ type: "varchar", length: 10000 , nullable: true })
//     essayAnswer: string

//     @Field(() => [QuizQuestionAnswerEntity])
//     @OneToMany(() => QuizQuestionAnswerEntity, (questionAnswers) => questionAnswers.attemptAnswers, {nullable: true})
//     answers : Array<QuizQuestionAnswerEntity>

//     @Field(() => QuizAttemptEntity)
//     @ManyToOne(() => QuizAttemptEntity, (quizQuestion) => quizQuestion.attemptAnswers, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
//     @JoinColumn({ name: "quizAttemptId" })
//     quizAttempt: QuizAttemptEntity

//     @Field(() => Date)
//     @CreateDateColumn()
//     createdAt: Date

//     @Field(() => Date)
//     @UpdateDateColumn()
//     updatedAt: Date
    
// }