import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { QuizQuestionEntity } from "./quiz-question.entity"
import { QuizAttemptEntity } from "./quiz-attempt.entity"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("quiz")
export class QuizEntity {

    @Field(() => ID)
    @PrimaryColumn("uuid")
        quizId: string

    @Field(() => [QuizQuestionEntity])
    @OneToMany(() => QuizQuestionEntity, (quizQuestion) => quizQuestion.quiz, { onDelete: "CASCADE", onUpdate: "CASCADE" })
        questions: Array<QuizQuestionEntity>

    @Field(() => Int, { nullable: true })
    @Column({ type: "int", nullable: true })
        timeLimit: number

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => SectionContentEntity)
    @OneToOne(() => SectionContentEntity, (sectionContent) => sectionContent.quiz, { cascade: true, onDelete: "CASCADE" })
    @JoinColumn({ name: "quizId" })
        sectionContent: SectionContentEntity

    @Field(() => QuizAttemptEntity)
    @OneToMany(() => QuizAttemptEntity, (quizAttempts) => quizAttempts.quiz, { onDelete: "CASCADE" })
        quizAttempts?: Array<QuizAttemptEntity>

    //graphql
    @Field(() => Int, { nullable: true })
        totalNumberOfAttempts?: number
    @Field(() => Float, { nullable: true, defaultValue: 0 })
        highestScoreRecorded?: number
    @Field(() => Float, { nullable: true })
        lastAttemptScore?: number
    @Field(() => String, { nullable: true })
        lastAttemptTimeTaken?: string
}