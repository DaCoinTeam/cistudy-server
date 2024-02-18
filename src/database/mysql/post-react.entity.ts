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
import { PostMySqlEntity, UserMySqlEntity } from "."

@ObjectType()
@Entity("post_react")
export class PostReactEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      postReactId: string

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

  @Field(() => UserMySqlEntity)
  @ManyToOne(() => UserEntity, (user) => user.postReacts)
  @JoinColumn({ name: "userId" })
      user: UserEntity

  @Field(() => PostMySqlEntity)
  @ManyToOne(() => PostEntity, (post) => post.postReacts)
  @JoinColumn({ name: "postId" })
      post: PostEntity
}
