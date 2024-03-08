import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from "typeorm"
import { UserEntity } from "./user.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { PostEntity } from "./post.entity"

@ObjectType()
@Entity("post_comment_like")
export class PostCommentLikeEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        postCommentLikeId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        userId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => Boolean)
    @Column({
        type: "boolean",
        default: true,
    })
        liked: boolean

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        postCommentId: string

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.postReacts)
    @JoinColumn({ name: "userId" })
        user: UserEntity

    @Field(() => PostEntity)
    @ManyToOne(() => PostCommentEntity, (postComment) => postComment.postCommentLikes, {
        onDelete: "CASCADE"
    })
    @JoinColumn({ name: "postCommentId" })
        postComment: PostCommentEntity
}