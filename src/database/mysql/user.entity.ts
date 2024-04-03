import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Field, Float, ID, Int, ObjectType } from "@nestjs/graphql"
import { UserKind, UserRole } from "@common"
import { SessionEntity } from "./session.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { PostLikeEntity } from "./post-like.entity"
import { EnrolledInfoEntity } from "./enrolled-info.entity"
import { PostEntity } from "./post.entity"
import { CourseEntity } from "./course.entity"
import { FollowEntity } from "./follow.entity"
import { CryptoWalletEntity } from "./crypto-wallet.entity"

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

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, default: null })
        avatarId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, default: null })
        avatarUrl: string

    @Field(() => ID, { nullable: true })
    @Column({ type: "uuid", length: 36, default: null })
        coverPhotoId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 12, default: null })
        phoneNumber: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 60, default: null })
        username: string

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
        userRole: UserRole

    @Field(() => ID, { nullable: true })
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

    @Field(() => String)
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
        sessions: Array<SessionEntity>

    @OneToMany(() => PostCommentEntity, (postComment) => postComment.creator)
        postComments: Array<PostCommentEntity>

    @OneToMany(() => PostLikeEntity, (postReact) => postReact.user)
        postReacts: Array<PostLikeEntity>

    @OneToMany(() => EnrolledInfoEntity, (enrolledInfo) => enrolledInfo.user)
        enrolledInfos: Array<EnrolledInfoEntity>

    @Field(() => [CryptoWalletEntity])
    @OneToMany(() => CryptoWalletEntity, (cryptoWallet) => cryptoWallet.user)
        cryptoWallets: Array<CourseEntity>

    @Field(() => [PostEntity])
    @OneToMany(() => PostEntity, (post) => post.creator)
        posts: Array<PostEntity>

    @Field(() => [CourseEntity])
    @OneToMany(() => CourseEntity, (course) => course.creator)
        courses: Array<CourseEntity>

    @Field(() => [FollowEntity])
    @OneToMany(() => FollowEntity, (user) => user.follower)
        followerRelations: Array<FollowEntity>

    @Field(() => [FollowEntity])
    @OneToMany(() => FollowEntity, (user) => user.followedUser)
        followedUserRelations: Array<FollowEntity>

    //graphql
    @Field(() => Boolean)
        followed?: boolean
    @Field(() => Int)
        numberOfFollowers?: number
}
