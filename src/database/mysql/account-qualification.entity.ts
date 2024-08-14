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
@Entity("account-qualification")
export class AccountQualificationEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        accountQualificationId: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 36 })
        name: string

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        fileId: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.accountQualifications, {onDelete: "CASCADE"})
    @JoinColumn({ name: "accountId" })
        account: AccountEntity

}
