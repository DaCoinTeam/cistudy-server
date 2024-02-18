import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany
} from "typeorm"

import { PostEntity } from "./post.entity"
import { ContentType } from "@common"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { PostContentMediaEntity } from "./post-content-media.entity"

@ObjectType()
@Entity("post_content")
export class PostContentEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  	postContentId: string

  @Field(() => Int)
  @Column({ type: "int", default: 0 })
  	position: number

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 1000, nullable: true })
  	text: string

  @Field(() => String)
  @Column({ type: "enum", enum: ContentType, default: ContentType.Text })
  	contentType: ContentType

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
  	postId: string

  @Field(() => PostEntity)
  @ManyToOne(() => PostEntity, (post) => post.postContents)
  @JoinColumn({ name: "postId" })
  	post: PostEntity

  @Field(() => [PostContentMediaEntity], { nullable: true })
  @OneToMany(() => PostContentMediaEntity, (postContentMedia) => postContentMedia.postContent, {
      cascade: true
  })
      postContentMedias: Array<PostContentMediaEntity>
}
  