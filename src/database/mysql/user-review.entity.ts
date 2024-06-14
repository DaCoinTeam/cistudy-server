import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne
} from "typeorm"
import { Field, Float, ID, ObjectType, Int } from "@nestjs/graphql"
import { CourseEntity } from "./course.entity"
import { AccountEntity } from "./account.entity"

@ObjectType()
@Entity("user-review")
export class UserReviewEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        userReviewId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        userId: string

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", length: 200, nullable: true })
        content: string

    @Field(() => Int, { defaultValue: 0 })
    @Column({ type: "int", default: 0 })
        rating: number

    @Field(() => Date)
    @CreateDateColumn()
    createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
    updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity,(course) => course.courseReview ,{ nullable: true })
    @JoinColumn({ name: "accountId" })
    account: AccountEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity,(account) => account.courseReview ,{ nullable: true })
    @JoinColumn({ name: "userId" })
    user: AccountEntity
}
