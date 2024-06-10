import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { LectureEntity } from "./lecture.entity";
import { QuizQuestionEntity } from "./quiz-question.entity";
import { QuizAttemptEntity } from "./quiz-attempt.entity";

@ObjectType()
@Entity("quiz")
export class QuizEntity {

    @Field(() => ID)
    @PrimaryColumn("uuid")
    quizId: string

    @Field(() => QuizQuestionEntity)
    @OneToMany(() => QuizQuestionEntity, (quizQuestion) => quizQuestion.quiz, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    questions: Array<QuizQuestionEntity>

    @Field(() => Int)
    @Column({ type: "int", nullable: true })
    timeLimit: Number;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => LectureEntity)
    @OneToOne(() => LectureEntity, (lecture) => lecture.quiz, {onDelete : "CASCADE"})
    @JoinColumn({ name: "quizId" })
    lecture: LectureEntity

    @Field(() => QuizAttemptEntity)
    @OneToMany(() => QuizAttemptEntity, (quizAttempts) => quizAttempts.quiz)
    quizAttempts?: Array<QuizAttemptEntity>
}