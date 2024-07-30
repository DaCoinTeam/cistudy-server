import { Field, ID, ObjectType } from "@nestjs/graphql"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import { AccountEntity } from "./account.entity"
import { QuizAttemptAnswerEntity } from "./quiz-attempt-answer.entity"
import { ResourceEntity } from "./resource.entity"

@ObjectType()
@Entity("complete-resource")
export class CompleteResourceEntity {
    @Field(() => ID, { nullable: true })
    @PrimaryGeneratedColumn("uuid")
        completeResourceId: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36 })
        resourceId: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.completeResources, { onDelete: "CASCADE" })
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

    @Field(() => ResourceEntity)
    @ManyToOne(() => ResourceEntity, (resource) => resource.completeResources, { onDelete : "CASCADE" })
    @JoinColumn({ name: "resourceId" })
        resource: ResourceEntity
    
    @Field(() => [QuizAttemptAnswerEntity])
    @OneToMany(() => QuizAttemptAnswerEntity, (attemptAnswers) => attemptAnswers.quizAttempt)
        attemptAnswers: Array<QuizAttemptAnswerEntity>

}