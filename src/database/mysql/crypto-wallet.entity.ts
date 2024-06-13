import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Field, ID, ObjectType } from "@nestjs/graphql"
import { AccountEntity } from "./account.entity"

@ObjectType()
@Entity("crypto-wallet")
export class CryptoWalletEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn("uuid")
        cryptoWalletId: string

    @Field(() => String)
    @Column({ type: "varchar", length: 100 })
        address: string

    @Field(() => Date)
    @CreateDateColumn()
        createdAt: Date

    @Field(() => Date)
    @UpdateDateColumn()
        updatedAt: Date

    @Field(() => ID)
    @Column({ type: "uuid", length: 36 })
        accountId: string

    @Field(() => AccountEntity)
    @ManyToOne(() => AccountEntity, (account) => account.cryptoWallets, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "accountId" })
        account: AccountEntity
}
