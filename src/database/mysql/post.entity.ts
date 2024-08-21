import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { AccountEntity } from "./account.entity"
import { CourseEntity } from "./course.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { PostLikeEntity } from "./post-like.entity"
import { PostMediaEntity } from "./post-media.entity"
import { ReportPostEntity } from "./report-post.entity"
import { TransactionDetailEntity } from "./transaction-detail.entity"

@ObjectType()
@Entity("post")
export class PostEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
      postId: string

  @Field(() => String)
  @Column({ type: "varchar", length: 500 })
      title: string

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      creatorId: string

  @Field(() => ID)
  @Column({ type: "uuid", length: 36 })
      courseId: string

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
      isCompleted: boolean

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
      isRewardable: boolean

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
      isDisabled: boolean

  @Field(() => Date)
  @CreateDateColumn()
      createdAt: Date

  @Field(() => Date)
  @UpdateDateColumn()
      updatedAt: Date

  @Field(() => String)
  @Column({ type: "longtext", nullable: true })
      html: string

  @Field(() => CourseEntity)
  @ManyToOne(() => CourseEntity, (course) => course.posts)
  @JoinColumn({ name: "courseId" })
      course: CourseEntity

  @Field(() => AccountEntity)
  @ManyToOne(() => AccountEntity, (account) => account.posts)
  @JoinColumn({ name: "creatorId" })
      creator: AccountEntity

  @Field(() => [PostMediaEntity])
  @OneToMany(() => PostMediaEntity, (postMedia) => postMedia.post, {
      cascade: true,
  })
      postMedias: Array<PostMediaEntity>

  @Field(() => [PostCommentEntity], { nullable: true })
  @OneToMany(() => PostCommentEntity, (postComment) => postComment.post)
      postComments: Array<PostCommentEntity>

  @Field(() => [PostLikeEntity])
  @OneToMany(() => PostLikeEntity, (postReact) => postReact.post)
      postReacts: Array<PostLikeEntity>

  @Field(() => [ReportPostEntity])
  @OneToMany(() => ReportPostEntity, (postReport) => postReport.reportedPost)
      postReports: Array<ReportPostEntity>
  @Field(() => [TransactionDetailEntity], { nullable: true })
  @OneToMany(
      () => TransactionDetailEntity,
      (transactionDetail) => transactionDetail.post,
      { nullable: true },
  )
      transactionDetails?: Array<TransactionDetailEntity>

  //graphql
  @Field(() => Boolean, { nullable: true })
      liked?: boolean
  @Field(() => Boolean, { nullable: true })
      isPostOwner?: boolean
  @Field(() => Int, { nullable: true })
      numberOfLikes?: number
  @Field(() => Int, { nullable: true })
      numberOfComments?: number
  @Field(() => Int, { nullable: true })
      numberOfRewardableLikesLeft?: number
  @Field(() => Int, { nullable: true })
      numberOfRewardableCommentsLeft?: number
  @Field(() => Boolean, { nullable: true })
      isReported?: boolean
  @Field(() => Int, { nullable: true })
      numberOfReports?: number
  @Field(() => Boolean, { nullable: true })
      isInstructor?: boolean
}
