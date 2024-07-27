import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { PostEntity } from "./post.entity"

@ObjectType()
@Entity("post_comment_reply")
export class PostCommentReplyEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        postCommentReplyId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        creatorId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        postCommentId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => String)
    @Column({ type: "longtext" })
        content: string

    @Field(() => PostEntity)
    @ManyToOne(() => PostCommentEntity, (postComment) => postComment.postCommentReplies, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "postCommentId" })
        postComment: PostCommentEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.postComments)
    @JoinColumn({ name: "creatorId" })
        creator: AccountEntity
}
