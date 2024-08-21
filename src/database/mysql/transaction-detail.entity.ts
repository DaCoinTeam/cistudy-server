import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { AccountEntity } from "./account.entity"
import { CourseEntity } from "./course.entity"
import { TransactionEntity } from "./transaction.enity"
import { PostEntity } from "./post.entity"
import { PostCommentEntity } from "./post-comment.entity"

@ObjectType()
@Entity("transaction-detail")
export class TransactionDetailEntity {
    @Field(() => ID, { nullable: true})
    @PrimaryGeneratedColumn("uuid")
        transactionDetailId: string

    @Field(() => ID, { nullable: true})
    @Column({ type: "uuid", length: 36, nullable: true })
        accountId: string

    @Field(() => ID, { nullable: true})
    @Column({ type: "uuid", length: 36, nullable: true })
        courseId: string

    @Field(() => ID, { nullable: true})
    @Column({ type: "uuid", length: 36, nullable: true })
        postId: string
    
    @Field(() => ID, { nullable: true})
    @Column({ type: "uuid", length: 36, nullable: true })
        postCommentId: string
    
    @Field(() => ID, { nullable: true})
    @Column({ type: "uuid", length: 36, nullable: true })
        transactionId: string

    @Field(() => Boolean, { defaultValue: false })
    @Column({ type: "boolean", default: false })
        directIn: boolean
    
    @Field(() => Float, { nullable: true})
    @Column({ type: "float", default: 0 })
        payAmount: number

    @Field(() => AccountEntity, { nullable: true})
    @ManyToOne(() => AccountEntity, (account) => account.transactionDetails, {onDelete: "CASCADE", nullable: true} )
    @JoinColumn({ name: "accountId" })
        account?: AccountEntity
    
    @Field(() => CourseEntity, { nullable: true})
    @ManyToOne(() => CourseEntity, (course) => course.transactionDetails, {onDelete: "CASCADE", nullable: true} )
    @JoinColumn({ name: "courseId" })
        course?: CourseEntity

    @Field(() => PostEntity, { nullable: true})
    @ManyToOne(() => PostEntity, (post) => post.transactionDetails, {onDelete: "CASCADE", nullable: true} )
    @JoinColumn({ name: "postId" })
        post?: PostEntity
        
    @Field(() => PostCommentEntity, { nullable: true})
    @ManyToOne(() => PostCommentEntity, (postComment) => postComment.transactionDetails, {onDelete: "CASCADE", nullable: true} )
    @JoinColumn({ name: "postCommentId" })
        postComment?: PostCommentEntity

    @Field(() => TransactionEntity, { nullable: true})
    @ManyToOne(() => TransactionEntity, (transaction) => transaction.transactionDetails, {onDelete: "CASCADE", nullable: true} )
    @JoinColumn({ name: "transactionId" })
        transaction?: TransactionEntity
}