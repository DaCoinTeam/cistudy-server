import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany
} from "typeorm"
import { PostCommentEntity } from "./post-comment.entity"
import { ContentType } from "@common"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostCommentContentMediaEntity } from "./post-comment-content-media.entity"

@ObjectType()
@Entity("post_comment_content")
export class PostCommentContentEntity {

    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        postCommentContentId: string

    @Field(() => String)
    @Column({ type: "uuid", length: 36 })
        postCommentId: string

    @Field(() => Int)
    @Column({ type: "int", default: 0 })
        position: number

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 1000, nullable: true })
        text: string

    @Field(() => String)
    @Column({ type: "enum", enum: ContentType, default: ContentType.Text })
        contentType: ContentType

    @Field(() => PostCommentEntity)
    @ManyToOne(
        () => PostCommentEntity,
        (postComment) => postComment.postCommentContents,
    )
    @JoinColumn({ name: "postCommentId" })
        postComment: PostCommentEntity

    @Field(() => [PostCommentContentMediaEntity], { nullable: true })
    @OneToMany(() => PostCommentContentMediaEntity, (postCommentContentMedia) => postCommentContentMedia.postCommentContent, {
        cascade: true
    })
        postCommentContentMedias: Array<PostCommentContentMediaEntity>
}

