import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm"

import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostCommentContentEntity } from "./post-comment-content.entity"

@ObjectType()
@Entity("post_comment_content_media")
export class PostCommentContentMediaEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      postCommentContentMediaId: string

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
      position: number

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      mediaId: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      postCommentContentId: string

  @Field(() => PostCommentContentEntity)
  @ManyToOne(
      () => PostCommentContentEntity,
      (postCommentContent) => postCommentContent.postCommentContentMedias,
  )
  @JoinColumn({ name: "postCommentContentId" })
      postCommentContent: PostCommentContentEntity
}
