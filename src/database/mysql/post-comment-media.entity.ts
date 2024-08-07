import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm"

import { MediaType } from "@common"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostCommentEntity } from "./post-comment.entity"

@ObjectType()
@Entity("post_comment_media")
export class PostCommentMediaEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        postCommentMediaId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        mediaId: string

    @Field(() => String)
    @Column({ type: "uuid", length: 36 })
        postCommentId: string

    @Field(() => String)
    @Column({
        type: "enum",
        enum: MediaType,
        default: MediaType.Image,
    })
        mediaType: MediaType

    @Field(() => PostCommentEntity)
    @ManyToOne(
        () => PostCommentEntity,
        (postComment) => postComment.postCommentMedias,
        {
            onDelete: "CASCADE"
        }
    )
    @JoinColumn({ name: "postCommentId" })
        postComment: PostCommentEntity
}
