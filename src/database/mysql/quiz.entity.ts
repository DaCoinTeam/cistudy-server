import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn, UpdateDateColumn } from "typeorm"
import { QuizAttemptEntity } from "./quiz-attempt.entity"
import { QuizQuestionEntity } from "./quiz-question.entity"
import { SectionContentEntity } from "./section_content.entity"

@ObjectType()
@Entity("quiz")
export class QuizEntity {

    @Field(() => ID)
    @PrimaryColumn("uuid")
        quizId: string
    
    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
        description: string

    @Field(() => [QuizQuestionEntity], {nullable: true})
    @OneToMany(() => QuizQuestionEntity, (quizQuestion) => quizQuestion.quiz, { onDelete: "CASCADE", onUpdate: "CASCADE" })
        questions: Array<QuizQuestionEntity>

    @Field(() => Float)
    @Column({ type: "float", default: 1000 * 60 * 15 })
        timeLimit: number

    @Field(() => Float, { nullable: true })
    @Column({ type: "float", default: 80 })
        passingPercent: number
    
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

    @Field(() => [QuizAttemptEntity], {nullable: true})
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
    @Field(() => Boolean, { nullable: true })
        isPassed?: boolean
    @Field(() => Boolean, { defaultValue: false })
        isLocked?: boolean
    @Field(() => QuizAttemptEntity, { nullable: true })
        activeQuizAttempt?: QuizAttemptEntity
    @Field(() => Boolean, { nullable: true })
        blockAttempt?: boolean
    @Field(() => Date, { nullable: true })
        blockAttemptTimeWait?: Date
}