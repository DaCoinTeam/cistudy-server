// import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
// import {
//     Column,
//     CreateDateColumn,
//     Entity,
//     JoinColumn,
//     ManyToOne,
//     PrimaryGeneratedColumn,
//     UpdateDateColumn
// } from "typeorm"
// import { QuizAttemptEntity } from "./quiz-attempt.entity"
// import { QuizQuestionAnswerEntity } from "./quiz-question-answer.entity"

// //future plan
// @ObjectType()
// @Entity("quiz-attempt-question")
// export class QuizAttemptQuestionEntity {

//     @Field(() => ID)
//     @PrimaryGeneratedColumn("uuid")
//         quizAttemptQuestionId: string

//     @Field(() => ID)
//     @Column({ type: "uuid", length: 36 })
//         quizAttemptId: string

//     @Field(() => ID)
//     @Column({ type: "uuid", length: 36 })
//         quizQuestionId: string

//     @Field(() => Int, { nullable: true })
//     @Column({ type: "int", nullable: true })
//         maxPoints: number

//     @Field(() => Int, { nullable: true })
//     @Column({ type: "int", nullable: true })
//         actualPoints: number

//     @Field(() => Date)
//     @CreateDateColumn()
//         createdAt: Date

//     @Field(() => Date)
//         observedAt: Date

//     @Field(() => Date)
//     @UpdateDateColumn()
//         updatedAt: Date

//     @Field(() => QuizAttemptEntity)
//     @ManyToOne(() => QuizAttemptEntity, (quizAttempt) => quizAttempt.attemptAnswers, { onDelete: "CASCADE" })
//     @JoinColumn({ name: "quizAttemptId" })
//         quizAttempt: QuizAttemptEntity

//     @Field(() => QuizQuestionAnswerEntity)
//     @ManyToOne(() => QuizQuestionAnswerEntity, (questionAnswer) => questionAnswer.attemptAnswers, { onDelete: "CASCADE" })
//     @JoinColumn({ name: "quizQuestionAnswerId" })
//         quizQuestionAnswer: QuizQuestionAnswerEntity

//     @Field(() => Boolean, { nullable: true })
//         corrected?: boolean
// }