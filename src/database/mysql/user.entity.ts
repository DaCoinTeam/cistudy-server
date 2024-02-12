import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import { UserKind, UserRole } from "@definitions"
import { SessionEntity } from "./session.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { PostReactEntity } from "./post-react.entity"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { PostEntity } from "./post.entity"
import { CourseEntity } from "./course.entity"

@ObjectType()
@Entity("user")
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  	userId: string

  @Field(() => String)
  @Column({ type: "varchar", length: 50, default: null })
  	email: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 64, default: null })
  	password: string

  @Field(() => String, { nullable: true })
  @Column({ type: "uuid", length: 36, default: null })
  	avatarId: string

    @Field(() => String, { nullable: true })
  @Column({ type: "uuid", length: 36, default: null })
  	coverPhotoId: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 12, default: null })
  	phoneNumber: string

  @Field(() => Float, { nullable: true })
  @Column({
  	type: "decimal",
  	precision: 10,
  	scale: 5,
  	default: 0,
  })
  	balance: number

  @Field(() => UserRole)
  @Column({
  	type: "enum",
  	enum: UserRole,
  	default: UserRole.User,
  })
  	role: UserRole

  @Field(() => String, { nullable: true })
  @Column({
  	type: "uuid",
  	default: null,
  })
  	walletId: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 50, default: null })
  	firstName: string

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 50, default: null })
  	lastName: string

  @Field(() => Date, { nullable: true })
  @Column({ type: "date", default: null })
  	birthdate: Date

  @Field(() => Boolean)
  @Column({ type: "boolean", default: false })
  	verified: boolean

  @Field(() => UserKind)
  @Column({
  	type: "enum",
  	enum: UserKind,
  	default: UserKind.Local,
  })
  	kind: UserKind

  @Field(() => String, { nullable: true })
  @Column({ type: "varchar", length: 128, default: null })
  	externalId: string

  @OneToMany(() => SessionEntity, (session) => session.user)
  	sessions: SessionEntity[]

  @OneToMany(() => PostCommentEntity, (postComment) => postComment.user)
  	postComments: PostCommentEntity[]

  @OneToMany(() => PostReactEntity, (postReact) => postReact.user)
  	postReacts: PostReactEntity[]

  @OneToMany(() => EnrolledInfoEntity, (enrolledInfo) => enrolledInfo.user)
  	enrolledInfos: EnrolledInfoEntity[]

  @OneToMany(() => PostEntity, (post) => post.creator)
  	posts: PostEntity[]

  @OneToMany(() => CourseEntity, (course) => course.creator)
  	courses: CourseEntity[]
}