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
import { Field, ID, ObjectType } from "@nestjs/graphql"

@ObjectType()
@Entity("follow")
export class FollowEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        followId: string

    @Field(() => String)
    @Column({ type: "uuid", length: 36 })
        followerId: string

    @Field(() => String)
    @Column({ type: "uuid", length: 36 })
        followedUserId: string

    @Field(() => Boolean)
    @Column({
        type: "boolean",
        default: true,
    })
        followed: boolean

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (user) => user.followerRelations)
    @JoinColumn({ name: "followerId" })
        follower: UserEntity

    @Field(() => UserEntity)
    @ManyToOne(() => UserEntity, (post) => post.followedUserRelations)
    @JoinColumn({ name: "followedUserId" })
        followedUser: UserEntity
}
