import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { UserEntity } from "./user.entity"
import { PostEntity } from "./post.entity"
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
@Entity("post_like")
export class PostLikeEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      postLikeId: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      userId: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      postId: string

  @Field(() => Boolean)
  @Column({
      type: "boolean",
      default: true,
  })
      liked: boolean

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.postReacts)
  @JoinColumn({ name: "userId" })
      user: UserEntity

  @Field(() => PostEntity)
  @ManyToOne(() => PostEntity, (post) => post.postReacts, {
      onDelete: "CASCADE",
  })
  @JoinColumn({ name: "postId" })
      post: PostEntity
}
