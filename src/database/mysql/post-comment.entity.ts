import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
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
import { AccountEntity } from "./account.entity"
import { PostCommentLikeEntity } from "./post-comment-like.entity"
import { PostCommentMediaEntity } from "./post-comment-media.entity"
import { PostCommentReplyEntity } from "./post-comment-reply.entity"
import { PostEntity } from "./post.entity"
import { ReportPostCommentEntity } from "./report-post-comment.entity"
import { TransactionDetailEntity } from "./transaction-detail.entity"

@ObjectType()
@Entity("post_comment")
export class PostCommentEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        postCommentId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        creatorId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        postId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => String)
    @Column({ type: "longtext", nullable: true })
        html: string

    @Field(() => Boolean)
    @Column({ type: "boolean", default: false })
        isSolution: boolean

    @Field(() => Boolean)
    @Column({ type: "boolean", default: false })
        isDisabled: boolean

    @Field(() => PostEntity)
    @ManyToOne(() => PostEntity, (post) => post.postComments, { onDelete: "CASCADE" })
    @JoinColumn({ name: "postId" })
        post: PostEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.postComments)
    @JoinColumn({ name: "creatorId" })
        creator: AccountEntity

    @Field(() => [PostCommentMediaEntity])
    @OneToMany(
        () => PostCommentMediaEntity,
        (postCommentMedia) => postCommentMedia.postComment,
        { cascade: true },
    )
        postCommentMedias: Array<PostCommentMediaEntity>

    @OneToMany(
        () => PostCommentLikeEntity,
        (postCommentLike) => postCommentLike.postComment,
    )
        postCommentLikes: Array<PostCommentLikeEntity>

    @OneToMany(
        () => PostCommentReplyEntity,
        (postCommentReply) => postCommentReply.postComment,
    )
        postCommentReplies: Array<PostCommentReplyEntity>

    @Field(() => [ReportPostCommentEntity])
    @OneToMany(
        () => ReportPostCommentEntity,
        (reportPostComment) => reportPostComment.reportedPostComment,
        { onDelete: "CASCADE" },
    )
        postCommentReports: Array<ReportPostCommentEntity>
    
    @Field(() => [TransactionDetailEntity], { nullable: true })
    @OneToMany(
        () => TransactionDetailEntity,
        (transactionDetail) => transactionDetail.postComment,
        { nullable: true },
    )
        transactionDetails?: Array<TransactionDetailEntity>

    //graphql
    @Field(() => Int, { nullable: true })
        numberOfLikes?: number
    @Field(() => Int, { nullable: true })
        numberOfReplies?: number
    @Field(() => Boolean, { nullable: true })
        liked?: boolean
    @Field(() => Boolean, { nullable: true })
        isCommentOwner?: boolean
    @Field(() => Boolean, { nullable: true })
        isRewardable?: boolean
    @Field(() => Boolean, {nullable : true})
        isReported? : boolean
    @Field(() => Int, { nullable: true })
        numberOfReports?: number
}
