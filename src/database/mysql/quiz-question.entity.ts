import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    JoinColumn, 
    ManyToOne, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm"
import { QuizQuestionAnswerEntity } from "./quiz-question-answer.entity"
import { QuizEntity } from "./quiz.entity"
import { MediaType } from "@common"
import { QuizAttemptQuestionEntity } from "./quiz-attempt-question.entity"



@ObjectType()
@Entity("quiz-question")
export class QuizQuestionEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        quizQuestionId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        quizId: string

    @Field(() => ID, {nullable: true})
    @Column({ type: "uuid", length: 36 , nullable: true})
        mediaId: string

    @Field(() => String, {nullable: true})
    @Column({
        type: "enum",
        enum: MediaType,
        default: MediaType.Image,
        nullable: true
    })
        mediaType: MediaType

    @Field(() => Float, { nullable: true })
    @Column({ type: "float", default: 10, nullable: true })
        point: number

    @Field(() => String)
    @Column({ type: "varchar", length: 2000 })
        question: string

    @Field(() => [QuizQuestionAnswerEntity], {nullable: true})
    @OneToMany(() => QuizQuestionAnswerEntity, (quizAnswer) => quizAnswer.quizQuestion, { cascade: true, nullable: true })
        answers: Array<QuizQuestionAnswerEntity>

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => QuizEntity)
    @ManyToOne(() => QuizEntity, (quiz) => quiz.questions, {onDelete : "CASCADE"})
    @JoinColumn({ name: "quizId" })
        quiz: QuizEntity
    
    @Field(() => Boolean, { nullable: true })
        answered?: boolean
    
    @Field(() => Int, { nullable: true })
        numberOfCorrectAnswers?: number

    @Field(() => Boolean, { nullable: true })
        corrected?: boolean

    @Field(() => QuizAttemptQuestionEntity)
    @OneToMany(() => QuizAttemptQuestionEntity, (quizAttemptQuestions) => quizAttemptQuestions.quizQuestion)
        attemptQuestions : QuizAttemptQuestionEntity
}