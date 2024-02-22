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
import { Field, Int } from "@nestjs/graphql"
import { PostCommentContentMediaEntity } from "./post-comment-content-media.entity"

@Entity("post_comment_content")
export class PostCommentContentEntity {
  @PrimaryGeneratedColumn("uuid")
      postCommentContentId: string

  @Column({ type: "uuid", length: 36 })
      postCommentId: string

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
      position: number

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 1000, nullable: true })
      text: string

  @Column({ type: "enum", enum: ContentType, default: ContentType.Text })
      contentType: ContentType
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

