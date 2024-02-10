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

@Entity("post_react")
export class PostReactEntity {
  @PrimaryGeneratedColumn("uuid")
      postReactId: string

  @Column({ type: "uuid", length: 36 })
      userId: string

  @Column({ type: "uuid", length: 36 })
      postId: string

  @Column({
      type: "boolean",
      default: true,
  })
      liked: boolean
  
  @CreateDateColumn()
      createdAt: Date

  @UpdateDateColumn()
      updatedAt: Date

  @ManyToOne(() => UserEntity, (user) => user.postReacts)
  @JoinColumn({ name: "userId" })
      user: UserEntity

  @ManyToOne(() => PostEntity, (post) => post.postReacts)
  @JoinColumn({ name: "postId" })
      post: PostEntity
}
