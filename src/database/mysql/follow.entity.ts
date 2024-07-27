import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm"
import { AccountEntity } from "./account.entity"

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
        followedAccountId: string

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

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.followerRelations)
    @JoinColumn({ name: "followerId" })
        follower: AccountEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (post) => post.followedAccountRelations)
    @JoinColumn({ name: "followedAccountId" })
        followedAccount: AccountEntity
}
