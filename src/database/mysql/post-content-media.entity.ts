import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm"

import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostContentEntity } from "./post-content.entity"

@ObjectType()
@Entity("post_content_media")
export class PostContentMediaEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      postContentMediaId: string

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
      position: number

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      mediaId: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      postContentId: string

  @Field(() => PostContentEntity)
  @ManyToOne(
      () => PostContentEntity,
      (postContent) => postContent.postContentMedias,
  )
  @JoinColumn({ name: "postContentId" })
      postContent: PostContentEntity
}
