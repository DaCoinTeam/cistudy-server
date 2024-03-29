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
import { CourseEntity } from "./course.entity"
import { PostCommentEntity } from "./post-comment.entity"
import { PostLikeEntity } from "./post-like.entity"
import { UserEntity } from "./user.entity"
import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import { UserMySqlEntity } from "."
import { PostMediaEntity } from "./post-media.entity"

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

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => String)
    @Column({ type: "longtext" })
        html: string

    @ManyToOne(() => CourseEntity, (course) => course.posts)
    @JoinColumn({ name: "courseId" })
        course: CourseEntity

    @Field(() => UserMySqlEntity)
    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({ name: "creatorId" })
        creator: UserEntity

    @Field(() => [PostMediaEntity])
    @OneToMany(() => PostMediaEntity, (postMedia) => postMedia.post, {
        cascade: true,
    })
        postMedias: Array<PostMediaEntity>

    @Field(() => [PostCommentEntity])
    @OneToMany(() => PostCommentEntity, (postComment) => postComment.post)
        postComments: Array<PostCommentEntity>

    @Field(() => [PostLikeEntity])
    @OneToMany(() => PostLikeEntity, (postReact) => postReact.post)
        postReacts: Array<PostLikeEntity>

    //graphql
    @Field(() => Int, { nullable: true })
        numberOfLikes?: number
    @Field(() => Int, { nullable: true })
        numberOfComments?: number
    @Field(() => Boolean, { nullable: true })
        liked?: boolean
}
