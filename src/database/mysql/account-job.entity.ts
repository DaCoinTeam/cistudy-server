import { Field, ID, ObjectType } from "@nestjs/graphql"
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
@Entity("account-job")
export class AccountJobEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        accountJobId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 50 })
        companyName: string

    @Field(() => ID)
    @Column({
        type: "uuid",
        length: 36,
        default: null,
    })
        companyThumbnailId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 50 })
        role: string

    @Field(() => Date)
    @Column({ type: "date" })
        startDate: Date

    @Field(() => Date, {nullable: true})
    @Column({ type: "date", nullable: true })
        endDate: Date

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.accountJobs, { nullable: true })
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

}
