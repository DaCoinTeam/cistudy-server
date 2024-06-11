import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QuizEntity } from "./quiz.entity";
import { MediaType } from "@common";
import { QuizQuestionEntity } from "./quiz-question.entity";

@ObjectType()
@Entity("quiz-question-media")
export class QuizQuestionMediaEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
    quizQuestionMediaId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
    position: number

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    mediaId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    quizQuestionId: string

    @Field(() => String)
    @Column({
        type: "enum",
        enum: MediaType,
        default: MediaType.Image,
    })
    mediaType: MediaType

    @Field(() => QuizQuestionEntity)
    @ManyToOne(() => QuizQuestionEntity, (quiz) => quiz.questionMedias, { onDelete: "CASCADE" })
    @JoinColumn({ name: "quizQuestionId" })
    quiz: QuizQuestionEntity

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date
}