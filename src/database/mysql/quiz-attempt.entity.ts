import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { QuizEntity } from "./quiz.entity";

@ObjectType()
@Entity("quiz-attempt")
export class QuizAttemptEntity {

    @Field(() => ID)
    @PrimaryColumn("uuid")
    quizAttemptId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    quizId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
    userId: string

    @Field(() => Int)
    @Column({ type: "int", nullable: true })
    score: Number;

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.quizAttempts)
    @JoinColumn({ name: "userId" })
    user: UserEntity

    @Field(() => QuizEntity)
    @ManyToOne(() => QuizEntity, (quiz) => quiz.quizAttempts)
    @JoinColumn({ name: "quizId" })
    quiz: QuizEntity
}