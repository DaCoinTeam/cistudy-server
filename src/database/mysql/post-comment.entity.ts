import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { PostEntity } from "./post.entity"
import { AccountEntity } from "./account.entity"
import { PostCommentLikeEntity } from "./post-comment-like.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostCommentMediaEntity } from "./post-comment-media.entity"
import { PostCommentReplyEntity } from "./post-comment-reply.entity"

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
    @Column({ type: "longtext" })
        html: string

    @Field(() => PostEntity)
    @ManyToOne(() => PostEntity, (post) => post.postComments, { onDelete: "CASCADE"})
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

    //graphql
    @Field(() => Int, { nullable: true })
        numberOfLikes?: number
     @Field(() => Int, { nullable: true })
         numberOfReplies?: number
    @Field(() => Boolean, { nullable: true })
        liked?: boolean
}
