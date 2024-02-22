import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"
import { PostEntity } from "./post.entity"
import { PostCommentContentEntity } from "./post-comment-content.entity"
import { UserEntity } from "./user.entity"
import { PostCommentLikeEntity } from "./post-comment-like.entity"

@Entity("post_comment")
export class PostCommentEntity {
  @PrimaryGeneratedColumn("uuid")
      postCommentId: string

  @Column({ type: "uuid", length: 36 })
      creatorId: string

  @Column({ type: "uuid", length: 36 })
      postId: string

  @CreateDateColumn()
      createdAt: Date

  @UpdateDateColumn()
      updatedAt: Date

  @ManyToOne(
      () => PostCommentEntity,
      (postComment) => postComment.childComments,
  )
  @JoinColumn({ name: "fatherCommentId" })
  @Column({ type: "uuid", default: null, length: 36 })
      fatherCommentId: string

  @ManyToOne(() => PostEntity, (post) => post.postComments)
  @JoinColumn({ name: "postId" })
      post: PostEntity

  @ManyToOne(() => UserEntity, (user) => user.postComments)
  @JoinColumn({ name: "creatorId" })
      creator: UserEntity

  @OneToMany(
      () => PostCommentContentEntity,
      (postCommentContent) => postCommentContent.postComment,
      { cascade: true },
  )
      postCommentContents: Array<Partial<PostCommentContentEntity>>

  @OneToMany(
      () => PostCommentLikeEntity,
      (postCommentLike) => postCommentLike.postComment,
  )
      postCommentLikes: Array<PostCommentLikeEntity>

  @OneToMany(
      () => PostCommentEntity,
      (postComment) => postComment.fatherCommentId,
      { cascade: true },
  )
      childComments: PostCommentEntity[]
}
