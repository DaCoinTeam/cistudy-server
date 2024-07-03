import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { AccountEntity } from "./account.entity"
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
      accountId: string

  @Field(() => String)
  @Column({ type: "uuid", length: 36 })
      postId: string

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => AccountEntity)
  @ManyToOne(() => AccountEntity, (account) => account.postReacts)
  @JoinColumn({ name: "accountId" })
      account: AccountEntity

  @Field(() => PostEntity)
  @ManyToOne(() => PostEntity, (post) => post.postReacts, {
      onDelete: "CASCADE",
  })
  @JoinColumn({ name: "postId" })
      post: PostEntity
}
