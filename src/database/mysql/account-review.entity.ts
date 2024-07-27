import { Field, ID, Int, ObjectType } from "@nestjs/graphql"
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm"
import { AccountEntity } from "./account.entity"

@ObjectType()
@Entity("account-review")
export class AccountReviewEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        accountReviewId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        reviewedAccountId: string

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
    @ManyToOne(() => AccountEntity, (course) => course.courseReview ,{ nullable: true })
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.courseReview ,{ nullable: true })
    @JoinColumn({ name: "reviewedAccountId" })
        reviewedAccount: AccountEntity
}
