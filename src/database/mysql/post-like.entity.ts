import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import UserEntity from "./user.entity"
import PostEntity from "./post.entity"

@Entity("post_like")
export default class PostLikeEntity {
  @PrimaryGeneratedColumn("uuid")
      postLikeId: string

  @Column({ type: "uuid", length: 36 })
      userId: string

  @Column({ type: "uuid", length: 36 })
      postId: string

  @CreateDateColumn()
      createdAt: Date

  @UpdateDateColumn()
      updatedAt: Date

  @Column({
      type: "boolean",
      default: false,
  })
      isDeleted: boolean

  @ManyToOne(() => UserEntity, (user) => user.postLikes)
  @JoinColumn({ name: "userId" })
      user: UserEntity

  @ManyToOne(() => PostEntity, (post) => post.postLikes)
  @JoinColumn({ name: "postId" })
      post: PostEntity
}
